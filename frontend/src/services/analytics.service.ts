import { api } from './api';

export const analyticsService = {
  getOverview: () => api.get('/analytics/overview').then((r: any) => r.data),
  getKpi: () => api.get('/analytics/kpi').then((r: any) => r.data),
  getRealtime: () => api.get('/analytics/realtime').then((r: any) => r.data),
};
