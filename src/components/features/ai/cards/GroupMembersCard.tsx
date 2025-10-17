import React from 'react';
import type { GroupMembersCardData } from '@/types/ai.types';

interface GroupMembersCardProps {
  data: GroupMembersCardData;
}

export const GroupMembersCard: React.FC<GroupMembersCardProps> = ({ data }) => {
  if (!data.miembros || data.miembros.length === 0) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Miembros del Grupo</h3>
        <div className="text-center py-4">
          <div className="text-gray-500 mb-2">No hay miembros en el grupo</div>
          <div className="text-sm text-gray-400">Invita miembros para comenzar a colaborar</div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
            <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900">Miembros del Grupo</h3>
        </div>
        <span className="text-sm text-gray-500">{data.total} miembros</span>
      </div>
      
      <div className="space-y-3">
        {data.miembros.map((member) => (
          <div key={member.id} className="p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-sm font-medium text-blue-600">
                  {member.full_name.split(' ').map(n => n[0]).join('').toUpperCase()}
                </span>
              </div>
              
              <div className="flex-1">
                <h4 className="font-medium text-gray-900">{member.full_name}</h4>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <span>{member.email}</span>
                </div>
              </div>
              
              <div className="text-right">
                <div className="text-xs text-gray-500">ID: {member.id.slice(-8)}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
