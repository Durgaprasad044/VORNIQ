import React from 'react';

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
  personaEmoji: string;
}

function parseInlineBold(text: string) {
  const boldRegex = /\*\*(.*?)\*\*/g;
  const parts = [];
  let lastIndex = 0;
  let match;
  while ((match = boldRegex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.substring(lastIndex, match.index));
    }
    parts.push(<strong key={match.index} className="font-semibold text-white">{match[1]}</strong>);
    lastIndex = boldRegex.lastIndex;
  }
  if (lastIndex < text.length) {
    parts.push(text.substring(lastIndex));
  }
  return parts.length > 0 ? parts : text;
}

function renderTable(rows: string[][], key: any) {
  if (rows.length === 0) return null;
  const header = rows[0];
  const body = rows.slice(1);

  return (
    <div key={key} className="overflow-x-auto my-3 border-[0.5px] border-[#222222] rounded-lg">
      <table className="min-w-full divide-y divide-[#222222] text-xs">
        <thead className="bg-[#111111]">
          <tr>
            {header.map((cell, idx) => (
              <th key={idx} className="px-3 py-2 text-left font-bold text-white uppercase tracking-wider">
                {cell}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-[#222222] bg-transparent">
          {body.map((row, rIdx) => (
            <tr key={rIdx} className="hover:bg-[#1a1a1a]/50">
              {row.map((cell, cIdx) => (
                <td key={cIdx} className="px-3 py-2 whitespace-nowrap text-[#cccccc]">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
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
        <div key={i} className="flex gap-2 ml-4 my-1">
          <span className="text-[#22c55e] font-semibold">{numberedMatch[1]}.</span>
          <span className="flex-1 text-[#cccccc]">{parseInlineBold(numberedMatch[2])}</span>
        </div>
      );
      continue;
    }

    // Bullet list parsing
    const bulletMatch = line.match(/^([*\-·])\s+(.*)/);
    if (bulletMatch) {
      elements.push(
        <div key={i} className="flex gap-2 ml-4 my-1">
          <span className="text-[#22c55e]">•</span>
          <span className="flex-1 text-[#cccccc]">{parseInlineBold(bulletMatch[2])}</span>
        </div>
      );
      continue;
    }

    // Empty line or normal text
    if (line === '') {
      elements.push(<div key={i} className="h-2" />);
    } else {
      elements.push(
        <p key={i} className="my-1 text-[#cccccc]">
          {parseInlineBold(line)}
        </p>
      );
    }
  }

  if (currentTable) {
    elements.push(renderTable(currentTable, `table-final`));
  }

  return elements;
}

export default function MessageBubble({ message, personaEmoji }: MessageBubbleProps) {
  const isUser = message.role === 'user';

  return (
    <div className={`w-full flex ${isUser ? 'justify-end' : 'justify-start'} mb-4 px-4`}>
      <div className={`flex gap-3 max-w-[85%] ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
        {/* Avatar */}
        <div className="flex-shrink-0">
          {isUser ? (
            <div className="w-8 h-8 flex items-center justify-center bg-[#1e3a2f] text-[#22c55e] border-[0.5px] border-[#222222] rounded-xl text-xs font-bold font-mono select-none">
              D
            </div>
          ) : (
            <div className="w-8 h-8 flex items-center justify-center bg-[#1a1a1a] border-[0.5px] border-[#222222] rounded-xl text-base select-none">
              {personaEmoji}
            </div>
          )}
        </div>

        {/* Bubble & Metadata */}
        <div className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}>
          <div
            style={{
              borderRadius: isUser ? '12px 2px 12px 12px' : '2px 12px 12px 12px',
            }}
            className={`border-[0.5px] border-[#222222] p-3 text-sm leading-relaxed ${
              isUser ? 'bg-[#1e3a2f] text-[#d4f0e0]' : 'bg-[#1a1a1a] text-[#cccccc]'
            }`}
          >
            {isUser ? (
              <p className="whitespace-pre-wrap">{message.content}</p>
            ) : (
              formatMessage(message.content)
            )}
          </div>

          {/* Under bubble metadata (recalled pill and timestamp) */}
          <div className="flex items-center gap-2 mt-1.5 px-0.5">
            {!isUser && message.memoriesUsed && message.memoriesUsed > 0 ? (
              <span className="bg-[#162312] border-[0.5px] border-[#22c55e33] text-[#22c55e] text-[9px] font-semibold py-1 px-2.5 rounded-full select-none flex items-center gap-1.5">
                <svg className="w-2.5 h-2.5 text-[#22c55e] flex-shrink-0" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
                </svg>
                {message.memoriesList && message.memoriesList.length > 0 
                  ? `recalled: ${message.memoriesList.join(' · ')}`
                  : `recalled: ${message.memoriesUsed} memories`
                }
              </span>
            ) : null}
            <span className="text-[10px] text-[#666666] tracking-wide font-medium">
              {message.timestamp}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export function TypingIndicator({ personaEmoji }: { personaEmoji: string }) {
  return (
    <div className="w-full flex justify-start mb-4 px-4">
      <div className="flex gap-3 max-w-[85%] flex-row">
        {/* Avatar */}
        <div className="flex-shrink-0">
          <div className="w-8 h-8 flex items-center justify-center bg-[#1a1a1a] border-[0.5px] border-[#222222] rounded-xl text-base select-none">
            {personaEmoji}
          </div>
        </div>

        {/* Bubble */}
        <div className="flex flex-col items-start">
          <div
            style={{ borderRadius: '2px 12px 12px 12px' }}
            className="border-[0.5px] border-[#222222] bg-[#1a1a1a] p-3.5 flex items-center gap-1.5 min-w-[50px] justify-center"
          >
            <span className="w-1.5 h-1.5 bg-[#22c55e] rounded-full animate-pulse" style={{ animationDelay: '0ms' }} />
            <span className="w-1.5 h-1.5 bg-[#22c55e] rounded-full animate-pulse" style={{ animationDelay: '150ms' }} />
            <span className="w-1.5 h-1.5 bg-[#22c55e] rounded-full animate-pulse" style={{ animationDelay: '300ms' }} />
          </div>
        </div>
      </div>
    </div>
  );
}
