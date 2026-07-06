import 'server-only';

export interface UserDTO {
  id: string;
  username: string;
  name: string;
  role: 'admin' | 'employee';
  isActive: boolean;
}

export interface LeadDTO {
  id: string;
  name: string;
  phone: string;
  email?: string;
  source?: string;
  status: string;
  assignedToId: string;
  assignedToName?: string;
  createdAt: string;
}

export function mapUserToDTO(user: {
  id: string;
  username: string;
  displayName: string;
  role: 'admin' | 'employee';
  isActive: boolean;
}): UserDTO {
  return {
    id: user.id,
    username: user.username,
    name: user.displayName,
    role: user.role,
    isActive: user.isActive,
  };
}
