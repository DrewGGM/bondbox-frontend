import React from 'react';
import type {
  Message,
  TaskCardData,
  ExpenseCardData,
  IncomeCardData,
  InventoryCardData,
} from '@/types/ai.types';
import { TaskCard } from './cards/TaskCard';
import { ExpenseCard } from './cards/ExpenseCard';
import { IncomeCard } from './cards/IncomeCard';
import { InventoryCard } from './cards/InventoryCard';
import { MCPDataRenderer } from './MCPDataRenderer';
import { MarkdownRenderer } from './MarkdownRenderer';
import { ActionBadge } from './ActionBadge';
import { VisualizationCard } from './VisualizationCard';

interface ChatMessageProps {
  message: Message;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isUser = message.type === 'user';

  const renderCard = () => {
    if (!message.card) return null;

    switch (message.card.type) {
      case 'task':
        return <TaskCard data={message.card.data as TaskCardData} />;
      case 'expense':
        return <ExpenseCard data={message.card.data as ExpenseCardData} />;
      case 'income':
        return <IncomeCard data={message.card.data as IncomeCardData} />;
      case 'inventory':
        return <InventoryCard data={message.card.data as InventoryCardData} />;
      default:
        return null;
    }
  };

  const renderMCPData = () => {
    if (!message.mcp_data) return null;
    return <MCPDataRenderer data={message.mcp_data} />;
  };

  const renderUIData = () => {
    if (!message.ui_data) return null;

    const { actions, visualizations } = message.ui_data;

    if (actions.length === 0 && visualizations.length === 0) return null;

    return (
      <div className="space-y-3 mt-2">
        {actions.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-xs font-semibold text-gray-600">Acciones Realizadas</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {actions.map((action, idx) => (
                <ActionBadge key={idx} action={action} />
              ))}
            </div>
          </div>
        )}

        {visualizations.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-xs font-semibold text-gray-600">Datos</h4>
            <div className="grid grid-cols-1 gap-3">
              {visualizations.map((viz, idx) => (
                <VisualizationCard key={idx} visualization={viz} />
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div
      className={`flex gap-2 md:gap-3 ${isUser ? 'flex-row-reverse' : ''} max-w-[95%] sm:max-w-[85%] md:max-w-[80%] ${
        isUser ? 'self-end' : ''
      }`}
    >
      <div
        className={`w-8 h-8 md:w-9 md:h-9 rounded-full flex items-center justify-center text-xs md:text-sm font-bold flex-shrink-0 ${
          isUser
            ? 'bg-secondary text-white'
            : 'bg-gradient-to-br from-primary to-primary-dark text-white'
        }`}
      >
        {isUser ? 'JS' : 'B'}
      </div>

      <div className="flex flex-col gap-1 min-w-0 flex-1">
        {message.images && message.images.length > 0 && (
          <div className={`flex flex-wrap gap-2 ${isUser ? 'justify-end' : 'justify-start'}`}>
            {message.images.map((imageUrl, index) => (
              <img
                key={index}
                src={imageUrl}
                alt={`Imagen ${index + 1}`}
                className="max-w-[200px] max-h-[200px] rounded-lg object-cover border-2 border-gray-200"
              />
            ))}
          </div>
        )}

        <div
          className={`px-3 py-2 md:px-4 md:py-3 rounded-xl text-xs sm:text-sm leading-relaxed break-words ${
            isUser
              ? 'bg-primary text-white rounded-br-sm'
              : 'bg-gray-100 text-gray-800 rounded-bl-sm'
          }`}
        >
          <MarkdownRenderer content={message.client_response || message.content} isUser={isUser} />
        </div>

        {message.ui_data ? renderUIData() : (
          <>
            {renderCard()}
            {renderMCPData()}
          </>
        )}

        <div className={`text-xs text-gray-500 px-1 ${isUser ? 'text-right' : ''}`}>
          {message.timestamp.toLocaleTimeString('es-CO', {
            hour: '2-digit',
            minute: '2-digit',
          })}
        </div>
      </div>
    </div>
  );
};