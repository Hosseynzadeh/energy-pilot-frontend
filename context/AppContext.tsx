
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Organization, Site, MeterData, Insight, AutopilotConfig, TeamMember, ClosingTask, Device, AuditLogEntry, ProtectedAsset, DepartmentRanking, Reward } from '../types';
import { calculateWaste, generateInsights } from '../services/analytics';
import * as sitesService from '../services/sites';
import * as leagueService from '../services/league';
import * as actionsService from '../services/actions';
import { DEMO_MODE, DEMO_ORG, DEMO_DEVICES } from '../services/demoData';

interface SiteSummary extends Site {
  monthlyWaste: number;
  wasteScore: number;
  deviation: number;
  status: 'Normal' | 'Needs Attention' | 'Critical';
}

interface AppContextType {
  user: User | null;
  org: Organization | null;
  sites: SiteSummary[];
  activeSite: SiteSummary | null;
  meterData: MeterData[];
  insights: Insight[];
  auditLogs: AuditLogEntry[];
  autopilot: AutopilotConfig;
  team: TeamMember[];
  deptRankings: DepartmentRanking[];
  rewards: Reward[];
  tasks: ClosingTask[];
  devices: Device[];
  isAdvanced: boolean;
  isOnboarded: boolean;
  demoMode: boolean;
  setAdvanced: (val: boolean) => void;
  setLeagueMode: (mode: 'Individual' | 'TeamOnly') => void;
  setActiveSite: (site: SiteSummary) => void;
  updateAutopilot: (config: Partial<AutopilotConfig>) => void;
  updateAssetPriority: (assetId: string, priority: ProtectedAsset['priority']) => void;
  applyPolicyToAllSites: (config: Partial<AutopilotConfig>) => void;
  completeOnboarding: (orgData: any, siteData: any) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [org, setOrg] = useState<Organization | null>(null);
  const [sites, setSites] = useState<SiteSummary[]>([]);
  const [activeSite, setActiveSiteState] = useState<SiteSummary | null>(null);
  const [meterData, setMeterData] = useState<MeterData[]>([]);
  const [insights, setInsights] = useState<Insight[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>([]);
  const [autopilot, setAutopilot] = useState<AutopilotConfig>({
    mode: 'Advisory',
    safetyGuardrails: ['Critical Server (UPS)', 'Pharmacy Fridge', 'Fire Safety Sensors'],
    overrideResumeHours: 4,
    protectedAssets: [
      { id: 'pa-1', name: 'Main Server Cabinet', priority: 'Critical', lastVerified: new Date().toISOString() },
      { id: 'pa-2', name: 'Pharmacy Fridge', priority: 'Critical', lastVerified: new Date().toISOString() },
    ]
  });
  const [isAdvanced, setAdvanced] = useState(false);
  const [isOnboarded, setIsOnboarded] = useState(false);
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [deptRankings, setDeptRankings] = useState<DepartmentRanking[]>([]);
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [tasks, setTasks] = useState<ClosingTask[]>([]);
  const [devices, setDevices] = useState<Device[]>([]);

  useEffect(() => {
    if (DEMO_MODE) {
      loadDemoData();
    }
  }, []);

  const loadDemoData = async () => {
    const rawSites = await sitesService.getSites();
    const summaries: SiteSummary[] = rawSites.map((s, i) => ({
      ...s,
      monthlyWaste: i === 1 ? 850 : 412,
      wasteScore: i === 1 ? 62 : 84,
      deviation: i === 1 ? 24 : -5,
      status: i === 1 ? 'Needs Attention' : 'Normal'
    }));

    setOrg(DEMO_ORG);
    setSites(summaries);
    setActiveSiteState(summaries[0]);
    setUser({ id: 'u-demo', name: 'Demo Manager', role: 'Manager', organizationId: 'org-demo' });
    setIsOnboarded(true);
    
    // Load related data
    const teamData = await leagueService.getTeamPerformance();
    const depts = await leagueService.getDepartmentRankings();
    const logs = await actionsService.getAuditLogs();
    
    setTeam(teamData);
    setDeptRankings(depts);
    setAuditLogs(logs);
    setDevices(DEMO_DEVICES);
    
    // Initial data sync
    syncSiteData(summaries[0], DEMO_ORG);
  };

  const syncSiteData = (site: Site, organization: Organization) => {
    const mockMeter = generateMockDataForSite(site);
    setMeterData(mockMeter);
    setInsights(generateInsights(mockMeter, site, organization));
  };

  const generateMockDataForSite = (site: Site) => {
    const data: MeterData[] = [];
    const now = new Date();
    for (let i = 0; i < 24 * 7; i++) {
      const time = new Date(now.getTime() - i * 60 * 60 * 1000);
      const hour = time.getHours();
      let kw = 2 + Math.random();
      if (hour >= 8 && hour <= 18) kw += 8 + Math.random() * 5;
      data.push({ timestamp: time.toISOString(), kw });
    }
    return data;
  };

  const setLeagueMode = (mode: 'Individual' | 'TeamOnly') => {
    if (org) setOrg({ ...org, leagueMode: mode });
  };

  const setActiveSite = (site: SiteSummary) => {
    setActiveSiteState(site);
    if (org) syncSiteData(site, org);
  };

  const updateAutopilot = (config: Partial<AutopilotConfig>) => setAutopilot(prev => ({ ...prev, ...config }));
  const updateAssetPriority = (assetId: string, priority: ProtectedAsset['priority']) => {
    setAutopilot(prev => ({
      ...prev,
      protectedAssets: prev.protectedAssets.map(a => a.id === assetId ? { ...a, priority } : a)
    }));
  };
  const applyPolicyToAllSites = (config: Partial<AutopilotConfig>) => {
    setAutopilot(prev => ({ ...prev, ...config }));
    alert(`Autopilot policy rollout complete.`);
  };

  const completeOnboarding = (orgData: any, siteData: any) => {
    // Similar to loadDemoData but with form inputs
    setIsOnboarded(true);
  };

  return (
    <AppContext.Provider value={{ 
        user, org, sites, activeSite, meterData, insights, auditLogs, autopilot, team, deptRankings, rewards, tasks, devices, isAdvanced, isOnboarded, demoMode: DEMO_MODE,
        setAdvanced, setLeagueMode, setActiveSite, updateAutopilot, updateAssetPriority, applyPolicyToAllSites, completeOnboarding 
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error("useApp must be used within AppProvider");
  return context;
};
