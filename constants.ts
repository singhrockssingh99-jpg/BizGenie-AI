
import { Lead, LeadStatus, ContentItem, ContentType, BusinessProfile, BusinessSummary } from './types';

export const MOCK_LEADS: Lead[] = [
  {
    id: '1',
    name: 'Rahul Sharma',
    email: 'rahul.s@example.com',
    phone: '+91 98765 43210',
    source: 'Instagram',
    status: LeadStatus.NEW,
    lastInteraction: '2 hours ago',
    score: 85,
    requirements: 'Looking for 3BHK in South Delhi, Budget 2.5 Cr',
    assignedTo: 'agent-1' // Assigned to Anjali (Agent)
  },
  {
    id: '2',
    name: 'Priya Verma',
    email: 'priya.v@example.com',
    phone: '+91 99887 76655',
    source: 'Facebook',
    status: LeadStatus.CONTACTED,
    lastInteraction: '1 day ago',
    score: 60,
    requirements: 'Commercial space for boutique in Gurgaon',
    assignedTo: 'agent-1' // Assigned to Anjali (Agent)
  },
  {
    id: '3',
    name: 'Amit Patel',
    email: 'amit.p@example.com',
    phone: '+91 91234 56789',
    source: 'Website',
    status: LeadStatus.QUALIFIED,
    lastInteraction: '30 mins ago',
    score: 92,
    requirements: 'Villa in Bangalore, immediate possession',
    assignedTo: 'unassigned' // Not assigned to agent-1
  }
];

export const MOCK_CONTENT: ContentItem[] = [
  {
    id: '101',
    title: 'Diwali Offer Announcement',
    type: ContentType.IMAGE,
    status: 'Published',
    data: 'https://picsum.photos/400/300',
    createdAt: new Date('2023-10-25')
  },
  {
    id: '102',
    title: 'Why Invest in Real Estate?',
    type: ContentType.TEXT,
    status: 'Draft',
    data: 'Are you considering securing your future? Real estate remains the safest bet...',
    createdAt: new Date()
  }
];

export const DEFAULT_BUSINESS: BusinessProfile = {
  name: 'Skyline Premium Estates',
  industry: 'Real Estate',
  description: 'Luxury residential and commercial properties in Tier-1 cities.',
  uploadedFiles: ['brochure_2024.pdf', 'client_list_q3.xlsx', 'market_analysis.docx']
};

export const MOCK_BUSINESSES: BusinessSummary[] = [
  {
    id: 'b1',
    name: 'Skyline Premium Estates',
    industry: 'Real Estate',
    ownerName: 'Vikram Malhotra',
    ownerEmail: 'owner@skyline.com',
    agentCount: 12,
    subscriptionPlan: 'Enterprise',
    status: 'Active',
    joinedDate: '2023-09-15',
    stats: {
      totalLeads: 1243,
      campaignsRunning: 8,
      storageUsed: '45.2 GB'
    }
  },
  {
    id: 'b2',
    name: 'Urban Clap Realty',
    industry: 'Real Estate',
    ownerName: 'Sarah Jenkins',
    ownerEmail: 'sarah@urban.co',
    agentCount: 5,
    subscriptionPlan: 'Pro',
    status: 'Active',
    joinedDate: '2023-11-20',
    stats: {
      totalLeads: 432,
      campaignsRunning: 3,
      storageUsed: '12.8 GB'
    }
  },
  {
    id: 'b3',
    name: 'Green Valley Homes',
    industry: 'Construction',
    ownerName: 'Rajesh Kumar',
    ownerEmail: 'rajesh@greenvalley.in',
    agentCount: 2,
    subscriptionPlan: 'Free',
    status: 'Pending',
    joinedDate: '2024-01-10',
    stats: {
      totalLeads: 12,
      campaignsRunning: 0,
      storageUsed: '150 MB'
    }
  },
  {
    id: 'b4',
    name: 'EduTech Innovators',
    industry: 'Education',
    ownerName: 'Meera Singh',
    ownerEmail: 'meera@edutech.com',
    agentCount: 25,
    subscriptionPlan: 'Enterprise',
    status: 'Suspended',
    joinedDate: '2023-06-01',
    stats: {
      totalLeads: 5600,
      campaignsRunning: 0,
      storageUsed: '120 GB'
    }
  }
];
