
import { AuditLogEntry } from '../types';
import { DEMO_MODE, DEMO_ACTIONS } from './demoData';

export const getAuditLogs = async (): Promise<AuditLogEntry[]> => {
  if (DEMO_MODE) return DEMO_ACTIONS;
  return [];
};
