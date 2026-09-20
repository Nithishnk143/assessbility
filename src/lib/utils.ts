import type { AccessibilityLevel, PlaceCategory, IssueType } from './types';

export function formatDate(iso: string): string {
  const d = new Date(iso);
  const diff = Date.now() - d.getTime();
  const days = Math.floor(diff / (24 * 60 * 60 * 1000));
  if (days === 0) return 'Today';
  if (days === 1) return 'Yesterday';
  if (days < 7) return `${days} days ago`;
  if (days < 30) return `${Math.floor(days / 7)} weeks ago`;
  if (days < 365) return `${Math.floor(days / 30)} months ago`;
  return `${Math.floor(days / 365)} years ago`;
}

export function statusColor(level: AccessibilityLevel): string {
  switch (level) {
    case 'good': return '#16a34a';
    case 'partial': return '#ca8a04';
    case 'poor': return '#dc2626';
    default: return '#6b7280';
  }
}

export function statusBg(level: AccessibilityLevel): string {
  switch (level) {
    case 'good': return '#f0fdf4';
    case 'partial': return '#fefce8';
    case 'poor': return '#fef2f2';
    default: return '#f9fafb';
  }
}

export function statusLabel(level: AccessibilityLevel): string {
  switch (level) {
    case 'good': return 'Accessible';
    case 'partial': return 'Partial';
    case 'poor': return 'Not Accessible';
    default: return 'Not Verified';
  }
}

export function scoreLabel(score: number): { label: string; color: string } {
  if (score >= 80) return { label: 'Good', color: '#16a34a' };
  if (score >= 60) return { label: 'Moderate', color: '#0d9488' };
  if (score >= 40) return { label: 'Limited', color: '#ca8a04' };
  return { label: 'Poor', color: '#dc2626' };
}

export function categoryLabel(cat: PlaceCategory): string {
  const map: Record<PlaceCategory, string> = {
    hospital: 'Hospital',
    clinic: 'Clinic',
    restaurant: 'Restaurant',
    shop: 'Shop',
    college: 'College',
    office: 'Office',
    bus_stop: 'Bus Stop',
    public_place: 'Public Place',
  };
  return map[cat] ?? cat;
}

export function categoryIcon(cat: PlaceCategory): string {
  const map: Record<PlaceCategory, string> = {
    hospital: '🏥',
    clinic: '🏥',
    restaurant: '🍽️',
    shop: '🛍️',
    college: '🎓',
    office: '🏢',
    bus_stop: '🚌',
    public_place: '🏛️',
  };
  return map[cat] ?? '📍';
}

export function issueLabel(type: IssueType): string {
  const map: Record<IssueType, string> = {
    ramp_blocked: 'Ramp Blocked',
    ramp_steep: 'Ramp Too Steep',
    broken_footpath: 'Broken Footpath',
    blocked_footpath: 'Blocked Footpath',
    steps_at_entrance: 'Steps at Entrance',
    toilet_locked: 'Accessible Toilet Locked',
    toilet_storage: 'Toilet Used for Storage',
    lift_unavailable: 'Lift Unavailable',
    parking_blocked: 'Parking Blocked',
    narrow_entrance: 'Narrow Entrance',
    heavy_door: 'Heavy Door',
    construction: 'Construction Obstruction',
    waterlogging: 'Waterlogging',
    other: 'Other Issue',
  };
  return map[type] ?? type;
}

export function featureIcon(name: string): string {
  const map: Record<string, string> = {
    entrance: '🚪',
    ramp: '♿',
    lift: '🛗',
    toilet: '🚻',
    parking: '🅿️',
    footpath: '🚶',
    door: '🚪',
    transport: '🚌',
  };
  return map[name] ?? '✓';
}
