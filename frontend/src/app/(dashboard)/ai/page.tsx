'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, Send, Sparkles, Loader2, User, Bot, Zap } from 'lucide-react';
import { aiService } from '@/services/ai.service';
import { cn } from '@/lib/utils';

type AgentType = 'hr' | 'sales' | 'finance' | 'analytics';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const AGENTS: { key: AgentType; label: string; description: string; color: string; icon: string }[] = [
  { key: 'hr', label: 'HR Agent', description: 'Employee management, attendance, payroll', color: 'from-blue-500 to-cyan-500', icon: '👥' },
  { key: 'sales', label: 'Sales Agent', description: 'CRM, pipeline, forecasting', color: 'from-emerald-500 to-teal-500', icon: '📈' },
  { key: 'finance', label: 'Finance Agent', description: 'Accounting, budgets, reports', color: 'from-amber-500 to-orange-500', icon: '💰' },
  { key: 'analytics', label: 'Analytics Agent', description: 'KPIs, trends, predictions', color: 'from-purple-500 to-pink-500', icon: '📊' },
];

const QUICK_PROMPTS: Record<AgentType, string[]> = {
  hr: ['Show attendance summary this month', 'Who has pending leave requests?', 'Top performers by KPI score'],
  sales: ['What deals are closing this week?', 'Analyze our win rate', 'Generate sales forecast for Q1'],
  finance: ['Monthly expense breakdown', 'Cash flow analysis', 'Tax optimization suggestions'],
  analytics: ['Key business metrics overview', 'Revenue growth trend', 'Identify performance anomalies'],
};

export default function AiPage() {
  const [activeAgent, setActiveAgent] = useState<AgentType>('hr');
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async (text?: string) => {
    const content = text || input.trim();
    if (!content || loading) return;

    const userMsg: Message = { id: Date.now().toString(), role: 'user', content, timestamp: new Date() };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const serviceMap = {
        hr: aiService.hrChat,
        sales: aiService.salesChat,
        finance: aiService.financeChat,
        analytics: aiService.analyticsChat,
      };

      const response = await serviceMap[activeAgent](content);
      const assistantMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response || 'No response received.',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, assistantMsg]);
    } catch {
      setMessages((prev) => [...prev, {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please check your OpenAI API key configuration.',
        timestamp: new Date(),
      }]);
    } finally {
      setLoading(false);
    }
  };

  const currentAgent = AGENTS.find((a) => a.key === activeAgent)!;

  return (
    <div className="flex h-[calc(100vh-8rem)] gap-4">
      {/* Agent Selector */}
      <div className="w-64 shrink-0 space-y-3">
        <div>
          <h2 className="text-sm font-semibold text-foreground mb-1">AI Agents</h2>
          <p className="text-xs text-muted-foreground">Choose your AI assistant</p>
        </div>
        {AGENTS.map((agent) => (
          <motion.button
            key={agent.key}
            whileHover={{ x: 2 }}
            onClick={() => { setActiveAgent(agent.key); setMessages([]); }}
            className={cn(
              'w-full text-left p-3 rounded-xl border transition-all',
              activeAgent === agent.key
                ? 'border-primary/30 bg-primary/5'
                : 'border-border bg-card hover:bg-accent',
            )}
          >
            <div className="flex items-center gap-2 mb-1">
              <span className="text-lg">{agent.icon}</span>
              <span className="text-sm font-medium text-foreground">{agent.label}</span>
              {activeAgent === agent.key && (
                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
              )}
            </div>
            <p className="text-[10px] text-muted-foreground">{agent.description}</p>
          </motion.button>
        ))}

        {/* Quick Prompts */}
        <div className="pt-2">
          <p className="text-xs font-medium text-muted-foreground mb-2">Quick Prompts</p>
          <div className="space-y-1.5">
            {QUICK_PROMPTS[activeAgent].map((prompt, i) => (
              <button
                key={i}
                onClick={() => sendMessage(prompt)}
                className="w-full text-left text-xs p-2 bg-muted hover:bg-accent rounded-lg transition-colors text-muted-foreground hover:text-foreground"
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col card-premium overflow-hidden">
        {/* Chat Header */}
        <div className={cn('p-4 border-b border-border bg-gradient-to-r', currentAgent.color, 'bg-opacity-10')}>
          <div className="flex items-center gap-3">
            <div className={cn('w-10 h-10 rounded-xl bg-gradient-to-br flex items-center justify-center text-xl', currentAgent.color)}>
              {currentAgent.icon}
            </div>
            <div>
              <h3 className="font-semibold text-foreground">{currentAgent.label}</h3>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                Online · Powered by GPT-4
              </div>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto scrollbar-thin p-4 space-y-4">
          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <div className={cn('w-16 h-16 rounded-2xl bg-gradient-to-br flex items-center justify-center text-3xl mb-4', currentAgent.color)}>
                {currentAgent.icon}
              </div>
              <h3 className="font-semibold text-foreground mb-1">How can I help you?</h3>
              <p className="text-sm text-muted-foreground max-w-xs">{currentAgent.description}</p>
            </div>
          )}

          <AnimatePresence>
            {messages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={cn('flex gap-3', msg.role === 'user' && 'flex-row-reverse')}
              >
                <div className={cn(
                  'w-8 h-8 rounded-full flex items-center justify-center shrink-0',
                  msg.role === 'user'
                    ? 'bg-gradient-to-br from-nexus-400 to-purple-500'
                    : `bg-gradient-to-br ${currentAgent.color}`,
                )}>
                  {msg.role === 'user' ? <User className="w-4 h-4 text-white" /> : <Bot className="w-4 h-4 text-white" />}
                </div>
                <div className={cn(
                  'max-w-[75%] rounded-2xl px-4 py-3 text-sm leading-relaxed',
                  msg.role === 'user'
                    ? 'bg-primary text-primary-foreground rounded-tr-sm'
                    : 'bg-muted text-foreground rounded-tl-sm',
                )}>
                  <p className="whitespace-pre-wrap">{msg.content}</p>
                  <p className={cn('text-[10px] mt-1', msg.role === 'user' ? 'text-primary-foreground/60' : 'text-muted-foreground')}>
                    {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {loading && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-3">
              <div className={cn('w-8 h-8 rounded-full bg-gradient-to-br flex items-center justify-center', currentAgent.color)}>
                <Bot className="w-4 h-4 text-white" />
              </div>
              <div className="bg-muted rounded-2xl rounded-tl-sm px-4 py-3 flex items-center gap-1">
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    className="w-1.5 h-1.5 rounded-full bg-muted-foreground"
                    animate={{ y: [0, -4, 0] }}
                    transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }}
                  />
                ))}
              </div>
            </motion.div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-4 border-t border-border">
          <div className="flex items-center gap-3">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && sendMessage()}
              placeholder={`Ask ${currentAgent.label}...`}
              className="flex-1 px-4 py-2.5 bg-muted rounded-xl text-sm border border-border
                         focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary
                         transition-all placeholder:text-muted-foreground/50"
            />
            <button
              onClick={() => sendMessage()}
              disabled={loading || !input.trim()}
              className={cn(
                'w-10 h-10 rounded-xl flex items-center justify-center transition-all',
                'bg-gradient-to-br', currentAgent.color,
                'text-white hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed',
              )}
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
