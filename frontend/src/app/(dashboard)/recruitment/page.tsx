'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Plus, Briefcase, Users, UserCheck, Brain } from 'lucide-react';
import { api } from '@/services/api';
import { StatCard } from '@/components/dashboard/stat-card';
import { aiService } from '@/services/ai.service';
import toast from 'react-hot-toast';

export default function RecruitmentPage() {
  const [selectedVacancy, setSelectedVacancy] = useState<string | null>(null);
  const [cvText, setCvText] = useState('');
  const [analyzing, setAnalyzing] = useState(false);
  const [aiResult, setAiResult] = useState<any>(null);

  const { data: vacancies, isLoading } = useQuery({
    queryKey: ['recruitment', 'vacancies'],
    queryFn: () => api.get('/recruitment/vacancies').then((r: any) => r),
  });

  const { data: stats } = useQuery({
    queryKey: ['recruitment', 'stats'],
    queryFn: () => api.get('/recruitment/vacancies/stats').then((r: any) => r),
  });

  const analyzeResume = async () => {
    if (!cvText.trim() || !selectedVacancy) return;
    setAnalyzing(true);
    try {
      const vacancy = vacancies?.data?.find((v: any) => v.id === selectedVacancy);
      const result = await aiService.analyzeResume(cvText, vacancy?.description || '');
      setAiResult(result);
      toast.success('Resume analyzed successfully');
    } catch {
      toast.error('AI analysis failed');
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Recruitment</h1>
          <p className="text-muted-foreground text-sm mt-0.5">Hiring pipeline with AI resume analysis</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-nexus-500 to-nexus-600 text-white rounded-xl text-sm font-medium hover:from-nexus-600 hover:to-nexus-700 transition-all shadow-premium">
          <Plus className="w-4 h-4" />
          Post Vacancy
        </button>
      </div>

      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard title="Open Vacancies" value={stats?.openVacancies ?? 0} icon={Briefcase} color="blue" />
        <StatCard title="Total Candidates" value={stats?.totalCandidates ?? 0} icon={Users} color="purple" />
        <StatCard title="Hired" value={stats?.hired ?? 0} icon={UserCheck} color="green" />
        <StatCard title="AI Analyzed" value="48" icon={Brain} color="orange" />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Vacancies */}
        <div className="card-premium overflow-hidden">
          <div className="flex items-center justify-between p-4 border-b border-border">
            <h3 className="font-semibold text-foreground">Open Positions</h3>
            <span className="text-xs text-muted-foreground">{stats?.openVacancies || 0} open</span>
          </div>
          <div className="divide-y divide-border max-h-96 overflow-y-auto scrollbar-thin">
            {isLoading ? (
              [...Array(4)].map((_, i) => <div key={i} className="skeleton h-16 m-4 rounded-xl" />)
            ) : (
              vacancies?.data?.map((v: any) => (
                <div
                  key={v.id}
                  onClick={() => setSelectedVacancy(v.id)}
                  className={`p-4 cursor-pointer hover:bg-muted/30 transition-colors ${selectedVacancy === v.id ? 'bg-primary/5 border-l-2 border-primary' : ''}`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm font-medium text-foreground">{v.title}</p>
                      <p className="text-xs text-muted-foreground mt-0.5 capitalize">{v.employmentType?.replace('_', ' ')} · {v.experienceLevel}</p>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${v.status === 'open' ? 'badge-active' : 'badge-inactive'}`}>
                      {v.status}
                    </span>
                  </div>
                  {v.salaryMin && (
                    <p className="text-xs text-muted-foreground mt-1">
                      ${v.salaryMin.toLocaleString()} – ${v.salaryMax?.toLocaleString()}
                    </p>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

        {/* AI Resume Analyzer */}
        <div className="card-premium p-6">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-nexus-500 to-purple-600 flex items-center justify-center">
              <Brain className="w-4 h-4 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground text-sm">AI Resume Analyzer</h3>
              <p className="text-[10px] text-muted-foreground">Powered by GPT-4</p>
            </div>
          </div>

          <div className="space-y-3">
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Select Vacancy</label>
              <select
                value={selectedVacancy || ''}
                onChange={(e) => setSelectedVacancy(e.target.value)}
                className="input-field"
              >
                <option value="">Choose a vacancy...</option>
                {vacancies?.data?.map((v: any) => (
                  <option key={v.id} value={v.id}>{v.title}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Paste CV / Resume Text</label>
              <textarea
                value={cvText}
                onChange={(e) => setCvText(e.target.value)}
                rows={6}
                placeholder="Paste the candidate's CV text here..."
                className="input-field resize-none"
              />
            </div>

            <button
              onClick={analyzeResume}
              disabled={analyzing || !cvText.trim() || !selectedVacancy}
              className="w-full py-2.5 bg-gradient-to-r from-nexus-500 to-purple-600 text-white text-sm font-medium rounded-xl hover:opacity-90 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {analyzing ? (
                <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Analyzing...</>
              ) : (
                <><Brain className="w-4 h-4" /> Analyze with AI</>
              )}
            </button>
          </div>

          {/* AI Result */}
          {aiResult && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-4 p-4 bg-muted/50 rounded-xl space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-foreground">Match Score</span>
                <div className="flex items-center gap-2">
                  <div className="w-24 h-2 bg-muted rounded-full">
                    <div className="h-full bg-gradient-to-r from-nexus-500 to-purple-500 rounded-full" style={{ width: `${aiResult.score}%` }} />
                  </div>
                  <span className="text-sm font-bold text-foreground">{aiResult.score}%</span>
                </div>
              </div>
              <p className="text-xs text-foreground/80 leading-relaxed">{aiResult.summary}</p>
              {aiResult.data?.recommendation && (
                <span className={`inline-block text-xs px-2.5 py-1 rounded-full font-medium ${
                  aiResult.data.recommendation === 'hire' ? 'badge-active' :
                  aiResult.data.recommendation === 'consider' ? 'badge-pending' : 'badge-error'
                }`}>
                  Recommendation: {aiResult.data.recommendation}
                </span>
              )}
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
