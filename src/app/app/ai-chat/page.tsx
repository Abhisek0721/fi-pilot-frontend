'use client';

import { useState, useRef, useEffect } from 'react';
import { ChatMessage } from '@/components/ai-chat/ChatMessage';
import { ChatInput } from '@/components/ai-chat/ChatInput';
import { Sparkles } from 'lucide-react';
import type { AiChatMessage } from '@/types';

const STARTER_PROMPTS = [
  'What was my net profit last month?',
  'Which clients have overdue invoices?',
  'How much GST do I owe this quarter?',
  'What are my top 5 expenses this month?',
  'Show me my cash flow for the last 3 months',
  'Which vendor am I paying the most?',
];

const PLACEHOLDER_RESPONSE: AiChatMessage = {
  id: 'placeholder',
  role: 'ASSISTANT',
  content: 'I can answer questions about your finances once you have uploaded documents and built your books. Try uploading a bank statement or invoice first.',
  createdAt: new Date().toISOString(),
  sessionId: '',
  organizationId: '',
};

export default function AiChatPage() {
  const [messages, setMessages] = useState<AiChatMessage[]>([]);
  const [responding, setResponding] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  async function handleSend(text: string) {
    const userMsg: AiChatMessage = {
      id: crypto.randomUUID(),
      role: 'USER',
      content: text,
      createdAt: new Date().toISOString(),
      sessionId: '',
      organizationId: '',
    };
    setMessages(prev => [...prev, userMsg]);
    setResponding(true);

    await new Promise(r => setTimeout(r, 900));

    const aiMsg: AiChatMessage = {
      ...PLACEHOLDER_RESPONSE,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    };
    setMessages(prev => [...prev, aiMsg]);
    setResponding(false);
  }

  function handleStarter(prompt: string) {
    handleSend(prompt);
  }

  return (
    <div style={{ height: 'calc(100vh - 64px - 48px)', display: 'flex', flexDirection: 'column', maxWidth: 860 }}>

      {/* Header */}
      <div style={{ marginBottom: 20, flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
          <div style={{
            width: 32, height: 32, borderRadius: 9,
            background: '#2563EB',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Sparkles size={15} color="white" />
          </div>
          <h1 style={{ fontSize: 20, fontWeight: 800, color: 'hsl(var(--foreground))', letterSpacing: '-0.4px', margin: 0 }}>
            AI Chat
          </h1>
        </div>
        <p style={{ fontSize: 13, color: 'hsl(var(--muted-foreground))', margin: 0 }}>
          Ask questions about your finances. Every answer is calculated from your real accounting data.
        </p>
      </div>

      {/* Messages area */}
      <div style={{
        flex: 1, overflowY: 'auto', minHeight: 0,
        display: 'flex', flexDirection: 'column',
      }}>
        {messages.length === 0 ? (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px 0', gap: 32 }}>

            {/* Empty state illustration */}
            <div style={{ textAlign: 'center' }}>
              <div style={{
                width: 64, height: 64, borderRadius: 18,
                background: 'linear-gradient(135deg, rgba(37,99,235,0.07), rgba(29,78,216,0.10))',
                border: '1px solid rgba(37,99,235,0.18)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                margin: '0 auto 16px',
              }}>
                <Sparkles size={28} color="#6366F1" />
              </div>
              <h2 style={{ fontSize: 17, fontWeight: 700, color: 'hsl(var(--foreground))', margin: '0 0 6px' }}>
                Ask anything about your finances
              </h2>
              <p style={{ fontSize: 13, color: 'hsl(var(--muted-foreground))', margin: 0, maxWidth: 380, lineHeight: 1.6 }}>
                The AI runs real queries on your accounting data and gives specific, number-backed answers — never vague summaries.
              </p>
            </div>

            {/* Starter prompts */}
            <div style={{ width: '100%', maxWidth: 580 }}>
              <p style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'hsl(var(--muted-foreground))', marginBottom: 10, textAlign: 'center' }}>
                Try asking
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                {STARTER_PROMPTS.map(prompt => (
                  <button
                    key={prompt}
                    onClick={() => handleStarter(prompt)}
                    style={{
                      padding: '11px 14px', borderRadius: 10, textAlign: 'left',
                      background: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      fontSize: 13, color: 'hsl(var(--foreground))',
                      cursor: 'pointer', fontFamily: 'inherit', fontWeight: 500,
                      lineHeight: 1.45,
                      transition: 'border-color 0.15s',
                    }}
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>

          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20, padding: '4px 0 20px' }}>
            {messages.map(msg => (
              <ChatMessage key={msg.id} message={msg} />
            ))}
            {responding && (
              <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                <div style={{
                  width: 32, height: 32, borderRadius: '50%', flexShrink: 0,
                  background: '#2563EB',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <Sparkles size={14} color="white" />
                </div>
                <div style={{
                  padding: '12px 16px', borderRadius: 16, borderTopLeftRadius: 4,
                  backgroundColor: 'hsl(var(--muted))',
                  display: 'flex', gap: 4, alignItems: 'center',
                }}>
                  {[0, 1, 2].map(i => (
                    <span key={i} style={{
                      width: 6, height: 6, borderRadius: '50%',
                      backgroundColor: 'hsl(var(--muted-foreground))',
                      opacity: 0.5,
                      animation: `pulse-dot 1.2s ease-in-out ${i * 0.2}s infinite`,
                    }} />
                  ))}
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>
        )}
      </div>

      {/* Input */}
      <div style={{ flexShrink: 0 }}>
        <ChatInput onSend={handleSend} disabled={responding} />
      </div>

    </div>
  );
}
