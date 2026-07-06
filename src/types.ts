export type UserRole = 'admin' | 'employee';

export type LeadStatus = 
  | 'New' 
  | 'In Progress' 
  | 'Called' 
  | 'Follow Up' 
  | 'Interested' 
  | 'Not Interested' 
  | 'Converted';

export interface User {
  id: string;
  username: string;
  password?: string;
  name: string;
  role: UserRole;
  isActive: boolean;
  createdAt: string;
}

export interface Lead {
  id: string;
  batchId?: string;
  name: string;
  phone: string;
  email?: string;
  source?: string;
  assignedToId: string;
  assignedToName?: string;
  status: LeadStatus;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  lastActionAt: string;
}

export interface LeadUpdate {
  id: string;
  leadId: string;
  userId: string;
  userName: string;
  status: LeadStatus;
  note: string;
  nextFollowupDate?: string;
  createdAt: string;
}

export interface LeadBatch {
  id: string;
  uploadedBy: string;
  imageUrls: string[];
  leadCount: number;
  notes?: string;
  createdAt: string;
}

export interface DistributionStats {
  totalLeads: number;
  activeEmployeesCount: number;
  assignedPerEmployee: Record<string, number>;
  lastRunTime?: string;
}
