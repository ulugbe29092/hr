'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Brain, Sparkles, TrendingUp, AlertTriangle, Lightbulb, Loader2 } from 'lucide-react';
import { aiService } from '@/services/ai.service';

const insights = [
  { icon: TrendingUp, color: 'text-emerald-500', text: 'Revenue is up 18% compared to last month. Strong performance in Q4.' },
  { icon: AlertTriangle, color: 'text-amber-500', text: '3 employees have attendance below 80% this month. HR review recommended.' },
  { icon: Lightbulb, color: 'text-blue-500', text: '5 high-value deals in negotiation stage. Follow-up recommended this week.' },
];

export function AiInsightCard() {
  const [chatInput, setChatInput] = useState('');
  const [chatResponse, setChatResponse] = useState('');
  const [loading, setLoading] = useState(false);

  const askAi = async () => {
    if (!chatInput.trim()) return;
    setLoading(true);
    try {
      const res = await aiService.analyticsChat(chatInput);
      setChatResponse(res);
    } catch {
      setChatResponse('AI service unavailable. Please check your API key.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card-premium p-6 h-full flex flex-col">
      <div className="flex items-center gap-2 mb-5">
        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-nexus-500 to-purple-600 flex items-center justify-center">
          <Brain className="w-4 h-4 text-white" />
        </div>
        <div>
          <h3 className="font-semibold text-foreground text-sm">AI Insights</h3>
          <p className="text-[10px] text-muted-foreground">Powered by GPT-4</p>
        </div>
        <Sparkles className="w-4 h-4 text-nexus-400 ml-auto animate-pulse" />
      </div>

      {/* Auto Insights */}
      <div className="space-y-3 mb-4">
        {insights.map((insight, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="flex items-start gap-2.5 p-3 bg-muted/50 rounded-xl"
          >
            <insight.icon className={`w-4 h-4 mt-0.5 shrink-0 ${insight.color}`} />
            <p className="text-xs text-foreground/80 leading-relaxed">{insight.text}</p>
          </motion.div>
        ))}
      </div>

      {/* Chat Response */}
      {chatResponse && (
        <div className="p-3 bg-nexus-500/10 border border-nexus-500/20 rounded-xl mb-3">
          <p className="text-xs text-foreground/80 leading-relaxed">{chatResponse}</p>
        </div>
      )}

      {/* Chat Input */}
      <div className="mt-auto flex gap-2">
        <input
          value={chatInput}
          onChange={(e) => setChatInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && askAi()}
          placeholder="Ask AI anything..."
          className="flex-1 px-3 py-2 bg-muted rounded-xl text-xs border border-border
                     focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary
                     placeholder:text-muted-foreground/50 transition-all"
        />
        <button
          onClick={askAi}
          disabled={loading || !chatInput.trim()}
          className="px-3 py-2 bg-gradient-to-r from-nexus-500 to-nexus-600 text-white rounded-xl
                     text-xs font-medium hover:from-nexus-600 hover:to-nexus-700 transition-all
                     disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
        >
          {loading ? <Loader2 className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />}
          Ask
        </button>
      </div>
    </div>
  );
}
