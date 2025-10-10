import axios, { AxiosInstance, AxiosError } from 'axios';
import { logger } from '../utils/logger.js';
import {
  Organization,
  Device,
  Alert,
  Activity,
  Software,
  DeviceRole,
  OSPatch,
  AuditLogEntry,
  // Phase 1 types
  QueryParams,
  DeviceHealthResponse,
  OSPatchStatusResponse,
  AntivirusStatusResponse,
  Policy,
  Group,
  ActiveJob,
  ScheduledTask,
  ExtendedCustomField,
  // Phase 2 types
  AdvancedDeviceQueryParams,
  AdvancedDeviceQueryResponse,
  SoftwareInventoryQueryParams,
  SoftwareInventoryQueryResponse,
  SoftwareInstallation,
  AdvancedActivityQueryParams,
  AdvancedActivityQueryResponse,
  EnhancedActivity
} from './types.js';
import { config } from '../config.js';

export class NinjaOneClient {
  private api: AxiosInstance;
  private accessToken: string | null = null;
  private tokenExpiresAt: Date | null = null;

  constructor() {
    this.api = axios.create({
      baseURL: config.ninjaone.apiUrl,
      timeout: 30000,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });

    this.api.interceptors.request.use(
      async (config) => {
        await this.ensureAuthenticated();
        if (this.accessToken) {
          config.headers['Authorization'] = `Bearer ${this.accessToken}`;
        }
        logger.debug(`API Request: ${config.method?.toUpperCase()} ${config.url}`);
        return config;
      },
      (error) => {
        logger.error('Request error:', error);
        return Promise.reject(error);
      }
    );

    this.api.interceptors.response.use(
      (response) => {
        logger.debug(`API Response: ${response.status} ${response.config.url}`);
        return response;
      },
      (error: AxiosError) => {
        logger.error(`API Error: ${error.response?.status} ${error.config?.url}`, {
          data: error.response?.data
        });
        return Promise.reject(error);
      }
    );
  }

  private async ensureAuthenticated(): Promise<void> {
    if (this.accessToken && this.tokenExpiresAt && this.tokenExpiresAt > new Date()) {
      return;
    }

    logger.info('Authenticating with NinjaOne API...');
    
    try {
      const response = await axios.post(
        `${config.ninjaone.apiUrl}/oauth/token`,
        new URLSearchParams({
          grant_type: 'client_credentials',
          client_id: config.ninjaone.clientId,
          client_secret: config.ninjaone.clientSecret,
          scope: 'monitoring management'
        }),
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        }
      );

      this.accessToken = response.data.access_token;
      const expiresIn = response.data.expires_in || 3600;
      this.tokenExpiresAt = new Date(Date.now() + (expiresIn - 60) * 1000);
      
      logger.info('Successfully authenticated with NinjaOne');
    } catch (error) {
      logger.error('Authentication failed:', error);
      throw new Error('Failed to authenticate with NinjaOne API');
    }
  }

  private async request<T>(endpoint: string, options: any = {}): Promise<T> {
    const response = await this.api(endpoint, options);
    return response.data;
  }

  private async auditLog(entry: Partial<AuditLogEntry>): Promise<void> {
    const logEntry: AuditLogEntry = {
      timestamp: new Date().toISOString(),
      action: entry.action || 'unknown',
      success: entry.success ?? true,
      details: entry.details || {},
      deviceId: entry.deviceId,
      organizationId: entry.organizationId
    };
    logger.info('Audit:', logEntry);
  }

  // Organization Methods
  async getOrganizations(): Promise<Organization[]> {
    const orgs = await this.request<Organization[]>('/v2/organizations');
    await this.auditLog({
      action: 'get_organizations',
      success: true,
      details: { count: orgs.length }
    });
    return orgs;
  }

  async getOrganization(orgId: number): Promise<Organization> {
    const org = await this.request<Organization>(`/v2/organization/${orgId}`);
    await this.auditLog({
      action: 'get_organization',
      success: true,
      organizationId: orgId,
      details: { name: org.name }
    });
    return org;
  }

  // Device Methods
  async getDevices(orgId?: number): Promise<Device[]> {
    const endpoint = orgId ? `/v2/organization/${orgId}/devices` : '/v2/devices';
    const devices = await this.request<Device[]>(endpoint);
    await this.auditLog({
      action: 'get_devices',
      success: true,
      organizationId: orgId,
      details: { count: devices.length }
    });
    return devices;
  }

  async getDevice(deviceId: number): Promise<Device> {
    const device = await this.request<Device>(`/v2/device/${deviceId}`);
    await this.auditLog({
      action: 'get_device',
      success: true,
      deviceId,
      details: { name: device.displayName }
    });
    return device;
  }

  // Alert Methods
  async getAlerts(filters?: { severity?: string; status?: string }): Promise<Alert[]> {
    let endpoint = '/v2/alerts';
    const params = new URLSearchParams();
    if (filters?.severity) params.append('severity', filters.severity);
    if (filters?.status) params.append('status', filters.status);
    if (params.toString()) endpoint += `?${params.toString()}`;

    const alerts = await this.request<Alert[]>(endpoint);
    await this.auditLog({
      action: 'get_alerts',
      success: true,
      details: { count: alerts.length, filters }
    });
    return alerts;
  }

  // Activity Methods
  async getActivities(filters?: { deviceId?: number; type?: string }): Promise<Activity[]> {
    let endpoint = '/v2/activities';
    const params = new URLSearchParams();
    if (filters?.deviceId) params.append('deviceId', filters.deviceId.toString());
    if (filters?.type) params.append('type', filters.type);
    if (params.toString()) endpoint += `?${params.toString()}`;

    const activities = await this.request<Activity[]>(endpoint);
    await this.auditLog({
      action: 'get_activities',
      success: true,
      details: { count: activities.length, filters }
    });
    return activities;
  }

  // Software Inventory
  async getDeviceSoftware(deviceId: number): Promise<Software[]> {
    const software = await this.request<Software[]>(`/v2/device/${deviceId}/software`);
    await this.auditLog({
      action: 'get_device_software',
      success: true,
      deviceId,
      details: { count: software.length }
    });
    return software;
  }

  // OS Patches
  async getOSPatches(deviceId: number): Promise<OSPatch[]> {
    const patches = await this.request<OSPatch[]>(`/v2/device/${deviceId}/os-patches`);
    await this.auditLog({
      action: 'get_os_patches',
      success: true,
      deviceId,
      details: { count: patches.length }
    });
    return patches;
  }

  // Device Roles
  async getDeviceRoles(): Promise<DeviceRole[]> {
    const roles = await this.request<DeviceRole[]>('/v2/device-roles');
    await this.auditLog({
      action: 'get_device_roles',
      success: true,
      details: { count: roles.length }
    });
    return roles;
  }

  // Health Check
  async healthCheck(): Promise<boolean> {
    try {
      await this.request('/v2/organizations');
      return true;
    } catch (error) {
      logger.error('Health check failed:', error);
      return false;
    }
  }

  // ============ PHASE 1 QUERY METHODS ============

  // Query Device Health
  async queryDeviceHealth(params?: QueryParams): Promise<DeviceHealthResponse> {
    const queryString = new URLSearchParams();
    if (params?.filter) queryString.append('df', params.filter);
    if (params?.pageSize) queryString.append('pageSize', params.pageSize.toString());
    if (params?.after) queryString.append('after', params.after);

    const endpoint = `/v2/queries/device-health${queryString.toString() ? `?${queryString.toString()}` : ''}`;
    const response = await this.request<DeviceHealthResponse>(endpoint);
    
    await this.auditLog({
      action: 'query_device_health',
      success: true,
      details: { 
        deviceCount: response.data.length,
        filter: params?.filter 
      }
    });
    return response;
  }

  // Query OS Patch Status
  async queryOSPatchStatus(params?: QueryParams): Promise<OSPatchStatusResponse> {
    const queryString = new URLSearchParams();
    if (params?.filter) queryString.append('df', params.filter);
    if (params?.pageSize) queryString.append('pageSize', params.pageSize.toString());
    if (params?.after) queryString.append('after', params.after);

    const endpoint = `/v2/queries/os-patch-status${queryString.toString() ? `?${queryString.toString()}` : ''}`;
    const response = await this.request<OSPatchStatusResponse>(endpoint);
    
    await this.auditLog({
      action: 'query_os_patches',
      success: true,
      details: { 
        deviceCount: response.data.length,
        filter: params?.filter 
      }
    });
    return response;
  }

  // Query Antivirus Status
  async queryAntivirusStatus(params?: QueryParams): Promise<AntivirusStatusResponse> {
    const queryString = new URLSearchParams();
    if (params?.filter) queryString.append('df', params.filter);
    if (params?.pageSize) queryString.append('pageSize', params.pageSize.toString());
    if (params?.after) queryString.append('after', params.after);

    const endpoint = `/v2/queries/antivirus-status${queryString.toString() ? `?${queryString.toString()}` : ''}`;
    const response = await this.request<AntivirusStatusResponse>(endpoint);
    
    await this.auditLog({
      action: 'query_antivirus_status',
      success: true,
      details: { 
        deviceCount: response.data.length,
        filter: params?.filter 
      }
    });
    return response;
  }

  // Get Policies
  async getPolicies(params?: { pageSize?: number; after?: string }): Promise<Policy[]> {
    const queryString = new URLSearchParams();
    if (params?.pageSize) queryString.append('pageSize', params.pageSize.toString());
    if (params?.after) queryString.append('after', params.after);

    const endpoint = `/v2/policies${queryString.toString() ? `?${queryString.toString()}` : ''}`;
    const policies = await this.request<Policy[]>(endpoint);
    
    await this.auditLog({
      action: 'get_policies',
      success: true,
      details: { count: policies.length }
    });
    return policies;
  }

  // Get Groups
  async getGroups(params?: { pageSize?: number; after?: string }): Promise<Group[]> {
    const queryString = new URLSearchParams();
    if (params?.pageSize) queryString.append('pageSize', params.pageSize.toString());
    if (params?.after) queryString.append('after', params.after);

    const endpoint = `/v2/groups${queryString.toString() ? `?${queryString.toString()}` : ''}`;
    const groups = await this.request<Group[]>(endpoint);
    
    await this.auditLog({
      action: 'get_groups',
      success: true,
      details: { count: groups.length }
    });
    return groups;
  }

  // Get Active Jobs
  async getActiveJobs(params?: { pageSize?: number; after?: string }): Promise<ActiveJob[]> {
    const queryString = new URLSearchParams();
    if (params?.pageSize) queryString.append('pageSize', params.pageSize.toString());
    if (params?.after) queryString.append('after', params.after);

    const endpoint = `/v2/jobs/active${queryString.toString() ? `?${queryString.toString()}` : ''}`;
    const jobs = await this.request<ActiveJob[]>(endpoint);
    
    await this.auditLog({
      action: 'get_active_jobs',
      success: true,
      details: { count: jobs.length }
    });
    return jobs;
  }

  // Get Scheduled Tasks
  async getScheduledTasks(params?: { pageSize?: number; after?: string }): Promise<ScheduledTask[]> {
    const queryString = new URLSearchParams();
    if (params?.pageSize) queryString.append('pageSize', params.pageSize.toString());
    if (params?.after) queryString.append('after', params.after);

    const endpoint = `/v2/scheduled-tasks${queryString.toString() ? `?${queryString.toString()}` : ''}`;
    const tasks = await this.request<ScheduledTask[]>(endpoint);
    
    await this.auditLog({
      action: 'get_scheduled_tasks',
      success: true,
      details: { count: tasks.length }
    });
    return tasks;
  }

  // Get Custom Fields
  async getCustomFields(params?: { 
    scope?: 'DEVICE' | 'ORGANIZATION' | 'LOCATION' | 'USER';
    pageSize?: number; 
    after?: string 
  }): Promise<ExtendedCustomField[]> {
    const queryString = new URLSearchParams();
    if (params?.scope) queryString.append('scope', params.scope);
    if (params?.pageSize) queryString.append('pageSize', params.pageSize.toString());
    if (params?.after) queryString.append('after', params.after);

    const endpoint = `/v2/custom-fields${queryString.toString() ? `?${queryString.toString()}` : ''}`;
    const fields = await this.request<ExtendedCustomField[]>(endpoint);
    
    await this.auditLog({
      action: 'get_custom_fields',
      success: true,
      details: { 
        count: fields.length,
        scope: params?.scope 
      }
    });
    return fields;
  }

  // ============ PHASE 2 METHODS ============

  /**
   * Query devices with advanced filtering using NinjaOne's df (device filter) syntax.
   * Supports complex boolean logic and field-specific queries.
   * 
   * df Syntax Examples:
   * - "org=123" - Single organization
   * - "class=WINDOWS_SERVER AND offline" - Offline Windows servers
   * - "status=APPROVED AND online" - Online approved devices
   * - "created after 2024-01-01" - Devices created after date
   * - "role in (1,2,3)" - Devices in specific roles
   * 
   * @param params Query parameters including df filter, pageSize, and pagination cursor
   * @returns AdvancedDeviceQueryResponse with devices, metadata, and summary
   */
  async queryDevicesAdvanced(params?: AdvancedDeviceQueryParams): Promise<AdvancedDeviceQueryResponse> {
    try {
      const queryString = new URLSearchParams();
      if (params?.df) queryString.append('df', params.df);
      if (params?.pageSize) queryString.append('pageSize', params.pageSize.toString());
      if (params?.after) queryString.append('after', params.after);

      const endpoint = `/v2/devices${queryString.toString() ? `?${queryString.toString()}` : ''}`;
      logger.debug(`Querying devices with df: ${params?.df || 'none'}`);
      
      const devices = await this.request<Device[]>(endpoint);
      
      // Build summary statistics
      const summary = {
        byOrganization: {} as Record<number, { name: string; count: number }>,
        byClass: {} as Record<string, number>,
        byApprovalStatus: {} as Record<string, number>,
        onlineCount: 0,
        offlineCount: 0
      };

      devices.forEach(device => {
        // Count by organization
        if (!summary.byOrganization[device.organizationId]) {
          summary.byOrganization[device.organizationId] = {
            name: `Org ${device.organizationId}`,
            count: 0
          };
        }
        summary.byOrganization[device.organizationId].count++;

        // Count by device class
        const deviceClass = device.nodeClass || 'UNKNOWN';
        summary.byClass[deviceClass] = (summary.byClass[deviceClass] || 0) + 1;

        // Count by approval status
        const status = device.approvalStatus || 'UNKNOWN';
        summary.byApprovalStatus[status] = (summary.byApprovalStatus[status] || 0) + 1;

        // Count online/offline
        if (device.offline) {
          summary.offlineCount++;
        } else {
          summary.onlineCount++;
        }
      });

      const response: AdvancedDeviceQueryResponse = {
        data: devices,
        metadata: {
          pageSize: params?.pageSize || devices.length,
          after: undefined, // NinjaOne API may not return this for /v2/devices
          totalReturned: devices.length
        },
        summary
      };

      await this.auditLog({
        action: 'query_devices_advanced',
        success: true,
        details: {
          df: params?.df || 'none',
          deviceCount: devices.length,
          onlineCount: summary.onlineCount,
          offlineCount: summary.offlineCount
        }
      });

      return response;
    } catch (error) {
      logger.error('Failed to query devices with advanced filter:', error);
      await this.auditLog({
        action: 'query_devices_advanced',
        success: false,
        details: {
          df: params?.df || 'none',
          error: error instanceof Error ? error.message : 'Unknown error'
        }
      });
      throw error;
    }
  }
/**
   * Query software inventory across devices
   * Searches for installed software with advanced filtering
   */
  async querySoftwareInventory(params?: SoftwareInventoryQueryParams): Promise<SoftwareInventoryQueryResponse> {
    try {
      const queryString = new URLSearchParams();
      if (params?.softwareName) queryString.append('softwareName', params.softwareName);
      if (params?.deviceClass) queryString.append('df', `class=${params.deviceClass}`);
      if (params?.organizationId) {
        const existingDf = queryString.get('df');
        const orgFilter = `org=${params.organizationId}`;
        if (existingDf) {
          queryString.set('df', `${existingDf} AND ${orgFilter}`);
        } else {
          queryString.append('df', orgFilter);
        }
      }
      if (params?.status) queryString.append('status', params.status);
      if (params?.pageSize) queryString.append('pageSize', params.pageSize.toString());
      if (params?.after) queryString.append('after', params.after);

      const endpoint = `/v2/queries/software${queryString.toString() ? `?${queryString.toString()}` : ''}`;
      logger.debug(`Querying software inventory: ${params?.softwareName || 'all software'}`);

      const response = await this.request<{ results: any[] }>(endpoint);

      const installations: SoftwareInstallation[] = (response.results || []).map((item: any) => ({
        deviceId: item.deviceId,
        deviceName: item.deviceName,
        organizationId: item.organizationId,
        organizationName: item.organizationName,
        softwareName: item.name,
        softwareVersion: item.version || 'Unknown',
        softwarePublisher: item.publisher || 'Unknown',
        installDate: item.installDate,
        deviceClass: item.deviceClass,
        status: item.status || 'INSTALLED'
      })) || [];

      // Build summary statistics
      const summary = {
        uniqueDevices: new Set(installations.map(i => i.deviceId)).size,
        uniqueSoftwareNames: new Set(installations.map(i => i.softwareName)).size,
        byDeviceClass: {} as Record<string, number>,
        byOrganization: {} as Record<number, { name: string; count: number }>,
        byVersion: {} as Record<string, number>,
        byPublisher: {} as Record<string, number>
      };

      installations.forEach(installation => {
        // Count by device class
        summary.byDeviceClass[installation.deviceClass] = 
          (summary.byDeviceClass[installation.deviceClass] || 0) + 1;

        // Count by organization
        if (!summary.byOrganization[installation.organizationId]) {
          summary.byOrganization[installation.organizationId] = {
            name: installation.organizationName || `Org ${installation.organizationId}`,
            count: 0
          };
        }
        summary.byOrganization[installation.organizationId].count++;

        // Count by version
        summary.byVersion[installation.softwareVersion] = 
          (summary.byVersion[installation.softwareVersion] || 0) + 1;

        // Count by publisher
        summary.byPublisher[installation.softwarePublisher] = 
          (summary.byPublisher[installation.softwarePublisher] || 0) + 1;
      });

      const result: SoftwareInventoryQueryResponse = {
        data: installations,
        metadata: {
          pageSize: params?.pageSize || installations.length,
          after: undefined, // NinjaOne API may not provide pagination cursor
          totalReturned: installations.length
        },
        summary
      };

      await this.auditLog({
        action: 'query_software_inventory',
        success: true,
        details: {
          softwareName: params?.softwareName || 'all',
          deviceClass: params?.deviceClass || 'all',
          organizationId: params?.organizationId || 'all',
          resultsFound: installations.length,
          uniqueDevices: summary.uniqueDevices
        }
      });

      return result;
    } catch (error) {
      logger.error('Failed to query software inventory:', error);
      await this.auditLog({
        action: 'query_software_inventory',
        success: false,
        details: {
          softwareName: params?.softwareName || 'all',
          error: error instanceof Error ? error.message : 'Unknown error'
        }
      });
      throw error;
    }
  }

  /**
   * Query activities with advanced filtering including date ranges.
   * Enhances the Phase 1 getActivities with date range support and rich summaries.
   * 
   * @param params Query parameters including deviceId, organizationId, type, date range
   * @returns AdvancedActivityQueryResponse with activities, metadata, and summary statistics
   */
  async queryActivitiesAdvanced(params?: AdvancedActivityQueryParams): Promise<AdvancedActivityQueryResponse> {
    try {
      const queryString = new URLSearchParams();
      if (params?.deviceId) queryString.append('deviceId', params.deviceId.toString());
      if (params?.organizationId) queryString.append('organizationId', params.organizationId.toString());
      if (params?.type) queryString.append('type', params.type);
      if (params?.startDate) queryString.append('startDate', params.startDate);
      if (params?.endDate) queryString.append('endDate', params.endDate);
      if (params?.pageSize) queryString.append('pageSize', params.pageSize.toString());
      if (params?.after) queryString.append('after', params.after);

      const endpoint = `/v2/activities${queryString.toString() ? `?${queryString.toString()}` : ''}`;
      logger.debug(`Querying activities with params: ${JSON.stringify(params || {})}`);
      
      const apiResponse = await this.request<any>(endpoint);
      
      // Handle both array and paginated response formats
      let activities: Activity[];
      let pageToken: string | undefined;
      
      if (Array.isArray(apiResponse)) {
        activities = apiResponse;
      } else if (apiResponse && typeof apiResponse === 'object') {
        // Handle paginated response
        activities = apiResponse.activities || apiResponse.data || apiResponse.results || [];
        pageToken = apiResponse.pageToken || apiResponse.nextPageToken || apiResponse.after;
      } else {
        logger.warn('Unexpected API response format:', apiResponse);
        activities = [];
      }
      
      // Enhance activities with additional context if needed
      const enhancedActivities: EnhancedActivity[] = activities.map(activity => ({
        ...activity,
        // deviceName and organizationName might come from API or need to be fetched
        deviceName: activity.deviceId ? `Device ${activity.deviceId}` : undefined,
        organizationName: activity.organizationId ? `Org ${activity.organizationId}` : undefined
      }));

      // Build summary statistics
      const summary = {
        totalActivities: enhancedActivities.length,
        byType: {} as Record<string, number>,
        byStatus: {} as Record<string, number>,
        byDevice: {} as Record<number, { name: string; count: number }>,
        byOrganization: {} as Record<number, { name: string; count: number }>,
        dateRange: {
          earliest: '',
          latest: ''
        }
      };

      let earliestDate: Date | null = null;
      let latestDate: Date | null = null;

      enhancedActivities.forEach(activity => {
        // Count by type
        summary.byType[activity.type] = (summary.byType[activity.type] || 0) + 1;

        // Count by status
        summary.byStatus[activity.status] = (summary.byStatus[activity.status] || 0) + 1;

        // Count by device
        if (activity.deviceId) {
          if (!summary.byDevice[activity.deviceId]) {
            summary.byDevice[activity.deviceId] = {
              name: activity.deviceName || `Device ${activity.deviceId}`,
              count: 0
            };
          }
          summary.byDevice[activity.deviceId].count++;
        }

        // Count by organization
        if (activity.organizationId) {
          if (!summary.byOrganization[activity.organizationId]) {
            summary.byOrganization[activity.organizationId] = {
              name: activity.organizationName || `Org ${activity.organizationId}`,
              count: 0
            };
          }
          summary.byOrganization[activity.organizationId].count++;
        }

        // Track date range
        const activityDate = new Date(activity.activityTime);
        if (earliestDate === null || activityDate.getTime() < earliestDate.getTime()) {
          earliestDate = activityDate;
        }
        if (latestDate === null || activityDate.getTime() > latestDate.getTime()) {
          latestDate = activityDate;
        }
      });

      // Set date range with explicit type assertions
      if (earliestDate !== null) {
        summary.dateRange.earliest = (earliestDate as Date).toISOString();
      }
      if (latestDate !== null) {
        summary.dateRange.latest = (latestDate as Date).toISOString();
      }

      const response: AdvancedActivityQueryResponse = {
        data: enhancedActivities,
        metadata: {
          pageSize: params?.pageSize || enhancedActivities.length,
          after: pageToken, // Use pagination token from API response if available
          totalReturned: enhancedActivities.length,
          dateRange: params?.startDate && params?.endDate ? {
            start: params.startDate,
            end: params.endDate
          } : undefined
        },
        summary
      };

      await this.auditLog({
        action: 'query_activities_advanced',
        success: true,
        deviceId: params?.deviceId,
        organizationId: params?.organizationId,
        details: {
          type: params?.type || 'all',
          startDate: params?.startDate || 'none',
          endDate: params?.endDate || 'none',
          activitiesFound: enhancedActivities.length,
          uniqueTypes: Object.keys(summary.byType).length
        }
      });

      return response;
    } catch (error) {
      logger.error('Failed to query activities with advanced filter:', error);
      await this.auditLog({
        action: 'query_activities_advanced',
        success: false,
        deviceId: params?.deviceId,
        organizationId: params?.organizationId,
        details: {
          error: error instanceof Error ? error.message : 'Unknown error'
        }
      });
      throw error;
    }
  }
}

export default NinjaOneClient;
