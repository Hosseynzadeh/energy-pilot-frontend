
import { TeamMember, DepartmentRanking, Reward } from '../types';
import { DEMO_MODE, DEMO_TEAM, DEMO_DEPT_RANKINGS } from './demoData';

export const getTeamPerformance = async (): Promise<TeamMember[]> => {
  if (DEMO_MODE) return DEMO_TEAM;
  return [];
};

export const getDepartmentRankings = async (): Promise<DepartmentRanking[]> => {
  if (DEMO_MODE) return DEMO_DEPT_RANKINGS;
  return [];
};
