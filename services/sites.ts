
import { Site } from '../types';
import { DEMO_MODE, DEMO_SITES } from './demoData';

export const getSites = async (): Promise<Site[]> => {
  if (DEMO_MODE) {
    return DEMO_SITES;
  }
  // Placeholder for real API
  const response = await fetch('/api/sites');
  return response.json();
};
