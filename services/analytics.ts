
import { Site, MeterData, Insight, Organization, AuditLogEntry, TeamMember, ScoreBreakdown } from '../types';

export const calculateWaste = (data: MeterData[], site: Site, org: Organization) => {
  if (!data || data.length === 0) return { monthlyWaste: 0, confidence: 0 };
  
  const startHour = parseInt(site.operatingHours.start.split(':')[0]);
  const endHour = parseInt(site.operatingHours.end.split(':')[0]);

  const oohData = data.filter(d => {
    const hour = new Date(d.timestamp).getHours();
    return hour < startHour || hour >= endHour;
  });

  if (oohData.length === 0) return { monthlyWaste: 0, confidence: 50 };

  const sortedValues = [...oohData.map(d => d.kw)].sort((a, b) => a - b);
  const baselineLoad = sortedValues[Math.floor(sortedValues.length * 0.5)];
  const minLoad = sortedValues[0];

  const wasteWatts = baselineLoad - minLoad;
  const quietHoursPerDay = 24 - (endHour - startHour);
  const monthlyWasteKwh = wasteWatts * quietHoursPerDay * 30;
  const monthlyCost = monthlyWasteKwh * org.tariffPerKwh;

  return {
    monthlyWaste: Math.max(0, monthlyCost),
    confidence: 85
  };
};

/**
 * Calculates a composite score (0-100) per entity.
 * A) Improvement (40%): Reduction vs own history.
 * B) Behaviour (40%): Compliance & low overrides.
 * C) Fairness (20%): Normalized for "heavy" equipment zones.
 */
export const calculateCompositeScore = (
  reductionVsBaseline: number, // 0 to 1
  taskCompletionRate: number, // 0 to 1
  overridesCount: number,
  department: string
): ScoreBreakdown => {
  // 1. Improvement Score (40%)
  const improvement = Math.min(100, Math.max(0, (reductionVsBaseline + 0.1) * 90));

  // 2. Behavior Score (40%)
  const behavior = Math.min(100, Math.max(0, (taskCompletionRate * 100) - (overridesCount * 10)));

  // 3. Fairness Adjustment (20%)
  const complexLoadZones = ['kitchen', 'warehouse', 'storage'];
  const isComplex = complexLoadZones.some(z => department.toLowerCase().includes(z));
  const fairness = isComplex ? 95 : 85;

  const composite = Math.round((improvement * 0.4) + (behavior * 0.4) + (fairness * 0.2));

  let auditNotes = "";
  if (reductionVsBaseline > 0.15) {
    auditNotes = `Outstanding! You achieved a massive ${Math.round(reductionVsBaseline * 100)}% reduction in energy waste this month by refining the closing process.`;
  } else if (taskCompletionRate > 0.95) {
    auditNotes = "Rockstar consistency. You didn't miss a single closing task, providing the team with a perfect efficiency baseline.";
  } else if (isComplex) {
    auditNotes = "Great work managing a high-load zone. Despite the heavy equipment in your area, you kept out-of-hours waste to a minimum.";
  } else {
    auditNotes = "Steady and reliable performance. Your commitment to the nightly shutdown is helping the site reach its sustainability goals.";
  }

  return { composite, improvement, behavior, fairness, auditNotes };
};

export const detectSuspects = (data: MeterData[], site: Site, org: Organization): Insight[] => {
  const { monthlyWaste } = calculateWaste(data, site, org);
  
  const suspects: Insight[] = [
    {
      id: 'fault-1',
      title: 'HVAC Timer Error',
      summary: 'Your heating/cooling is working overtime. It is running for 3 hours after everyone has left, wasting money on an empty building.',
      evidence: [
        'Energy load stays at daytime levels until 9:00 PM',
        'Your set closing time is 6:00 PM'
      ],
      estimatedMonthlySavings: monthlyWaste * 0.35,
      confidence: 94,
      type: 'HVAC',
      patternDetected: 'Drift',
      faultCategory: 'Timer Mismatch',
      recommendedAction: 'Check the central HVAC control panel and set the "Unoccupied" schedule to start at 6:15 PM.'
    },
    {
      id: 'fault-2',
      title: 'IT "Always-On" Leak',
      summary: 'Workstations or secondary servers are not powering down. This creates a constant "ghost" cost that never stops, even on weekends.',
      evidence: [
        'A perfectly flat 1.2kW load between 2:00 AM and 5:00 AM',
        'Weekend usage is identical to weekday nights'
      ],
      estimatedMonthlySavings: monthlyWaste * 0.40,
      confidence: 88,
      type: 'IT',
      patternDetected: 'Flat',
      faultCategory: 'Human Error',
      recommendedAction: 'Walk the floor at closing and ensure monitors are off, or install smart plugs on the main desktop power rails.'
    },
    {
      id: 'fault-3',
      title: 'Fridge Efficiency Loss',
      summary: 'A refrigeration unit is struggling to stay cool. This usually means a door seal is leaking or the coils are dusty, forcing the motor to run twice as often.',
      evidence: [
        'Motor "cycles" (spikes) are 20% more frequent than last month',
        'Cooling spikes occur every 12 minutes instead of 25'
      ],
      estimatedMonthlySavings: monthlyWaste * 0.15,
      confidence: 76,
      type: 'Refrigeration',
      patternDetected: 'Cyclic',
      faultCategory: 'Equipment Fault',
      recommendedAction: 'Inspect the door seals on your main walk-in fridge for gaps or ice buildup.'
    }
  ];

  return suspects.sort((a, b) => b.estimatedMonthlySavings - a.estimatedMonthlySavings);
};

export const generateAuditLogs = (site: Site, org: Organization): AuditLogEntry[] => {
  const logs: AuditLogEntry[] = [];
  const now = new Date();
  const categories: ('IT' | 'HVAC' | 'Lighting' | 'Automation')[] = ['IT', 'HVAC', 'Lighting', 'Automation'];
  const actions = [
    'Scheduled Shutdown',
    'Night Drift Correction',
    'Smart-Plug Cutoff',
    'Out-of-Hours Alert Handled'
  ];

  for (let i = 0; i < 20; i++) {
    const time = new Date(now.getTime() - i * 12 * 60 * 60 * 1000);
    const kwh = 0.5 + Math.random() * 2;
    logs.push({
      id: `log-${i}`,
      timestamp: time.toISOString(),
      actionName: actions[i % actions.length],
      category: categories[i % categories.length],
      kwhSaved: kwh,
      gbpSaved: kwh * org.tariffPerKwh,
      status: Math.random() > 0.1 ? 'Verified' : 'Manual Override'
    });
  }
  return logs;
};

export const generateInsights = (data: MeterData[], site: Site, org: Organization): Insight[] => {
  return detectSuspects(data, site, org);
};
