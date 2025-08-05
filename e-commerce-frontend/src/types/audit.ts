export interface AuditLogEntry {
  id: string;
  timestamp: string;
  user: string;
  action: string;
  resource: string;
  details: string;
  status: 'success' | 'failed';
}

export interface AuditLogFilter {
  startDate?: string;
  endDate?: string;
  user?: string;
  action?: string;
  resource?: string;
  status?: 'success' | 'failed';
  search?: string;
}

export interface AuditState {
  logs: AuditLogEntry[];
  loading: boolean;
  error: string | null;
  filter: AuditLogFilter;
  total: number;
  page: number;
  pageSize: number;
}
