import axios, { AxiosInstance, AxiosError } from 'axios';
import { logger } from '../utils/logger';
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
  ExtendedCustomField
} from './types';
import { config } from '../config';

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
}

export default NinjaOneClient;
