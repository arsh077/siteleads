import { User, Lead, LeadUpdate, LeadBatch, LeadStatus } from '../types';

const USERS_KEY = 'leadsync_users_v1';
const LEADS_KEY = 'leadsync_leads_v1';
const UPDATES_KEY = 'leadsync_updates_v1';
const BATCHES_KEY = 'leadsync_batches_v1';
const SESSION_KEY = 'leadsync_session_v1';

// Initial Seed Users
const INITIAL_USERS: User[] = [
  {
    id: 'u-admin-1',
    username: 'admin',
    password: '123',
    name: 'Admin Master',
    role: 'admin',
    isActive: true,
    createdAt: new Date().toISOString()
  },
  {
    id: 'u-emp-1',
    username: 'rohan',
    password: '123',
    name: 'Rohan Sharma',
    role: 'employee',
    isActive: true,
    createdAt: new Date().toISOString()
  },
  {
    id: 'u-emp-2',
    username: 'priya',
    password: '123',
    name: 'Priya Singh',
    role: 'employee',
    isActive: true,
    createdAt: new Date().toISOString()
  },
  {
    id: 'u-emp-3',
    username: 'amit',
    password: '123',
    name: 'Amit Verma',
    role: 'employee',
    isActive: true,
    createdAt: new Date().toISOString()
  },
  {
    id: 'u-emp-4',
    username: 'sneha',
    password: '123',
    name: 'Sneha Gupta',
    role: 'employee',
    isActive: false, // Inactive employee example
    createdAt: new Date().toISOString()
  }
];

// Initial Seed Leads
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

// Helper to initialize local storage
function initStorage() {
  if (!localStorage.getItem(USERS_KEY)) {
    localStorage.setItem(USERS_KEY, JSON.stringify(INITIAL_USERS));
  }
  if (!localStorage.getItem(LEADS_KEY)) {
    localStorage.setItem(LEADS_KEY, JSON.stringify(INITIAL_LEADS));
  }
  if (!localStorage.getItem(UPDATES_KEY)) {
    localStorage.setItem(UPDATES_KEY, JSON.stringify(INITIAL_UPDATES));
  }
  if (!localStorage.getItem(BATCHES_KEY)) {
    localStorage.setItem(BATCHES_KEY, JSON.stringify(INITIAL_BATCHES));
  }
}

initStorage();

// Storage Getters and Setters
export function getUsers(): User[] {
  try {
    const raw = localStorage.getItem(USERS_KEY);
    return raw ? JSON.parse(raw) : INITIAL_USERS;
  } catch {
    return INITIAL_USERS;
  }
}

export function saveUsers(users: User[]): void {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

export function getLeads(): Lead[] {
  try {
    const raw = localStorage.getItem(LEADS_KEY);
    return raw ? JSON.parse(raw) : INITIAL_LEADS;
  } catch {
    return INITIAL_LEADS;
  }
}

export function saveLeads(leads: Lead[]): void {
  localStorage.setItem(LEADS_KEY, JSON.stringify(leads));
}

export function getUpdates(): LeadUpdate[] {
  try {
    const raw = localStorage.getItem(UPDATES_KEY);
    return raw ? JSON.parse(raw) : INITIAL_UPDATES;
  } catch {
    return INITIAL_UPDATES;
  }
}

export function saveUpdates(updates: LeadUpdate[]): void {
  localStorage.setItem(UPDATES_KEY, JSON.stringify(updates));
}

export function getBatches(): LeadBatch[] {
  try {
    const raw = localStorage.getItem(BATCHES_KEY);
    return raw ? JSON.parse(raw) : INITIAL_BATCHES;
  } catch {
    return INITIAL_BATCHES;
  }
}

export function saveBatches(batches: LeadBatch[]): void {
  localStorage.setItem(BATCHES_KEY, JSON.stringify(batches));
}

// Current Session State
export function getActiveSession(): User | null {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function setActiveSession(user: User | null): void {
  if (user) {
    localStorage.setItem(SESSION_KEY, JSON.stringify(user));
  } else {
    localStorage.removeItem(SESSION_KEY);
  }
}

// EQUAL LEAD DISTRIBUTION LOGIC (Deterministic Round-Robin / Least-Loaded)
// Pure deterministic business logic - No AI used as explicitly requested!
export function distributeLeadsEqually(
  rawLeadsToAssign: Array<{ name: string; phone: string; email?: string; source?: string }>,
  batchId?: string
): { assignedLeads: Lead[]; summaryText: string } {
  const users = getUsers();
  const activeEmployees = users.filter((u) => u.role === 'employee' && u.isActive);

  if (activeEmployees.length === 0) {
    throw new Error('No active employees available for lead distribution! Please activate at least one employee in Admin Panel.');
  }

  const existingLeads = getLeads();

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
    // Find employee with minimum lead count
    let leastLoadedEmp = activeEmployees[0];
    let minCount = employeeLeadCounts[leastLoadedEmp.id];

    for (let i = 1; i < activeEmployees.length; i++) {
      const emp = activeEmployees[i];
      if (employeeLeadCounts[emp.id] < minCount) {
        leastLoadedEmp = emp;
        minCount = employeeLeadCounts[emp.id];
      }
    }

    // Increment count for this employee
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

  // Save updated lead collection
  const updatedLeadsList = [...assignedLeads, ...existingLeads];
  saveLeads(updatedLeadsList);

  const breakdown = Object.entries(assignedCountsByEmp)
    .map(([empName, count]) => `${empName}: ${count}`)
    .join(', ');

  const summaryText = `Equally distributed ${assignedLeads.length} leads across ${activeEmployees.length} active employees (${breakdown}).`;

  return { assignedLeads, summaryText };
}

// Re-distribute ALL existing leads equally across active employees
export function redistributeAllLeadsEqually(): { updatedCount: number; summaryText: string } {
  const users = getUsers();
  const activeEmployees = users.filter((u) => u.role === 'employee' && u.isActive);

  if (activeEmployees.length === 0) {
    throw new Error('No active employees available to re-distribute leads.');
  }

  const existingLeads = getLeads();
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

  saveLeads(updatedLeads);

  const breakdown = Object.entries(assignedCountsByEmp)
    .map(([empName, count]) => `${empName}: ${count}`)
    .join(', ');

  return {
    updatedCount: updatedLeads.length,
    summaryText: `Re-balanced all ${updatedLeads.length} leads equally among ${activeEmployees.length} active employees (${breakdown}).`
  };
}

// Add Response to a Lead (Sheet maintenance)
export function addLeadResponse(
  leadId: string,
  userId: string,
  userName: string,
  status: LeadStatus,
  note: string,
  nextFollowupDate?: string
): LeadUpdate {
  const updates = getUpdates();
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

  saveUpdates([newUpdate, ...updates]);

  // Update lead status and lastActionAt
  const leads = getLeads();
  const leadIdx = leads.findIndex((l) => l.id === leadId);
  if (leadIdx !== -1) {
    leads[leadIdx] = {
      ...leads[leadIdx],
      status,
      notes: note ? note : leads[leadIdx].notes,
      updatedAt: now,
      lastActionAt: now
    };
    saveLeads(leads);
  }

  return newUpdate;
}

// User Management Functions
export function createEmployee(name: string, username: string, password: string): User {
  const users = getUsers();
  if (users.some((u) => u.username.toLowerCase() === username.toLowerCase())) {
    throw new Error('Username already exists! Please choose another username.');
  }

  const newUser: User = {
    id: `u-emp-${Date.now()}`,
    name,
    username: username.toLowerCase().trim(),
    password: password || '123456',
    role: 'employee',
    isActive: true,
    createdAt: new Date().toISOString()
  };

  saveUsers([...users, newUser]);
  return newUser;
}

export function toggleUserStatus(userId: string): User {
  const users = getUsers();
  const idx = users.findIndex((u) => u.id === userId);
  if (idx === -1) throw new Error('User not found');

  users[idx] = {
    ...users[idx],
    isActive: !users[idx].isActive
  };

  saveUsers(users);
  return users[idx];
}

export function updateUserCredentials(
  userId: string,
  newName?: string,
  newUsername?: string,
  newPassword?: string
): User {
  const users = getUsers();
  const idx = users.findIndex((u) => u.id === userId);
  if (idx === -1) throw new Error('User not found');

  // If username is changed, verify uniqueness
  if (newUsername && newUsername.toLowerCase().trim() !== users[idx].username) {
    const exists = users.some((u) => u.id !== userId && u.username.toLowerCase() === newUsername.toLowerCase().trim());
    if (exists) {
      throw new Error('Username already taken!');
    }
    users[idx].username = newUsername.toLowerCase().trim();
  }

  if (newName) {
    users[idx].name = newName.trim();
  }

  if (newPassword && newPassword.trim() !== '') {
    users[idx].password = newPassword.trim();
  }

  saveUsers(users);

  // If updating current logged in user, refresh session
  const currentSession = getActiveSession();
  if (currentSession && currentSession.id === userId) {
    setActiveSession(users[idx]);
  }

  return users[idx];
}

// Helper to extract leads from pasted/uploaded dump text line by line
export function parseLeadsFromText(rawText: string): Array<{ name: string; phone: string; email?: string }> {
  const lines = rawText.split('\n').map((l) => l.trim()).filter((l) => l.length > 0);
  const parsed: Array<{ name: string; phone: string; email?: string }> = [];

  for (const line of lines) {
    // Basic phone pattern match for Indian / international phone numbers
    const phoneMatch = line.match(/(\+?\d{1,3}[-.\s]?)?\(?\d{3,5}\)?[-.\s]?\d{3,5}[-.\s]?\d{3,5}/);
    const emailMatch = line.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);

    const phone = phoneMatch ? phoneMatch[0] : '';
    const email = emailMatch ? emailMatch[0] : '';

    // Remove phone & email to find lead name
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
