// LocalStorage-backed store simulating a backend API
import type { User, Place, Report, Photo, Verification, Notification } from './types';
import { DEMO_PLACES, DEMO_REPORTS, DEMO_PHOTOS, DEMO_USERS } from './mockData';

function load<T>(key: string, fallback: T): T {
  try {
    const v = localStorage.getItem(key);
    return v ? (JSON.parse(v) as T) : fallback;
  } catch {
    return fallback;
  }
}

function save<T>(key: string, data: T): void {
  localStorage.setItem(key, JSON.stringify(data));
}

function init() {
  if (!localStorage.getItem('ac_initialized')) {
    save('ac_places', DEMO_PLACES);
    save('ac_reports', DEMO_REPORTS);
    save('ac_photos', DEMO_PHOTOS);
    save('ac_users', DEMO_USERS);
    save('ac_verifications', [] as Verification[]);
    save('ac_notifications', [] as Notification[]);
    save('ac_saved_places', {} as Record<string, string[]>);
    save('ac_initialized', 'true');
  }
}

init();

// ─── Auth ──────────────────────────────────────────────────────────────────

export function getCurrentUser(): User | null {
  const id = sessionStorage.getItem('ac_current_user');
  if (!id) return null;
  const users = load<User[]>('ac_users', []);
  return users.find((u) => u.id === id) ?? null;
}

export function login(email: string, password: string): { user: User } | { error: string } {
  const users = load<User[]>('ac_users', []);
  const user = users.find((u) => u.email === email);
  if (!user) return { error: 'No account found with that email.' };
  // Demo: any password works for seed users; for registered users check hash
  const hashes = load<Record<string, string>>('ac_password_hashes', {});
  if (hashes[user.id] && hashes[user.id] !== password) {
    return { error: 'Incorrect password.' };
  }
  sessionStorage.setItem('ac_current_user', user.id);
  return { user };
}

export function logout() {
  sessionStorage.removeItem('ac_current_user');
}

export function register(
  name: string,
  email: string,
  password: string,
  role: User['role'],
): { user: User } | { error: string } {
  const users = load<User[]>('ac_users', []);
  if (users.find((u) => u.email === email)) return { error: 'Email already registered.' };
  const user: User = {
    id: `user-${Date.now()}`,
    name,
    email,
    role,
    points: 0,
    badges: [],
    createdAt: new Date().toISOString(),
  };
  const hashes = load<Record<string, string>>('ac_password_hashes', {});
  hashes[user.id] = password;
  save('ac_password_hashes', hashes);
  save('ac_users', [...users, user]);
  sessionStorage.setItem('ac_current_user', user.id);
  return { user };
}

export function updateUser(id: string, updates: Partial<User>): User | null {
  const users = load<User[]>('ac_users', []);
  const idx = users.findIndex((u) => u.id === id);
  if (idx === -1) return null;
  users[idx] = { ...users[idx], ...updates };
  save('ac_users', users);
  return users[idx];
}

// ─── Places ────────────────────────────────────────────────────────────────

export function getPlaces(): Place[] {
  return load<Place[]>('ac_places', DEMO_PLACES);
}

export function getPlace(id: string): Place | null {
  return getPlaces().find((p) => p.id === id) ?? null;
}

export function searchPlaces(query: string, category?: string): Place[] {
  const q = query.toLowerCase();
  return getPlaces().filter((p) => {
    const matchQ = !q || p.name.toLowerCase().includes(q) || p.address.toLowerCase().includes(q);
    const matchCat = !category || p.category === category;
    return matchQ && matchCat;
  });
}

export function getSavedPlaces(userId: string): Place[] {
  const saved = load<Record<string, string[]>>('ac_saved_places', {});
  const ids = saved[userId] ?? [];
  return getPlaces().filter((p) => ids.includes(p.id));
}

export function toggleSavePlace(userId: string, placeId: string): boolean {
  const saved = load<Record<string, string[]>>('ac_saved_places', {});
  const ids = saved[userId] ?? [];
  if (ids.includes(placeId)) {
    saved[userId] = ids.filter((id) => id !== placeId);
    save('ac_saved_places', saved);
    return false;
  }
  saved[userId] = [...ids, placeId];
  save('ac_saved_places', saved);
  return true;
}

export function isPlaceSaved(userId: string, placeId: string): boolean {
  const saved = load<Record<string, string[]>>('ac_saved_places', {});
  return (saved[userId] ?? []).includes(placeId);
}

// ─── Reports ───────────────────────────────────────────────────────────────

export function getReports(placeId?: string): Report[] {
  const all = load<Report[]>('ac_reports', DEMO_REPORTS);
  return placeId ? all.filter((r) => r.placeId === placeId) : all;
}

export function submitReport(data: Omit<Report, 'id' | 'confirmCount' | 'denyCount' | 'status' | 'userVerification'>): Report {
  const reports = load<Report[]>('ac_reports', []);
  const report: Report = {
    ...data,
    id: `report-${Date.now()}`,
    confirmCount: 0,
    denyCount: 0,
    status: 'open',
    userVerification: null,
  };
  save('ac_reports', [report, ...reports]);

  // Award points
  awardPoints(data.userId, 20);
  addNotification(data.userId, `Report submitted for ${data.placeName}. You earned 20 points!`);

  // Recalculate place confidence
  recalculateConfidence(data.placeId);
  return report;
}

export function verifyReport(reportId: string, userId: string, verdict: 'confirmed' | 'denied'): void {
  const verifications = load<Verification[]>('ac_verifications', []);
  // Prevent duplicate
  if (verifications.find((v) => v.reportId === reportId && v.userId === userId)) return;

  verifications.push({ reportId, userId, verdict, createdAt: new Date().toISOString() });
  save('ac_verifications', verifications);

  const reports = load<Report[]>('ac_reports', []);
  const idx = reports.findIndex((r) => r.id === reportId);
  if (idx !== -1) {
    if (verdict === 'confirmed') reports[idx].confirmCount += 1;
    else reports[idx].denyCount += 1;
    save('ac_reports', reports);
    recalculateConfidence(reports[idx].placeId);
  }

  awardPoints(userId, 5);
}

export function getUserVerification(reportId: string, userId: string): 'confirmed' | 'denied' | null {
  const verifications = load<Verification[]>('ac_verifications', []);
  const v = verifications.find((v) => v.reportId === reportId && v.userId === userId);
  return v?.verdict ?? null;
}

// ─── Photos ────────────────────────────────────────────────────────────────

export function getPhotos(placeId?: string): Photo[] {
  const all = load<Photo[]>('ac_photos', DEMO_PHOTOS);
  return placeId ? all.filter((p) => p.placeId === placeId) : all;
}

export function addPhoto(data: Omit<Photo, 'id' | 'flagCount'>): Photo {
  const photos = load<Photo[]>('ac_photos', []);
  const photo: Photo = { ...data, id: `photo-${Date.now()}`, flagCount: 0 };
  save('ac_photos', [photo, ...photos]);
  awardPoints(data.userId, 15);
  addNotification(data.userId, `Photo added to ${data.placeId}. You earned 15 points!`);
  return photo;
}

export function flagPhoto(photoId: string): void {
  const photos = load<Photo[]>('ac_photos', []);
  const idx = photos.findIndex((p) => p.id === photoId);
  if (idx !== -1) {
    photos[idx].flagCount += 1;
    save('ac_photos', photos);
  }
}

// ─── Points & Badges ───────────────────────────────────────────────────────

export function awardPoints(userId: string, pts: number): void {
  const users = load<User[]>('ac_users', []);
  const idx = users.findIndex((u) => u.id === userId);
  if (idx === -1) return;
  users[idx].points += pts;

  // Badge thresholds
  const p = users[idx].points;
  const badges = new Set(users[idx].badges);
  if (p >= 10) badges.add('Accessibility Contributor');
  if (p >= 100) badges.add('Community Helper');
  if (p >= 250) badges.add('Trusted Reporter');
  if (p >= 500) badges.add('Accessibility Champion');
  users[idx].badges = Array.from(badges);

  save('ac_users', users);
}

export function getLeaderboard(): User[] {
  return load<User[]>('ac_users', [])
    .filter((u) => u.role !== 'admin')
    .sort((a, b) => b.points - a.points)
    .slice(0, 10);
}

// ─── Notifications ─────────────────────────────────────────────────────────

export function getNotifications(userId: string): Notification[] {
  return load<Notification[]>('ac_notifications', []).filter((n) => n.userId === userId);
}

function addNotification(userId: string, message: string): void {
  const notes = load<Notification[]>('ac_notifications', []);
  notes.unshift({
    id: `note-${Date.now()}`,
    userId,
    message,
    read: false,
    createdAt: new Date().toISOString(),
  });
  save('ac_notifications', notes);
}

export function markNotificationsRead(userId: string): void {
  const notes = load<Notification[]>('ac_notifications', []);
  notes.forEach((n) => { if (n.userId === userId) n.read = true; });
  save('ac_notifications', notes);
}

// ─── Admin ─────────────────────────────────────────────────────────────────

export function getAdminStats() {
  return {
    totalPlaces: getPlaces().length,
    totalReports: getReports().length,
    verifiedReports: getReports().filter((r) => r.confirmCount > 0).length,
    activeContributors: load<User[]>('ac_users', []).filter((u) => u.points > 0).length,
    openIssues: getReports().filter((r) => r.status === 'open').length,
    recentUpdates: getReports().slice(0, 5),
  };
}

export function getUsers(): User[] {
  return load<User[]>('ac_users', []);
}

export function resolveReport(reportId: string): void {
  const reports = load<Report[]>('ac_reports', []);
  const idx = reports.findIndex((r) => r.id === reportId);
  if (idx !== -1) {
    reports[idx].status = 'resolved';
    save('ac_reports', reports);
  }
}

// ─── Scoring helpers ───────────────────────────────────────────────────────

function recalculateConfidence(placeId: string): void {
  const places = load<Place[]>('ac_places', []);
  const idx = places.findIndex((p) => p.id === placeId);
  if (idx === -1) return;

  const reports = getReports(placeId);
  const verifications = load<Verification[]>('ac_verifications', []);
  const placeVerifications = verifications.filter((v) =>
    reports.some((r) => r.id === v.reportId),
  );

  const reportCount = reports.length;
  const verificationCount = placeVerifications.length;
  const photos = getPhotos(placeId);
  const recentPhotos = photos.filter(
    (p) => Date.now() - new Date(p.createdAt).getTime() < 30 * 24 * 60 * 60 * 1000,
  ).length;
  const daysSinceVerified =
    (Date.now() - new Date(places[idx].lastVerified).getTime()) / (24 * 60 * 60 * 1000);

  let confidence = 50;
  confidence += Math.min(reportCount * 3, 20);
  confidence += Math.min(verificationCount * 2, 15);
  confidence += Math.min(recentPhotos * 3, 10);
  confidence -= Math.min(daysSinceVerified * 0.5, 20);
  if (places[idx].businessVerified) confidence += 10;

  places[idx].confidenceScore = Math.max(10, Math.min(99, Math.round(confidence)));
  places[idx].reportCount = reportCount;
  places[idx].verificationCount = verificationCount;
  places[idx].photoCount = photos.length;
  places[idx].lastVerified = new Date().toISOString();

  save('ac_places', places);
}
