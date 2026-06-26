'use client';

import React, { useState, useRef, useCallback } from 'react';

interface FileUploadProps {
  onFileContent: (content: string, fileName: string) => void;
  disabled?: boolean;
}

function parseCSV(text: string): string {
  const lines = text.trim().split('\n');
  if (lines.length === 0) return 'Empty file';

  const headers = lines[0].split(',').map((h) => h.trim().replace(/"/g, ''));
  const rows = lines.slice(1).filter((l) => l.trim());

  if (rows.length === 0) return `Headers: ${headers.join(', ')}`;

  let result = `CSV Data (${rows.length} rows):\n\n`;
  result += `| ${headers.join(' | ')} |\n`;
  result += `| ${headers.map(() => '---').join(' | ')} |\n`;

  for (const row of rows.slice(0, 50)) {
    const cells = row.split(',').map((c) => c.trim().replace(/"/g, ''));
    result += `| ${cells.join(' | ')} |\n`;
  }

  if (rows.length > 50) {
    result += `\n... and ${rows.length - 50} more rows`;
  }

  return result;
}

function parseText(content: string, fileName: string): string {
  if (fileName.endsWith('.csv')) return parseCSV(content);
  if (content.length > 5000) {
    return `Document: ${fileName}\n\nFirst 5000 characters:\n\n${content.substring(0, 5000)}\n\n... (${content.length - 5000} more characters)`;
  }
  return `Document: ${fileName}\n\n${content}`;
}

export default function FileUpload({ onFileContent, disabled }: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processFile = useCallback(
    async (file: File) => {
      setIsLoading(true);
      try {
        const text = await file.text();
        const parsed = parseText(text, file.name);
        onFileContent(parsed, file.name);
      } catch {
        onFileContent(`Error reading file: ${file.name}`, file.name);
      } finally {
        setIsLoading(false);
      }
    },
    [onFileContent]
  );

  const handleFiles = useCallback(
    (files: FileList | null) => {
      if (!files) return;
      for (const file of Array.from(files)) {
        processFile(file);
      }
    },
    [processFile]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      handleFiles(e.dataTransfer.files);
    },
    [handleFiles]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setIsDragging(false);
  }, []);

  return (
    <>
      <input
        ref={fileInputRef}
        type="file"
        accept=".csv,.txt,.json,.pdf,.doc,.docx,.xls,.xlsx"
        multiple
        onChange={(e) => handleFiles(e.target.files)}
        className="hidden"
      />

      <button
        onClick={() => fileInputRef.current?.click()}
        disabled={disabled || isLoading}
        className="w-9 h-9 min-w-[36px] flex items-center justify-center rounded-[10px] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        style={{
          backgroundColor: 'var(--bg-elevated)',
          color: 'var(--text-muted)',
          border: '0.5px solid var(--border-primary)',
        }}
        title="Upload file"
      >
        {isLoading ? (
          <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
        ) : (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M18.375 12.739l-7.693 7.693a4.5 4.5 0 01-6.364-6.364l10.94-10.94A3 3 0 1119.5 7.372L8.552 18.32m.009-.01l-.01.01m5.699-9.941l-7.81 7.81a1.5 1.5 0 002.112 2.13" />
          </svg>
        )}
      </button>

      {isDragging && (
        <div
          className="fixed inset-0 z-[80] flex items-center justify-center"
          style={{ backgroundColor: 'var(--shadow-overlay)' }}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
        >
          <div
            className="w-80 h-48 rounded-2xl border-2 border-dashed flex flex-col items-center justify-center gap-3"
            style={{ borderColor: 'var(--accent)', backgroundColor: 'var(--bg-surface)' }}
          >
            <svg className="w-8 h-8" style={{ color: 'var(--accent)' }} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
            </svg>
            <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>Drop your file here</span>
            <span className="text-xs" style={{ color: 'var(--text-muted)' }}>CSV, TXT, JSON, PDF supported</span>
          </div>
        </div>
      )}
    </>
  );
}

export function useFileDrag(onFile: (file: File) => void) {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const files = e.dataTransfer.files;
      if (files.length > 0) {
        for (const file of Array.from(files)) {
          onFile(file);
        }
      }
    },
    [onFile]
  );

  return { isDragging, handleDragOver, handleDragLeave, handleDrop };
}
