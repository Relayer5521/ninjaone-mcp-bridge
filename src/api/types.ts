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
