import React from 'react';
import type { SummaryCard as SummaryCardType } from '@/types/finance.types';

interface SummaryCardProps {
  data: SummaryCardType;
}

export const SummaryCard: React.FC<SummaryCardProps> = ({ data }) => {
  const getValueColor = () => {
    switch (data.type) {
      case 'income':
        return 'text-green-500';
      case 'expense':
        return 'text-red-500';
      case 'balance':
      case 'savings':
        return 'text-primary';
      default:
        return 'text-gray-900';
    }
  };

  const getChangeColor = () => {
    switch (data.changeType) {
      case 'positive':
        return 'text-green-500';
      case 'negative':
        return 'text-red-500';
      default:
        return 'text-gray-500';
    }
  };

  const getIconBg = () => {
    switch (data.type) {
      case 'income':
        return 'bg-green-100';
      case 'expense':
        return 'bg-red-100';
      case 'balance':
        return 'bg-orange-100';
      case 'savings':
        return 'bg-blue-100';
      default:
        return 'bg-gray-100';
    }
  };

  const formatValue = (value: number) => {
    const sign = data.type === 'expense' ? '-' : data.type === 'income' ? '+' : '';
    return `${sign}$${Math.abs(value).toLocaleString()}`;
  };

  const formatChange = (change: number) => {
    const sign = change > 0 ? '+' : '';
    return `${sign}${change}%`;
  };

  return (
    <div className="bg-white p-4 md:p-5 rounded-xl shadow-sm border border-gray-100">
      <div className={`w-10 h-10 ${getIconBg()} rounded-lg flex items-center justify-center mb-3`}>
        <span className="text-lg">{data.icon}</span>
      </div>
      
      <div className={`text-xl md:text-2xl font-bold mb-1 ${getValueColor()}`}>
        {formatValue(data.value)}
      </div>
      
      <div className="text-sm text-gray-600 mb-2">
        {data.title}
      </div>
      
      <div className={`text-xs flex items-center gap-1 ${getChangeColor()}`}>
        {data.changeType === 'positive' && (
          <svg className="w-3 h-3" viewBox="0 0 12 12" fill="currentColor">
            <path d="M6 2l4 4H7v4H5V6H2z"/>
          </svg>
        )}
        {data.changeType === 'negative' && (
          <svg className="w-3 h-3" viewBox="0 0 12 12" fill="currentColor">
            <path d="M6 10l4-4H7V2H5v4H2z"/>
          </svg>
        )}
        {data.changeType === 'neutral' ? 'Meta: $500' : `${formatChange(data.change)} vs mes anterior`}
      </div>
    </div>
  );
};
