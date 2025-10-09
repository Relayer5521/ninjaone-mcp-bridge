export interface Organization {
  id: number;
  name: string;
  nodeApprovalMode: string;
  description: string | null;
  tags: string[];
}

export interface Device {
  id: number;
  organizationId: number;
  nodeClass: string;
  nodeRoleId: number | null;
  displayName: string;
  systemName: string;
  dnsName: string | null;
  netBiosName: string | null;
  approvalStatus: string;
  offline: boolean;
  lastContact: string;
  lastUpdate: string;
  ipAddresses: string[];
  macAddresses: string[];
  os: {
    name: string;
    version: string;
    build: string;
  };
  system: {
    manufacturer: string;
    model: string;
    biosSerial: string;
  };
}

export interface Alert {
  uid: string;
  deviceId: number;
  deviceName: string;
  organizationId: number;
  severity: 'CRITICAL' | 'HIGH' | 'MODERATE' | 'LOW' | 'INFO';
  title: string;
  message: string;
  sourceType: string;
  createTime: string;
  updateTime: string;
  acknowledged: boolean;
}

export interface Activity {
  id: string;
  activityTime: string;
  deviceId?: number;
  organizationId?: number;
  type: string;
  status: string;
  message: string;
  user: string;
  data?: Record<string, any>;
}

export interface Software {
  name: string;
  version: string;
  publisher: string;
  installDate: string;
  size: number;
}

export interface CustomField {
  id: string;
  name: string;
  value: any;
  type: string;
}

export interface DeviceRole {
  id: number;
  name: string;
  description: string;
  nodeClass: string;
}

export interface OSPatch {
  patchId: string;
  deviceId: number;
  kb: string;
  name: string;
  severity: string;
  status: 'INSTALLED' | 'MISSING' | 'FAILED';
  installDate?: string;
}

export interface AntivirusStatus {
  deviceId: number;
  productName: string;
  enabled: boolean;
  upToDate: boolean;
  lastScan: string;
  threatCount: number;
}

export interface AuditLogEntry {
  timestamp: string;
  action: string;
  success: boolean;
  details: Record<string, any>;
  deviceId?: number;
  organizationId?: number;
}

// Phase 1 Query Types
export interface QueryParams {
  filter?: string;
  pageSize?: number;
  after?: string;
}

export interface DeviceHealthResponse {
  data: Array<{
    deviceId: number;
    organizationId: number;
    deviceName: string;
    health: 'HEALTHY' | 'WARNING' | 'CRITICAL' | 'OFFLINE';
    lastContact: string;
    issues: Array<{
      type: string;
      severity: string;
      message: string;
    }>;
  }>;
  metadata: {
    pageSize: number;
    after?: string;
    totalItems?: number;
  };
}

export interface OSPatchStatusResponse {
  data: Array<{
    deviceId: number;
    deviceName: string;
    osPatches: {
      critical: number;
      important: number;
      moderate: number;
      low: number;
      other: number;
      totalPending: number;
      lastScanTime: string;
    };
  }>;
  metadata: {
    pageSize: number;
    after?: string;
  };
}

export interface AntivirusStatusResponse {
  data: Array<{
    deviceId: number;
    deviceName: string;
    antivirus: {
      product: string;
      status: 'ACTIVE' | 'INACTIVE' | 'NOT_INSTALLED';
      definitionsUpToDate: boolean;
      realTimeProtection: boolean;
      lastScanDate: string;
      threats: Array<{
        name: string;
        severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
        status: 'QUARANTINED' | 'REMOVED' | 'ACTIVE';
        detectedDate: string;
      }>;
    };
  }>;
  metadata: {
    pageSize: number;
    after?: string;
  };
}

export interface Policy {
  id: number;
  name: string;
  description: string;
  policyType: 'WINDOWS_PATCH' | 'MAC_PATCH' | 'LINUX_PATCH' | 'ANTIVIRUS' | 'BACKUP' | 'CUSTOM';
  enabled: boolean;
  nodeRoleId: number;
  nodeRoleName: string;
  conditions: any;
  createdAt: string;
  updatedAt: string;
}

export interface Group {
  id: number;
  name: string;
  description: string;
  type: 'STATIC' | 'DYNAMIC';
  filter?: string;
  deviceCount: number;
  organizationId?: number;
  createdAt: string;
  updatedAt: string;
}

export interface ActiveJob {
  id: string;
  type: 'SCRIPT' | 'PATCH' | 'SOFTWARE_INSTALL' | 'SOFTWARE_UNINSTALL' | 'REBOOT' | 'BACKUP';
  status: 'RUNNING' | 'PENDING' | 'CANCELLING';
  deviceId: number;
  deviceName: string;
  organizationId: number;
  organizationName: string;
  startedAt: string;
  progress?: number;
  estimatedCompletion?: string;
  initiatedBy: string;
}

export interface ScheduledTask {
  id: number;
  name: string;
  description: string;
  taskType: 'SCRIPT' | 'PATCH' | 'BACKUP' | 'MAINTENANCE' | 'REPORT';
  schedule: {
    frequency: 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'CUSTOM';
    cronExpression?: string;
    nextRun: string;
    lastRun?: string;
  };
  enabled: boolean;
  targets: {
    groups?: number[];
    devices?: number[];
    organizations?: number[];
  };
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface ExtendedCustomField {
  id: number;
  name: string;
  fieldName: string;
  description: string;
  type: 'TEXT' | 'NUMBER' | 'DATE' | 'DROPDOWN' | 'CHECKBOX' | 'MULTISELECT';
  scope: 'DEVICE' | 'ORGANIZATION' | 'LOCATION' | 'USER';
  required: boolean;
  defaultValue?: any;
  options?: string[];
  validation?: {
    min?: number;
    max?: number;
    regex?: string;
    maxLength?: number;
  };
  createdAt: string;
  updatedAt: string;
}

// Phase 1 Response Types
export interface DeviceRolesResponse {
  data: DeviceRole[];
  metadata: {
    pageSize: number;
    after?: string;
    totalItems?: number;
  };
}

export interface PoliciesResponse {
  data: Policy[];
  metadata: {
    pageSize: number;
    after?: string;
    totalItems?: number;
  };
}

export interface GroupsResponse {
  data: Group[];
  metadata: {
    pageSize: number;
    after?: string;
  };
}

export interface ActiveJobsResponse {
  data: ActiveJob[];
  metadata: {
    totalRunning: number;
    totalPending: number;
    pageSize: number;
    after?: string;
  };
}

export interface ScheduledTasksResponse {
  data: ScheduledTask[];
  metadata: {
    pageSize: number;
    after?: string;
    totalItems?: number;
  };
}

export interface CustomFieldsResponse {
  data: ExtendedCustomField[];
  metadata: {
    pageSize: number;
    after?: string;
    totalItems?: number;
  };
}

// ============ PHASE 2 TYPES ============

// Advanced Device Query Types
export interface AdvancedDeviceQueryParams {
  df?: string;  // Device filter using NinjaOne df syntax
  pageSize?: number;
  after?: string;
}

export interface AdvancedDeviceQueryResponse {
  data: Device[];
  metadata: {
    pageSize: number;
    after?: string;
    totalReturned: number;
  };
  summary: {
    byOrganization: Record<number, { name: string; count: number }>;
    byClass: Record<string, number>;
    byApprovalStatus: Record<string, number>;
    onlineCount: number;
    offlineCount: number;
  };
}

// Software Inventory Query Types
export interface SoftwareInventoryQueryParams {
  softwareName?: string;          // Software name to search for
  deviceClass?: string;            // Filter by device class (WINDOWS_WORKSTATION, etc.)
  organizationId?: number;         // Filter by organization
  status?: 'INSTALLED' | 'UNINSTALLED'; // Software status
  pageSize?: number;
  after?: string;
}

export interface SoftwareInstallation {
  deviceId: number;
  deviceName: string;
  organizationId: number;
  organizationName?: string;
  softwareName: string;
  softwareVersion: string;
  softwarePublisher: string;
  installDate?: number;           // Unix timestamp
  deviceClass: string;
  status: 'INSTALLED' | 'UNINSTALLED';
}

export interface SoftwareInventoryQueryResponse {
  data: SoftwareInstallation[];
  metadata: {
    pageSize: number;
    after?: string;
    totalReturned: number;
  };
  summary: {
    uniqueDevices: number;
    uniqueSoftwareNames: number;
    byDeviceClass: Record<string, number>;
    byOrganization: Record<number, { name: string; count: number }>;
    byVersion: Record<string, number>;
    byPublisher: Record<string, number>;
  };
}