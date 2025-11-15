import React from 'react';

export interface FamilyAvailability {
  id: string;
  name: string;
  initials: string;
  status: 'available' | 'busy' | 'unavailable';
  statusText: string;
}

interface AvailabilityProps {
  members: FamilyAvailability[];
}

const statusColors = {
  available: 'bg-green-500',
  busy: 'bg-orange-500',
  unavailable: 'bg-gray-400',
};

export const Availability: React.FC<AvailabilityProps> = ({ members }) => {
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mb-6">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-2xl">👥</span>
        <h3 className="text-lg font-bold text-gray-900">Disponibilidad Hoy</h3>
      </div>

      <div className="space-y-3">
        {members.map((member) => (
          <div key={member.id} className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-orange-500 text-white flex items-center justify-center text-sm font-medium">
              {member.initials}
            </div>
            <div className="flex-1">
              <div className="font-medium text-gray-900">{member.name}</div>
              <div className="flex items-center gap-1 text-sm text-gray-600">
                <span className={`w-2 h-2 rounded-full ${statusColors[member.status]}`}></span>
                <span>{member.statusText}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
