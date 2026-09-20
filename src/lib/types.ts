export type UserRole = 'seeker' | 'contributor' | 'business_owner' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  points: number;
  badges: string[];
  createdAt: string;
}

export type AccessibilityLevel = 'good' | 'partial' | 'poor' | 'unverified';

export interface AccessibilityFeature {
  id: string;
  name: string;
  label: string;
  status: AccessibilityLevel;
  note?: string;
  weight: number; // 0–1, for scoring
}

export interface Place {
  id: string;
  name: string;
  category: PlaceCategory;
  address: string;
  lat: number;
  lng: number;
  accessibilityScore: number;
  confidenceScore: number;
  lastVerified: string;
  features: AccessibilityFeature[];
  reportCount: number;
  verificationCount: number;
  photoCount: number;
  isDemo: boolean;
  businessVerified?: boolean;
  status: AccessibilityLevel;
}

export type PlaceCategory =
  | 'hospital'
  | 'clinic'
  | 'restaurant'
  | 'shop'
  | 'college'
  | 'office'
  | 'bus_stop'
  | 'public_place';

export interface Photo {
  id: string;
  placeId: string;
  userId: string;
  userName: string;
  url: string;
  category: string;
  caption?: string;
  lat?: number;
  lng?: number;
  createdAt: string;
  flagCount: number;
}

export type IssueType =
  | 'ramp_blocked'
  | 'ramp_steep'
  | 'broken_footpath'
  | 'blocked_footpath'
  | 'steps_at_entrance'
  | 'toilet_locked'
  | 'toilet_storage'
  | 'lift_unavailable'
  | 'parking_blocked'
  | 'narrow_entrance'
  | 'heavy_door'
  | 'construction'
  | 'waterlogging'
  | 'other';

export interface Report {
  id: string;
  placeId: string;
  placeName: string;
  userId: string;
  userName: string;
  issueType: IssueType;
  description: string;
  lat?: number;
  lng?: number;
  photoUrl?: string;
  createdAt: string;
  confirmCount: number;
  denyCount: number;
  status: 'open' | 'resolved' | 'disputed';
  isTemporary?: boolean;
  expiresAt?: string;
  userVerification?: 'confirmed' | 'denied' | null;
}

export interface Verification {
  reportId: string;
  userId: string;
  verdict: 'confirmed' | 'denied';
  createdAt: string;
}

export interface Notification {
  id: string;
  userId: string;
  message: string;
  read: boolean;
  createdAt: string;
  link?: string;
}
