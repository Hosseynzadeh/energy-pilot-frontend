
export type Role = 'Manager' | 'Analyst';

export interface User {
  id: string;
  name: string;
  role: Role;
  organizationId: string;
}

export interface Organization {
  id: string;
  name: string;
  tariffPerKwh: number; // in GBP
  leagueMode: 'Individual' | 'TeamOnly';
}

export interface OperatingHours {
  start: string; // HH:mm
  end: string;   // HH:mm
  closedOn: string[]; // ['Saturday', 'Sunday']
}

export interface Site {
  id: string;
  name: string;
  location: string;
  timezone: string;
  operatingHours: OperatingHours;
  equipment: string[];
  departments: string[];
}

export interface MeterData {
  timestamp: string;
  kw: number;
}

export interface Insight {
  id: string;
  title: string;
  summary: string; // Why it matters (plain English)
  evidence: string[]; // What changed
  estimatedMonthlySavings: number;
  confidence: number; // 0-100
  type: 'IT' | 'HVAC' | 'Lighting' | 'Refrigeration' | 'Water Heating' | 'Unknown';
  patternDetected: 'Flat' | 'Cyclic' | 'Peak' | 'Weekend' | 'Drift';
  faultCategory: 'Timer Mismatch' | 'Equipment Fault' | 'Human Error' | 'Efficiency Loss';
  recommendedAction: string;
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  actionName: string;
  category: 'IT' | 'HVAC' | 'Lighting' | 'Automation';
  kwhSaved: number;
  gbpSaved: number;
  status: 'Verified' | 'Manual Override' | 'Estimated';
}

export type LoadPriority = 'Critical' | 'Conditional' | 'Flexible';

export interface ProtectedAsset {
  id: string;
  name: string;
  priority: LoadPriority;
  lastVerified: string;
}

export interface AutopilotConfig {
  mode: 'Off' | 'Advisory' | 'Active';
  safetyGuardrails: string[];
  protectedAssets: ProtectedAsset[];
  overrideResumeHours: number;
  trialStartDate?: string;
}

export interface Device {
  id: string;
  name: string;
  type: 'Plug' | 'CT Circuit';
  model: string;
  reliabilityScore: number;
  status: 'Online' | 'Offline';
  metering: boolean;
  onOff: boolean;
}

export interface ScoreBreakdown {
  composite: number; // 0-100
  improvement: number; // 40% - vs entity baseline
  behavior: number;    // 40% - task compliance & overrides
  fairness: number;    // 20% - role/equipment normalization
  auditNotes: string;  // Plain language explanation for the user
}

export interface EvidenceItem {
  text: string;
  tag: 'improvement' | 'compliance' | 'reliability' | 'habit';
}

export type RewardStatus = 'eligible' | 'approved' | 'paid' | 'none';

export type GenderHint = 'male' | 'female' | 'neutral' | 'unspecified';

export interface StaffProfile {
  id: string;
  name: string;
  role: string;
  department: string;
  siteId: string;
  score: ScoreBreakdown;
  rank: number;
  trend: 'Rising' | 'Steady' | 'Falling';
  badges: string[];
  scoreHistory: number[]; // Last 6 months
  evidence: EvidenceItem[];
  rewardStatus: RewardStatus;
  managerNotes: string;
  estimatedSavings: number; // £
  kwhSaved: number;
  complianceRate: number; // %
  overridesCount: number;
  isSafetyCritical?: boolean;
  avatarUrl?: string; 
  genderHint?: GenderHint;
}

export interface TeamMember extends StaffProfile {
  points: number;
  tasksCompleted: number;
  improvementTrend: 'Up' | 'Down' | 'Stable';
}

export interface DepartmentRanking {
  name: string;
  score: ScoreBreakdown;
  totalPoints: number;
  efficiencyTrend: 'Up' | 'Down' | 'Stable';
  memberCount: number;
}

export interface Reward {
  id: string;
  title: string;
  description: string;
  targetPoints: number;
  currentPoints: number;
  type: 'Team' | 'Individual' | 'Department';
  prizeType: 'Bonus' | 'GiftCard' | 'Experience' | 'Badge';
  status: 'Active' | 'Unlocked' | 'Claimed';
}

export interface ClosingTask {
  id: string;
  name: string;
  assignedTo: string;
  status: 'Pending' | 'Completed';
  lastCompleted?: string;
}

export interface VerifiedDevice {
  brand: string;
  model: string;
  tier: 'Verified' | 'Limited' | 'Not Recommended';
  protocol: string;
  features: {
    energyReporting: boolean;
    remoteControl: boolean;
    localNetwork: boolean;
  };
  notes: string;
}
