import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface MarkdownRendererProps {
  content: string;
  isUser?: boolean;
}

export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content, isUser = false }) => {
  return (
    <div className={`markdown-content ${isUser ? 'text-white' : 'text-gray-800'}`}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
        p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
        strong: ({ children }) => <strong className={`font-bold ${isUser ? 'text-white' : 'text-gray-900'}`}>{children}</strong>,
        em: ({ children }) => <em className="italic">{children}</em>,
        ul: ({ children }) => <ul className="list-disc list-inside mb-2 space-y-1">{children}</ul>,
        ol: ({ children }) => <ol className="list-decimal list-inside mb-2 space-y-1">{children}</ol>,
        li: ({ children }) => <li className="ml-2">{children}</li>,
        code: ({ children, className }) => {
          const isInline = !className;
          return isInline ? (
            <code className={`px-1.5 py-0.5 rounded text-xs font-mono ${isUser ? 'bg-white/20' : 'bg-gray-200'}`}>
              {children}
            </code>
          ) : (
            <code className={`block px-3 py-2 rounded text-xs font-mono overflow-x-auto ${isUser ? 'bg-white/20' : 'bg-gray-200'}`}>
              {children}
            </code>
          );
        },
        pre: ({ children }) => <pre className="mb-2">{children}</pre>,
        a: ({ children, href }) => (
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className={`underline hover:opacity-80 ${isUser ? 'text-white' : 'text-primary'}`}
          >
            {children}
          </a>
        ),
        blockquote: ({ children }) => (
          <blockquote className={`border-l-4 pl-3 italic ${isUser ? 'border-white/50' : 'border-gray-400'}`}>
            {children}
          </blockquote>
        ),
        h1: ({ children }) => <h1 className="text-lg font-bold mb-2">{children}</h1>,
        h2: ({ children }) => <h2 className="text-base font-bold mb-2">{children}</h2>,
        h3: ({ children }) => <h3 className="text-sm font-bold mb-1">{children}</h3>,
        hr: () => <hr className={`my-2 ${isUser ? 'border-white/30' : 'border-gray-300'}`} />,
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};
