import { User, UserRole } from '../types';

// Mock database of users
const MOCK_USERS: User[] = [
  {
    id: 'super-1',
    name: 'Rakesh Singh',
    email: 'admin@platform.com',
    role: UserRole.SUPER_ADMIN,
    avatar: 'RS'
  },
  {
    id: 'biz-1',
    name: 'Vikram Malhotra',
    email: 'owner@skyline.com',
    role: UserRole.BUSINESS_ADMIN,
    businessId: 'skyline-estates',
    avatar: 'VM'
  },
  {
    id: 'agent-1',
    name: 'Anjali Gupta',
    email: 'agent@skyline.com',
    role: UserRole.AGENT,
    businessId: 'skyline-estates',
    avatar: 'AG'
  }
];

export const login = async (email: string, password: string): Promise<User> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const user = MOCK_USERS.find(u => u.email.toLowerCase() === email.toLowerCase());
      if (user) {
        resolve(user);
      } else {
        reject(new Error('Invalid credentials'));
      }
    }, 800); // Simulate network delay
  });
};

export const register = async (name: string, email: string, password: string): Promise<User> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const newUser: User = {
        id: `biz-${Date.now()}`,
        name,
        email,
        role: UserRole.BUSINESS_ADMIN,
        avatar: name.charAt(0).toUpperCase()
      };
      // In a real app, we'd add to DB. For now, just return.
      resolve(newUser);
    }, 1000);
  });
};