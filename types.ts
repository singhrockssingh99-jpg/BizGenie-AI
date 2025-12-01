export enum UserRole {
  SUPER_ADMIN = 'SUPER_ADMIN',
  BUSINESS_ADMIN = 'BUSINESS_ADMIN',
  AGENT = 'AGENT'
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  businessId?: string;
  avatar?: string;
}

export enum LeadStatus {
  NEW = 'NEW',
  CONTACTED = 'CONTACTED',
  QUALIFIED = 'QUALIFIED',
  CLOSED = 'CLOSED',
  LOST = 'LOST'
}

export interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  source: 'Instagram' | 'Facebook' | 'Website' | 'Referral';
  status: LeadStatus;
  lastInteraction: string;
  score: number; // 0-100 likelihood to convert
  requirements?: string;
  assignedTo?: string; // Agent ID
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'lead' | 'ai_assistant';
  text: string;
  timestamp: Date;
}

export enum ContentType {
  TEXT = 'TEXT',
  IMAGE = 'IMAGE',
  VIDEO = 'VIDEO',
  AUDIO = 'AUDIO'
}

export interface ContentItem {
  id: string;
  title: string;
  type: ContentType;
  status: 'Draft' | 'Approved' | 'Published';
  data: string; // URL or text content
  createdAt: Date;
}

export interface BusinessProfile {
  id?: string;
  name: string;
  industry: string;
  description: string;
  uploadedFiles: string[];
}

export interface BusinessSummary {
  id: string;
  name: string;
  industry: string;
  ownerName: string;
  ownerEmail: string;
  agentCount: number;
  subscriptionPlan: 'Free' | 'Pro' | 'Enterprise';
  status: 'Active' | 'Pending' | 'Suspended';
  joinedDate: string;
  stats: {
    totalLeads: number;
    campaignsRunning: number;
    storageUsed: string;
  }
}