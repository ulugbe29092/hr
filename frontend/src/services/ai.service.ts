import { api } from './api';

export const aiService = {
  hrChat: (message: string, context?: any) =>
    api.post('/ai/hr/chat', { message, context }).then((r: any) => r.data?.response),

  salesChat: (message: string, context?: any) =>
    api.post('/ai/sales/chat', { message, context }).then((r: any) => r.data?.response),

  financeChat: (message: string, context?: any) =>
    api.post('/ai/finance/chat', { message, context }).then((r: any) => r.data?.response),

  analyticsChat: (message: string, context?: any) =>
    api.post('/ai/analytics/chat', { message, context }).then((r: any) => r.data?.response),

  analyzeResume: (cvText: string, vacancyDescription: string) =>
    api.post('/ai/resume/analyze', { cvText, vacancyDescription }).then((r: any) => r.data),

  salesForecast: (months?: number) =>
    api.post('/ai/sales/forecast', { months }).then((r: any) => r.data),

  generateReport: (reportType: string, data: any) =>
    api.post('/ai/report/generate', { reportType, data }).then((r: any) => r.data?.report),
};
