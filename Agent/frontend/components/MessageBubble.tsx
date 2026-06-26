import React from 'react';
import CopyButton from './CopyButton';
import { PERSONAS, PersonaId } from './Sidebar';

export interface Message {
  role: 'user' | 'assistant';
  content: string;
  memoriesUsed?: number;
  memoriesList?: string[];
  persona?: string;
  timestamp: string;
}

interface MessageBubbleProps {
  message: Message;
}

function parseInlineBold(text: string) {
  const boldRegex = /\*\*(.*?)\*\*/g;
  const parts = [];
  let lastIndex = 0;
  let match;
  let key = 0;
  while ((match = boldRegex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.substring(lastIndex, match.index));
    }
    parts.push(<strong key={`b-${key++}`} className="font-semibold" style={{ color: 'var(--text-primary)' }}>{match[1]}</strong>);
    lastIndex = boldRegex.lastIndex;
  }
  if (lastIndex < text.length) {
    parts.push(text.substring(lastIndex));
  }
  return parts.length > 0 ? parts : text;
}

function parseCellContent(text: string) {
  const cleaned = text.replace(/<br\s*\/?>/gi, '\n');
  const lines = cleaned.split('\n');
  const parts: React.ReactNode[] = [];
  lines.forEach((line, i) => {
    if (i > 0) parts.push(<br key={`br-${i}`} />);
    if (line.trim()) parts.push(<span key={`t-${i}`}>{parseInlineBold(line.trim())}</span>);
  });
  return parts.length > 0 ? parts : text;
}

function tableToText(rows: string[][]): string {
  if (rows.length === 0) return '';
  return rows.map((row) => row.join(' | ')).join('\n');
}

function renderTable(rows: string[][], key: any) {
  if (rows.length === 0) return null;
  const header = rows[0];
  const body = rows.slice(1);

  return (
    <div key={key} className="my-3 rounded-lg max-w-full" style={{ border: '0.5px solid var(--border-primary)' }}>
      <div className="overflow-x-auto">
        <table className="w-full text-xs table-fixed">
          <thead style={{ backgroundColor: 'var(--bg-surface)' }}>
            <tr>
              {header.map((cell, idx) => (
                <th key={idx} className="px-3 py-2 text-left font-bold uppercase tracking-wider break-words" style={{ color: 'var(--text-primary)', borderBottom: '0.5px solid var(--border-primary)' }}>
                  {cell}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {body.map((row, rIdx) => (
              <tr key={rIdx} className="transition-colors" style={{ borderBottom: rIdx < body.length - 1 ? '0.5px solid var(--border-primary)' : undefined }}>
                {row.map((cell, cIdx) => (
                  <td key={cIdx} className="px-3 py-2 break-words align-top" style={{ color: 'var(--text-secondary)' }}>
                    {parseCellContent(cell)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex justify-end px-2 py-1" style={{ borderTop: '0.5px solid var(--border-primary)' }}>
        <CopyButton text={tableToText(rows)} />
      </div>
    </div>
  );
}

function formatMessage(content: string) {
  const lines = content.split('\n');
  const elements: React.ReactNode[] = [];
  
  let currentTable: string[][] | null = null;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();

    // Table parsing
    if (line.startsWith('|')) {
      const cells = line.split('|').map(c => c.trim()).filter((_, idx, arr) => idx > 0 && idx < arr.length - 1);
      
      const isSeparator = cells.every(c => /^:?-+:?$/.test(c));
      if (isSeparator) {
        continue;
      }

      if (!currentTable) {
        currentTable = [cells];
      } else {
        currentTable.push(cells);
      }
      continue;
    } else if (currentTable) {
      elements.push(renderTable(currentTable, `table-${i}`));
      currentTable = null;
    }

    // Numbered list parsing
    const numberedMatch = line.match(/^(\d+)\.\s+(.*)/);
    if (numberedMatch) {
      elements.push(
        <div key={i} className="flex gap-2 ml-4 my-1 min-w-0">
          <span className="font-semibold flex-shrink-0" style={{ color: 'var(--accent)' }}>{numberedMatch[1]}.</span>
          <span className="flex-1 break-words" style={{ color: 'var(--text-secondary)' }}>{parseInlineBold(numberedMatch[2].replace(/<br\s*\/?>/gi, '\n'))}</span>
        </div>
      );
      continue;
    }

    // Bullet list parsing
    const bulletMatch = line.match(/^([*\-·])\s+(.*)/);
    if (bulletMatch) {
      elements.push(
        <div key={i} className="flex gap-2 ml-4 my-1 min-w-0">
          <span className="flex-shrink-0" style={{ color: 'var(--accent)' }}>•</span>
          <span className="flex-1 break-words whitespace-pre-wrap" style={{ color: 'var(--text-secondary)' }}>{parseInlineBold(bulletMatch[2].replace(/<br\s*\/?>/gi, '\n'))}</span>
        </div>
      );
      continue;
    }

    // Empty line or normal text
    if (line === '') {
      elements.push(<div key={i} className="h-2" />);
    } else {
      elements.push(
        <p key={i} className="my-1 break-words whitespace-pre-wrap" style={{ color: 'var(--text-secondary)' }}>
          {parseInlineBold(line.replace(/<br\s*\/?>/gi, '\n'))}
        </p>
      );
    }
  }

  if (currentTable) {
    elements.push(renderTable(currentTable, `table-final`));
  }

  return elements;
}

export default function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.role === 'user';

  return (
    <div className={`w-full flex ${isUser ? 'justify-end' : 'justify-start'} mb-4 px-3 md:px-4 overflow-hidden`}>
      <div className={`flex gap-2.5 md:gap-3 max-w-[90%] md:max-w-[85%] min-w-0 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
        {/* Avatar */}
        <div className="flex-shrink-0">
            <div className="w-8 h-8 flex items-center justify-center rounded-xl text-xs font-bold font-mono select-none" style={{ backgroundColor: 'var(--accent-bg)', color: 'var(--accent)', border: '0.5px solid var(--border-primary)' }}>
              {isUser ? 'D' : 'V'}
            </div>
        </div>

        {/* Bubble & Metadata */}
        <div className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}>
          <div
            style={{
              borderRadius: isUser ? '12px 2px 12px 12px' : '2px 12px 12px 12px',
              backgroundColor: isUser ? 'var(--accent-bg)' : 'var(--bg-elevated)',
              color: isUser ? 'var(--accent-text)' : 'var(--text-secondary)',
              border: '0.5px solid var(--border-primary)',
            }}
            className="p-3 text-sm leading-relaxed overflow-hidden"
          >
            {isUser ? (
              <p className="whitespace-pre-wrap break-words">{message.content}</p>
            ) : (
              formatMessage(message.content)
            )}
          </div>

          {/* Under bubble metadata (recalled pill and timestamp) */}
          <div className="flex items-center gap-2 mt-1.5 px-0.5">
            {!isUser && message.memoriesUsed && message.memoriesUsed > 0 ? (
              <span className="text-[9px] font-semibold py-1 px-2.5 rounded-full select-none flex items-center gap-1.5" style={{ backgroundColor: 'var(--accent-subtle)', color: 'var(--accent)', border: '0.5px solid var(--accent-border)' }}>
                <svg className="w-2.5 h-2.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
                </svg>
                {message.memoriesList && message.memoriesList.length > 0 
                  ? `recalled: ${message.memoriesList.join(' · ')}`
                  : `recalled: ${message.memoriesUsed} memories`
                }
              </span>
            ) : null}
            <span className="text-[10px] tracking-wide font-medium" style={{ color: 'var(--text-faint)' }}>
              {message.timestamp}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export function TypingIndicator({ persona }: { persona?: PersonaId }) {
  const personaInfo = persona ? PERSONAS.find((p) => p.id === persona) : null;

  return (
    <div className="w-full flex justify-start mb-4 px-4 overflow-hidden">
      <div className="flex gap-2.5 md:gap-3 max-w-[90%] md:max-w-[85%] min-w-0 flex-row">
        {/* Avatar */}
        <div className="flex-shrink-0">
          <div className="w-8 h-8 flex items-center justify-center rounded-xl text-xs font-bold font-mono select-none" style={{ backgroundColor: 'var(--accent-bg)', color: 'var(--accent)', border: '0.5px solid var(--border-primary)' }}>
            V
          </div>
        </div>

        {/* Bubble */}
        <div className="flex flex-col items-start">
          {personaInfo && (
            <span className="text-[10px] font-semibold mb-1 px-0.5" style={{ color: 'var(--accent)' }}>
              {personaInfo.role} is thinking...
            </span>
          )}
          <div
            style={{ borderRadius: '2px 12px 12px 12px', border: '0.5px solid var(--border-primary)', backgroundColor: 'var(--bg-elevated)' }}
            className="p-3.5 flex items-center gap-1.5 min-w-[50px] justify-center"
          >
            <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: 'var(--accent)', animationDelay: '0ms' }} />
            <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: 'var(--accent)', animationDelay: '150ms' }} />
            <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: 'var(--accent)', animationDelay: '300ms' }} />
          </div>
        </div>
      </div>
    </div>
  );
}
