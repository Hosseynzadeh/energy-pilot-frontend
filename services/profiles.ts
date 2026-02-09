
import { TeamMember, StaffProfile } from '../types';
import { DEMO_MODE, DEMO_TEAM } from './demoData';

export const getProfileById = async (id: string): Promise<StaffProfile | null> => {
  if (DEMO_MODE) {
    // Simulate network delay
    await new Promise(r => setTimeout(r, 500));
    return DEMO_TEAM.find(t => t.id === id) || null;
  }
  return null;
};

export const listProfiles = async (siteId?: string): Promise<StaffProfile[]> => {
  if (DEMO_MODE) {
    if (siteId) return DEMO_TEAM.filter(t => t.siteId === siteId);
    return DEMO_TEAM;
  }
  return [];
};

export const generateCoachingTip = (profile: StaffProfile): string => {
  if (profile.overridesCount > 3) {
    return "Consider a quick walkthrough of the override procedure to ensure night-time energy settings aren't unintentionally bypassed.";
  }
  if (profile.complianceRate < 80) {
    return "Scheduling a 5-minute refresher on the nightly closing checklist might help boost consistency in your department.";
  }
  if (profile.score.composite > 90) {
    return "Phenomenal performance. Could this staff member mentor others in their department on efficient closing routines?";
  }
  return "Consistently strong work. Encouraging participation in the next site-wide 'Quiet Hour' challenge could be a great next step.";
};

export const updateProfile = async (id: string, patch: Partial<StaffProfile>): Promise<boolean> => {
  // In demo mode we just pretend it worked
  console.log(`Demo: Updated profile ${id}`, patch);
  return true;
};
