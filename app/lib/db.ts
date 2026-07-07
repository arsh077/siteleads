import 'server-only';

// Re-export Firestore functions
export {
  getUsers,
  saveUsers,
  createEmployee,
  toggleUserStatus,
  updateUserCredentials,
  getLeads,
  saveLeads,
  getUpdates,
  saveUpdates,
  addLeadResponse,
  getBatches,
  saveBatches,
  distributeLeadsEqually,
  redistributeAllLeadsEqually,
  parseLeadsFromText,
  initializeFirestoreData,
} from './firebase/firestore-db';

// Type exports (shared across the app)
export interface User {
  id: string;
  username: string;
  passwordHash: string;
  name: string;
  role: 'admin' | 'employee';
  isActive: boolean;
  createdAt: string;
}

export type LeadStatus = 
  | 'New' 
  | 'In Progress' 
  | 'Called' 
  | 'Follow Up' 
  | 'Interested' 
  | 'Not Interested' 
  | 'Converted';

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
