
import { Site, TeamMember, AuditLogEntry, DepartmentRanking, Device, Organization } from '../types';

export const DEMO_MODE = true;

export const DEMO_ORG: Organization = {
  id: 'org-demo',
  name: 'UK SME Energy Portfolio',
  tariffPerKwh: 0.32,
  leagueMode: 'Individual'
};

export const DEMO_SITES: Site[] = [
  {
    id: 'site-camden',
    name: 'Camden Medical Clinic',
    location: 'London',
    timezone: 'GMT',
    operatingHours: { start: '08:00', end: '19:00', closedOn: ['Saturday', 'Sunday'] },
    equipment: ['HVAC', 'Refrigeration', 'Lighting', 'Server/IT'],
    departments: ['Admin', 'Clinical', 'Storage']
  },
  {
    id: 'site-soho',
    name: 'Soho Bistro & Kitchen',
    location: 'London',
    timezone: 'GMT',
    operatingHours: { start: '10:00', end: '23:30', closedOn: [] },
    equipment: ['Kitchen', 'HVAC', 'Lighting'],
    departments: ['Kitchen', 'Front of House']
  },
  {
    id: 'site-brum',
    name: 'Birmingham Logistics Hub',
    location: 'Birmingham',
    timezone: 'GMT',
    operatingHours: { start: '06:00', end: '22:00', closedOn: ['Sunday'] },
    equipment: ['Lighting', 'HVAC', 'Warehouse IT'],
    departments: ['Warehouse', 'Dispatch', 'Office']
  }
];

export const DEMO_TEAM: TeamMember[] = [
  { 
    id: 'e2', name: 'Sarah Wilson', role: 'Head Chef', department: 'Kitchen', siteId: 'site-soho', points: 1420, tasksCompleted: 52, overridesCount: 1, badges: ['Efficiency Legend', 'Top Performer'], 
    improvementTrend: 'Up', rank: 1, trend: 'Rising', scoreHistory: [88, 90, 91, 93, 94, 94], 
    estimatedSavings: 120, kwhSaved: 375, complianceRate: 98, rewardStatus: 'eligible', managerNotes: "Exceptional lead in the kitchen.",
    genderHint: 'female',
    evidence: [
      { text: "After-hours incidents down 3 → 1 (matched weekdays)", tag: 'improvement' },
      { text: "Fewer overrides than team average (0.4 vs 1.2)", tag: 'compliance' },
      { text: "Improved kitchen baseline by 14% (audited)", tag: 'habit' }
    ],
    score: { composite: 94, improvement: 96, behavior: 98, fairness: 85, auditNotes: "Outstanding performance!" } 
  },
  { 
    id: 'e1', name: 'James Smith', role: 'Clinical Lead', department: 'Clinical', siteId: 'site-camden', points: 1250, tasksCompleted: 45, overridesCount: 2, badges: ['Perfect Close'], 
    improvementTrend: 'Up', rank: 2, trend: 'Rising', scoreHistory: [75, 80, 82, 85, 88, 88],
    estimatedSavings: 85, kwhSaved: 265, complianceRate: 92, rewardStatus: 'approved', managerNotes: "Very reliable with IT shutdowns.",
    genderHint: 'male',
    evidence: [
      { text: "100% completion on Level 2 monitor checks", tag: 'habit' },
      { text: "OOH waste reduction of £12/week achieved", tag: 'improvement' },
      { text: "Maintained safety-first protocols during peak", tag: 'reliability' }
    ],
    score: { composite: 88, improvement: 92, behavior: 85, fairness: 90, auditNotes: "Consistently excellent." } 
  },
  { 
    id: 'e4', name: 'Elena Rossi', role: 'Sous Chef', department: 'Kitchen', siteId: 'site-soho', points: 1100, tasksCompleted: 38, overridesCount: 0, badges: ['Most Improved'], 
    improvementTrend: 'Up', rank: 3, trend: 'Rising', scoreHistory: [60, 65, 72, 78, 82, 85],
    estimatedSavings: 70, kwhSaved: 218, complianceRate: 100, rewardStatus: 'eligible', managerNotes: "Huge improvement.",
    genderHint: 'female',
    evidence: [
      { text: "Halved overnight phantom load in prep kitchen", tag: 'improvement' },
      { text: "Zero manual overrides in 30 days", tag: 'compliance' }
    ],
    score: { composite: 85, improvement: 98, behavior: 92, fairness: 85, auditNotes: "Massive improvement!" } 
  },
  { 
    id: 'e3', name: 'Robert Brown', role: 'Warehouse Ops', department: 'Warehouse', siteId: 'site-brum', points: 880, tasksCompleted: 22, overridesCount: 4, badges: ['Consistent'], 
    improvementTrend: 'Stable', rank: 4, trend: 'Steady', scoreHistory: [70, 72, 71, 73, 72, 72],
    estimatedSavings: 45, kwhSaved: 140, complianceRate: 78, rewardStatus: 'none', managerNotes: "Solid work.",
    genderHint: 'male',
    evidence: [
      { text: "Maintained steady baseline", tag: 'reliability' },
      { text: "Completed 22 nightly belt inspections", tag: 'habit' }
    ],
    score: { composite: 72, improvement: 65, behavior: 70, fairness: 95, auditNotes: "Solid work." } 
  },
  { 
    id: 'e6', name: 'Maya Patel', role: 'Admin Coordinator', department: 'Admin', siteId: 'site-camden', points: 750, tasksCompleted: 20, overridesCount: 3, badges: ['Team Player'], 
    improvementTrend: 'Stable', rank: 5, trend: 'Steady', scoreHistory: [65, 68, 68, 70, 68, 69],
    estimatedSavings: 30, kwhSaved: 94, complianceRate: 75, rewardStatus: 'none', managerNotes: "Helpful with coordination.",
    genderHint: 'female',
    evidence: [
      { text: "Managed weekend schedule updates effectively", tag: 'reliability' }
    ],
    score: { composite: 69, improvement: 62, behavior: 68, fairness: 95, auditNotes: "Good baseline." } 
  },
  { 
    id: 'e5', name: 'David Vance', role: 'Security Lead', department: 'Security', siteId: 'site-camden', points: 0, tasksCompleted: 100, overridesCount: 0, badges: ['Critical Guard'], 
    improvementTrend: 'Stable', isSafetyCritical: true, rank: 99, trend: 'Steady', scoreHistory: [100, 100, 100, 100, 100, 100],
    estimatedSavings: 0, kwhSaved: 0, complianceRate: 100, rewardStatus: 'none', managerNotes: "Safety-first automation lead.",
    genderHint: 'male',
    evidence: [{ text: "Safety-critical role: Excluded from efficiency comparisons.", tag: 'reliability' }],
    score: { composite: 100, improvement: 100, behavior: 100, fairness: 100, auditNotes: "Safety-critical role." } 
  }
];

export const DEMO_DEPT_RANKINGS: DepartmentRanking[] = [
  { name: 'Kitchen', totalPoints: 4520, efficiencyTrend: 'Up', memberCount: 8, score: { composite: 91, improvement: 94, behavior: 92, fairness: 85, auditNotes: "High complexity balanced by habit compliance." } },
  { name: 'Warehouse', totalPoints: 3100, efficiencyTrend: 'Stable', memberCount: 12, score: { composite: 82, improvement: 80, behavior: 84, fairness: 90, auditNotes: "Consistent baseline, looking for lighting optimization." } },
  { name: 'Clinical Admin', totalPoints: 1200, efficiencyTrend: 'Down', memberCount: 4, score: { composite: 65, improvement: 58, behavior: 68, fairness: 95, auditNotes: "Requires review of weekend IT shutdown policies." } }
];

export const DEMO_ACTIONS: AuditLogEntry[] = [
  { id: 'a1', timestamp: new Date().toISOString(), actionName: 'HVAC Night Correction', category: 'HVAC', kwhSaved: 4.2, gbpSaved: 1.34, status: 'Verified' },
  { id: 'a2', timestamp: new Date(Date.now() - 3600000).toISOString(), actionName: 'Smart-Plug IT Cutoff', category: 'IT', kwhSaved: 0.8, gbpSaved: 0.25, status: 'Verified' },
  { id: 'a3', timestamp: new Date(Date.now() - 7200000).toISOString(), actionName: 'Manual Lights Override', category: 'Lighting', kwhSaved: -1.2, gbpSaved: -0.38, status: 'Manual Override' }
];

export const DEMO_DEVICES: Device[] = [
  { id: 'd1', name: 'Main Server Rack', type: 'Plug', model: 'Matter v1.3', reliabilityScore: 99, status: 'Online', metering: true, onOff: true },
  { id: 'd2', name: 'Lobby Lighting Circuit', type: 'CT Circuit', model: 'NS-Clamp', reliabilityScore: 94, status: 'Online', metering: true, onOff: false }
];
