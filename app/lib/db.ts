import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

// Define schemas matching our types.ts
export interface User {
  id: string;
  username: string;
  passwordHash: string; // we use simple plaintext comparison for Phase 1
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

interface DatabaseSchema {
  users: User[];
  leads: Lead[];
  updates: LeadUpdate[];
  batches: LeadBatch[];
}

const DB_PATH = path.join(process.cwd(), 'db.json');

const INITIAL_USERS: User[] = [
  {
    id: 'u-admin-1',
    username: 'admin',
    passwordHash: '123',
    name: 'Admin Master',
    role: 'admin',
    isActive: true,
    createdAt: new Date().toISOString()
  },
  {
    id: 'u-emp-1',
    username: 'rohan',
    passwordHash: '123',
    name: 'Rohan Sharma',
    role: 'employee',
    isActive: true,
    createdAt: new Date().toISOString()
  },
  {
    id: 'u-emp-2',
    username: 'priya',
    passwordHash: '123',
    name: 'Priya Singh',
    role: 'employee',
    isActive: true,
    createdAt: new Date().toISOString()
  },
  {
    id: 'u-emp-3',
    username: 'amit',
    passwordHash: '123',
    name: 'Amit Verma',
    role: 'employee',
    isActive: true,
    createdAt: new Date().toISOString()
  },
  {
    id: 'u-emp-4',
    username: 'sneha',
    passwordHash: '123',
    name: 'Sneha Gupta',
    role: 'employee',
    isActive: false, // Inactive employee example
    createdAt: new Date().toISOString()
  }
];

const INITIAL_LEADS: Lead[] = [
  {
    id: 'ld-101',
    batchId: 'batch-01',
    name: 'Sandeep Malhotra',
    phone: '+91 98765 43210',
    email: 'sandeep.m@gmail.com',
    source: 'Facebook Ad Dump #1',
    assignedToId: 'u-emp-1',
    assignedToName: 'Rohan Sharma',
    status: 'In Progress',
    notes: 'Called yesterday. Requested product catalog PDF on WhatsApp.',
    createdAt: new Date(Date.now() - 3600000 * 24 * 2).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 2).toISOString(),
    lastActionAt: new Date(Date.now() - 3600000 * 2).toISOString()
  },
  {
    id: 'ld-102',
    batchId: 'batch-01',
    name: 'Anjali Deshmukh',
    phone: '+91 88234 11092',
    email: 'anjali.d@yahoo.com',
    source: 'Facebook Ad Dump #1',
    assignedToId: 'u-emp-2',
    assignedToName: 'Priya Singh',
    status: 'Called',
    notes: 'Discussed pricing tier. Needs follow up tomorrow at 3 PM.',
    createdAt: new Date(Date.now() - 3600000 * 24 * 2).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 15).toISOString(),
    lastActionAt: new Date(Date.now() - 3600000 * 15).toISOString()
  },
  {
    id: 'ld-103',
    batchId: 'batch-01',
    name: 'Vikram Rathore',
    phone: '+91 77665 44332',
    email: 'vikram.r@outlook.com',
    source: 'Facebook Ad Dump #1',
    assignedToId: 'u-emp-3',
    assignedToName: 'Amit Verma',
    status: 'Follow Up',
    notes: 'High interest in bulk licenses. Scheduled demo.',
    createdAt: new Date(Date.now() - 3600000 * 24 * 2).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 1).toISOString(),
    lastActionAt: new Date(Date.now() - 3600000 * 1).toISOString()
  },
  {
    id: 'ld-104',
    batchId: 'batch-01',
    name: 'Karan Mehra',
    phone: '+91 90088 77665',
    email: 'karan.mehra@tech.in',
    source: 'Facebook Ad Dump #1',
    assignedToId: 'u-emp-1',
    assignedToName: 'Rohan Sharma',
    status: 'New',
    notes: 'Freshly allocated from batch dump.',
    createdAt: new Date(Date.now() - 3600000 * 5).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 5).toISOString(),
    lastActionAt: new Date(Date.now() - 3600000 * 5).toISOString()
  },
  {
    id: 'ld-105',
    batchId: 'batch-01',
    name: 'Neha Kakkar',
    phone: '+91 91234 56789',
    email: 'neha.k@gmail.com',
    source: 'Facebook Ad Dump #1',
    assignedToId: 'u-emp-2',
    assignedToName: 'Priya Singh',
    status: 'Interested',
    notes: 'Sent payment link.',
    createdAt: new Date(Date.now() - 3600000 * 4).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 4).toISOString(),
    lastActionAt: new Date(Date.now() - 3600000 * 4).toISOString()
  },
  {
    id: 'ld-106',
    batchId: 'batch-01',
    name: 'Rajesh Kumar',
    phone: '+91 99887 76655',
    email: 'rajesh.k@company.com',
    source: 'Facebook Ad Dump #1',
    assignedToId: 'u-emp-3',
    assignedToName: 'Amit Verma',
    status: 'New',
    notes: 'Fresh lead allocated.',
    createdAt: new Date(Date.now() - 3600000 * 3).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 3).toISOString(),
    lastActionAt: new Date(Date.now() - 3600000 * 3).toISOString()
  }
];

const INITIAL_UPDATES: LeadUpdate[] = [
  {
    id: 'up-1',
    leadId: 'ld-101',
    userId: 'u-emp-1',
    userName: 'Rohan Sharma',
    status: 'In Progress',
    note: 'Initial call connected. Customer interested in corporate plan.',
    createdAt: new Date(Date.now() - 3600000 * 2).toISOString()
  },
  {
    id: 'up-2',
    leadId: 'ld-102',
    userId: 'u-emp-2',
    userName: 'Priya Singh',
    status: 'Called',
    note: 'Spoke with client. Asked to follow up tomorrow afternoon.',
    nextFollowupDate: '2026-07-05T15:00',
    createdAt: new Date(Date.now() - 3600000 * 15).toISOString()
  }
];

const INITIAL_BATCHES: LeadBatch[] = [
  {
    id: 'batch-01',
    uploadedBy: 'admin',
    imageUrls: [],
    leadCount: 6,
    notes: 'Initial Facebook campaign leads dump',
    createdAt: new Date(Date.now() - 3600000 * 24 * 2).toISOString()
  }
];

// Helper to initialize and read DB
function readDb(): DatabaseSchema {
  if (!fs.existsSync(DB_PATH)) {
    const defaultData: DatabaseSchema = {
      users: INITIAL_USERS,
      leads: INITIAL_LEADS,
      updates: INITIAL_UPDATES,
      batches: INITIAL_BATCHES
    };
    fs.writeFileSync(DB_PATH, JSON.stringify(defaultData, null, 2), 'utf-8');
    return defaultData;
  }
  try {
    const raw = fs.readFileSync(DB_PATH, 'utf-8');
    return JSON.parse(raw) as DatabaseSchema;
  } catch (e) {
    console.error("Failed to read database, resetting to default...", e);
    const defaultData: DatabaseSchema = {
      users: INITIAL_USERS,
      leads: INITIAL_LEADS,
      updates: INITIAL_UPDATES,
      batches: INITIAL_BATCHES
    };
    fs.writeFileSync(DB_PATH, JSON.stringify(defaultData, null, 2), 'utf-8');
    return defaultData;
  }
}

function writeDb(data: DatabaseSchema) {
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), 'utf-8');
}

// User Actions
export function getUsers(): User[] {
  return readDb().users;
}

export function saveUsers(users: User[]): void {
  const db = readDb();
  db.users = users;
  writeDb(db);
}

// Leads Actions
export function getLeads(): Lead[] {
  return readDb().leads;
}

export function saveLeads(leads: Lead[]): void {
  const db = readDb();
  db.leads = leads;
  writeDb(db);
}

// Updates Actions
export function getUpdates(): LeadUpdate[] {
  return readDb().updates;
}

export function saveUpdates(updates: LeadUpdate[]): void {
  const db = readDb();
  db.updates = updates;
  writeDb(db);
}

// Batches Actions
export function getBatches(): LeadBatch[] {
  return readDb().batches;
}

export function saveBatches(batches: LeadBatch[]): void {
  const db = readDb();
  db.batches = batches;
  writeDb(db);
}

// Add Response to a Lead
export function addLeadResponse(
  leadId: string,
  userId: string,
  userName: string,
  status: LeadStatus,
  note: string,
  nextFollowupDate?: string
): LeadUpdate {
  const db = readDb();
  const now = new Date().toISOString();

  const newUpdate: LeadUpdate = {
    id: `up-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    leadId,
    userId,
    userName,
    status,
    note,
    nextFollowupDate,
    createdAt: now
  };

  db.updates = [newUpdate, ...db.updates];

  // Update lead status and lastActionAt
  const leadIdx = db.leads.findIndex((l) => l.id === leadId);
  if (leadIdx !== -1) {
    db.leads[leadIdx] = {
      ...db.leads[leadIdx],
      status,
      notes: note ? note : db.leads[leadIdx].notes,
      updatedAt: now,
      lastActionAt: now
    };
  }

  writeDb(db);
  return newUpdate;
}


// Pure round-robin distribution
export function distributeLeadsEqually(
  rawLeadsToAssign: Array<{ name: string; phone: string; email?: string; source?: string }>,
  batchId?: string
): { assignedLeads: Lead[]; summaryText: string } {
  const db = readDb();
  const activeEmployees = db.users.filter((u) => u.role === 'employee' && u.isActive);

  if (activeEmployees.length === 0) {
    throw new Error('No active employees available for lead distribution! Please activate at least one employee in Admin Panel.');
  }

  const existingLeads = db.leads;

  // Count current total leads per active employee for fair round-robin balancing
  const employeeLeadCounts: Record<string, number> = {};
  activeEmployees.forEach((emp) => {
    employeeLeadCounts[emp.id] = existingLeads.filter((l) => l.assignedToId === emp.id).length;
  });

  const now = new Date().toISOString();
  const assignedLeads: Lead[] = [];
  const assignedCountsByEmp: Record<string, number> = {};
  activeEmployees.forEach((e) => (assignedCountsByEmp[e.name] = 0));

  // Round robin assignment: always pick the employee with the lowest current lead load
  rawLeadsToAssign.forEach((raw, idx) => {
    let leastLoadedEmp = activeEmployees[0];
    let minCount = employeeLeadCounts[leastLoadedEmp.id];

    for (let i = 1; i < activeEmployees.length; i++) {
      const emp = activeEmployees[i];
      if (employeeLeadCounts[emp.id] < minCount) {
        leastLoadedEmp = emp;
        minCount = employeeLeadCounts[emp.id];
      }
    }

    employeeLeadCounts[leastLoadedEmp.id]++;
    assignedCountsByEmp[leastLoadedEmp.name]++;

    const newLead: Lead = {
      id: `ld-${Date.now()}-${idx}-${Math.floor(Math.random() * 1000)}`,
      batchId: batchId || `batch-${Date.now()}`,
      name: raw.name || `Lead #${idx + 1}`,
      phone: raw.phone || 'N/A',
      email: raw.email || '',
      source: raw.source || 'Screenshot Dump Upload',
      assignedToId: leastLoadedEmp.id,
      assignedToName: leastLoadedEmp.name,
      status: 'New',
      notes: 'Equal round-robin auto distribution',
      createdAt: now,
      updatedAt: now,
      lastActionAt: now
    };

    assignedLeads.push(newLead);
  });

  db.leads = [...assignedLeads, ...existingLeads];
  writeDb(db);

  const breakdown = Object.entries(assignedCountsByEmp)
    .map(([empName, count]) => `${empName}: ${count}`)
    .join(', ');

  const summaryText = `Equally distributed ${assignedLeads.length} leads across ${activeEmployees.length} active employees (${breakdown}).`;

  return { assignedLeads, summaryText };
}

// Re-distribute ALL existing leads equally across active employees
export function redistributeAllLeadsEqually(): { updatedCount: number; summaryText: string } {
  const db = readDb();
  const activeEmployees = db.users.filter((u) => u.role === 'employee' && u.isActive);

  if (activeEmployees.length === 0) {
    throw new Error('No active employees available to re-distribute leads.');
  }

  const existingLeads = db.leads;
  if (existingLeads.length === 0) {
    return { updatedCount: 0, summaryText: 'No leads found to redistribute.' };
  }

  const now = new Date().toISOString();
  const assignedCountsByEmp: Record<string, number> = {};
  activeEmployees.forEach((e) => (assignedCountsByEmp[e.name] = 0));

  let empIndex = 0;
  const updatedLeads = existingLeads.map((lead) => {
    const targetEmp = activeEmployees[empIndex % activeEmployees.length];
    empIndex++;
    assignedCountsByEmp[targetEmp.name]++;

    return {
      ...lead,
      assignedToId: targetEmp.id,
      assignedToName: targetEmp.name,
      updatedAt: now
    };
  });

  db.leads = updatedLeads;
  writeDb(db);

  const breakdown = Object.entries(assignedCountsByEmp)
    .map(([empName, count]) => `${empName}: ${count}`)
    .join(', ');

  return {
    updatedCount: updatedLeads.length,
    summaryText: `Re-balanced all ${updatedLeads.length} leads equally among ${activeEmployees.length} active employees (${breakdown}).`
  };
}

// Helper to extract leads from pasted/uploaded dump text line by line
export function parseLeadsFromText(rawText: string): Array<{ name: string; phone: string; email?: string }> {
  const lines = rawText.split('\n').map((l) => l.trim()).filter((l) => l.length > 0);
  const parsed: Array<{ name: string; phone: string; email?: string }> = [];

  for (const line of lines) {
    const phoneMatch = line.match(/(\+?\d{1,3}[-.\s]?)?\(?\d{3,5}\)?[-.\s]?\d{3,5}[-.\s]?\d{3,5}/);
    const emailMatch = line.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);

    const phone = phoneMatch ? phoneMatch[0] : '';
    const email = emailMatch ? emailMatch[0] : '';

    let name = line;
    if (phone) name = name.replace(phone, '');
    if (email) name = name.replace(email, '');
    name = name.replace(/[,;:]/g, ' ').trim();

    if (!name || name.length < 2) {
      name = `Lead ${parsed.length + 1}`;
    }

    parsed.push({
      name: name,
      phone: phone || '+91 ' + Math.floor(7000000000 + Math.random() * 2999999999),
      email
    });
  }

  return parsed;
}

// User CRUD operations
export function createEmployee(name: string, username: string, passwordHash: string): User {
  const db = readDb();
  if (db.users.some((u) => u.username.toLowerCase() === username.toLowerCase().trim())) {
    throw new Error('Username already exists! Please choose another username.');
  }

  const hashed = crypto.createHash('sha256').update(passwordHash || '123').digest('hex');

  const newUser: User = {
    id: `u-emp-${Date.now()}`,
    name: name.trim(),
    username: username.toLowerCase().trim(),
    passwordHash: hashed,
    role: 'employee',
    isActive: true,
    createdAt: new Date().toISOString()
  };

  db.users.push(newUser);
  writeDb(db);
  return newUser;
}

export function toggleUserStatus(userId: string): User {
  const db = readDb();
  const idx = db.users.findIndex((u) => u.id === userId);
  if (idx === -1) throw new Error('User not found');

  db.users[idx] = {
    ...db.users[idx],
    isActive: !db.users[idx].isActive
  };

  writeDb(db);
  return db.users[idx];
}

export function updateUserCredentials(
  userId: string,
  newName?: string,
  newUsername?: string,
  newPassword?: string
): User {
  const db = readDb();
  const idx = db.users.findIndex((u) => u.id === userId);
  if (idx === -1) throw new Error('User not found');

  if (newUsername && newUsername.toLowerCase().trim() !== db.users[idx].username) {
    const exists = db.users.some((u) => u.id !== userId && u.username.toLowerCase() === newUsername.toLowerCase().trim());
    if (exists) {
      throw new Error('Username already taken!');
    }
    db.users[idx].username = newUsername.toLowerCase().trim();
  }

  if (newName) {
    db.users[idx].name = newName.trim();
  }

  if (newPassword && newPassword.trim() !== '') {
    db.users[idx].passwordHash = crypto.createHash('sha256').update(newPassword.trim()).digest('hex');
  }

  writeDb(db);
  return db.users[idx];
}

