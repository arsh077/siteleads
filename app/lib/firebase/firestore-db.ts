import 'server-only';
import { adminDb } from './admin';
import { 
  User, 
  Lead, 
  LeadUpdate, 
  LeadBatch, 
  LeadStatus 
} from '../db';

// Collection names
const COLLECTIONS = {
  USERS: 'users',
  LEADS: 'leads',
  UPDATES: 'leadUpdates',
  BATCHES: 'leadBatches',
} as const;

// Initialize default data if collections are empty
export async function initializeFirestoreData() {
  const usersSnapshot = await adminDb.collection(COLLECTIONS.USERS).limit(1).get();
  
  if (usersSnapshot.empty) {
    console.log('Initializing Firestore with default data...');
    
    const defaultUsers: User[] = [
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
    ];

    const batch = adminDb.batch();
    defaultUsers.forEach((user) => {
      const docRef = adminDb.collection(COLLECTIONS.USERS).doc(user.id);
      batch.set(docRef, user);
    });
    await batch.commit();
    console.log('Default users created in Firestore');
  }
}

// User Operations
export async function getUsers(): Promise<User[]> {
  try {
    const snapshot = await adminDb.collection(COLLECTIONS.USERS).get();
    return snapshot.docs.map(doc => doc.data() as User);
  } catch (error) {
    console.error('Error fetching users:', error);
    return [];
  }
}

export async function saveUsers(users: User[]): Promise<void> {
  const batch = adminDb.batch();
  users.forEach((user) => {
    const docRef = adminDb.collection(COLLECTIONS.USERS).doc(user.id);
    batch.set(docRef, user);
  });
  await batch.commit();
}

export async function createEmployee(name: string, username: string, passwordHash: string): Promise<User> {
  const users = await getUsers();
  if (users.some((u) => u.username.toLowerCase() === username.toLowerCase().trim())) {
    throw new Error('Username already exists! Please choose another username.');
  }

  const crypto = await import('crypto');
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

  await adminDb.collection(COLLECTIONS.USERS).doc(newUser.id).set(newUser);
  return newUser;
}

export async function toggleUserStatus(userId: string): Promise<User> {
  const docRef = adminDb.collection(COLLECTIONS.USERS).doc(userId);
  const doc = await docRef.get();
  
  if (!doc.exists) {
    throw new Error('User not found');
  }

  const user = doc.data() as User;
  const updatedUser = { ...user, isActive: !user.isActive };
  await docRef.update({ isActive: updatedUser.isActive });
  
  return updatedUser;
}

export async function updateUserCredentials(
  userId: string,
  newName?: string,
  newUsername?: string,
  newPassword?: string
): Promise<User> {
  const docRef = adminDb.collection(COLLECTIONS.USERS).doc(userId);
  const doc = await docRef.get();
  
  if (!doc.exists) {
    throw new Error('User not found');
  }

  const user = doc.data() as User;
  const updates: Partial<User> = {};

  if (newUsername && newUsername.toLowerCase().trim() !== user.username) {
    const users = await getUsers();
    const exists = users.some((u) => u.id !== userId && u.username.toLowerCase() === newUsername.toLowerCase().trim());
    if (exists) {
      throw new Error('Username already taken!');
    }
    updates.username = newUsername.toLowerCase().trim();
  }

  if (newName) {
    updates.name = newName.trim();
  }

  if (newPassword && newPassword.trim() !== '') {
    const crypto = await import('crypto');
    updates.passwordHash = crypto.createHash('sha256').update(newPassword.trim()).digest('hex');
  }

  await docRef.update(updates);
  return { ...user, ...updates };
}

// Lead Operations
export async function getLeads(): Promise<Lead[]> {
  try {
    const snapshot = await adminDb.collection(COLLECTIONS.LEADS).orderBy('createdAt', 'desc').get();
    return snapshot.docs.map(doc => doc.data() as Lead);
  } catch (error) {
    console.error('Error fetching leads:', error);
    return [];
  }
}

export async function saveLeads(leads: Lead[]): Promise<void> {
  const batch = adminDb.batch();
  leads.forEach((lead) => {
    const docRef = adminDb.collection(COLLECTIONS.LEADS).doc(lead.id);
    batch.set(docRef, lead);
  });
  await batch.commit();
}

// Lead Updates Operations
export async function getUpdates(): Promise<LeadUpdate[]> {
  try {
    const snapshot = await adminDb.collection(COLLECTIONS.UPDATES).orderBy('createdAt', 'desc').get();
    return snapshot.docs.map(doc => doc.data() as LeadUpdate);
  } catch (error) {
    console.error('Error fetching updates:', error);
    return [];
  }
}

export async function saveUpdates(updates: LeadUpdate[]): Promise<void> {
  const batch = adminDb.batch();
  updates.forEach((update) => {
    const docRef = adminDb.collection(COLLECTIONS.UPDATES).doc(update.id);
    batch.set(docRef, update);
  });
  await batch.commit();
}

export async function addLeadResponse(
  leadId: string,
  userId: string,
  userName: string,
  status: LeadStatus,
  note: string,
  nextFollowupDate?: string
): Promise<LeadUpdate> {
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

  // Save update
  await adminDb.collection(COLLECTIONS.UPDATES).doc(newUpdate.id).add(newUpdate);

  // Update lead
  const leadRef = adminDb.collection(COLLECTIONS.LEADS).doc(leadId);
  await leadRef.update({
    status,
    notes: note || '',
    updatedAt: now,
    lastActionAt: now
  });

  return newUpdate;
}

// Batch Operations
export async function getBatches(): Promise<LeadBatch[]> {
  try {
    const snapshot = await adminDb.collection(COLLECTIONS.BATCHES).orderBy('createdAt', 'desc').get();
    return snapshot.docs.map(doc => doc.data() as LeadBatch);
  } catch (error) {
    console.error('Error fetching batches:', error);
    return [];
  }
}

export async function saveBatches(batches: LeadBatch[]): Promise<void> {
  const batch = adminDb.batch();
  batches.forEach((b) => {
    const docRef = adminDb.collection(COLLECTIONS.BATCHES).doc(b.id);
    batch.set(docRef, b);
  });
  await batch.commit();
}

// Distribution functions
export async function distributeLeadsEqually(
  rawLeadsToAssign: Array<{ name: string; phone: string; email?: string; source?: string }>,
  batchId?: string
): Promise<{ assignedLeads: Lead[]; summaryText: string }> {
  const users = await getUsers();
  const activeEmployees = users.filter((u) => u.role === 'employee' && u.isActive);

  if (activeEmployees.length === 0) {
    throw new Error('No active employees available for lead distribution!');
  }

  const existingLeads = await getLeads();
  const employeeLeadCounts: Record<string, number> = {};
  activeEmployees.forEach((emp) => {
    employeeLeadCounts[emp.id] = existingLeads.filter((l) => l.assignedToId === emp.id).length;
  });

  const now = new Date().toISOString();
  const assignedLeads: Lead[] = [];
  const assignedCountsByEmp: Record<string, number> = {};
  activeEmployees.forEach((e) => (assignedCountsByEmp[e.name] = 0));

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

  await saveLeads([...assignedLeads, ...existingLeads]);

  const breakdown = Object.entries(assignedCountsByEmp)
    .map(([empName, count]) => `${empName}: ${count}`)
    .join(', ');

  return {
    assignedLeads,
    summaryText: `Equally distributed ${assignedLeads.length} leads across ${activeEmployees.length} active employees (${breakdown}).`
  };
}

export async function redistributeAllLeadsEqually(): Promise<{ updatedCount: number; summaryText: string }> {
  const users = await getUsers();
  const activeEmployees = users.filter((u) => u.role === 'employee' && u.isActive);

  if (activeEmployees.length === 0) {
    throw new Error('No active employees available to re-distribute leads.');
  }

  const existingLeads = await getLeads();
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

  await saveLeads(updatedLeads);

  const breakdown = Object.entries(assignedCountsByEmp)
    .map(([empName, count]) => `${empName}: ${count}`)
    .join(', ');

  return {
    updatedCount: updatedLeads.length,
    summaryText: `Re-balanced all ${updatedLeads.length} leads equally among ${activeEmployees.length} active employees (${breakdown}).`
  };
}

// Helper to parse leads from text
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
