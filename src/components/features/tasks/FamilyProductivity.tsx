import React from 'react';

export interface FamilyMember {
  id: string;
  name: string;
  initials: string;
  tasksCompleted: number;
  totalTasks: number;
  avatar?: string;
}

interface FamilyProductivityProps {
  members: FamilyMember[];
}

export const FamilyProductivity: React.FC<FamilyProductivityProps> = ({ members }) => {
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mb-6">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-2xl">👥</span>
        <h3 className="text-lg font-bold text-gray-900">Productividad Familiar</h3>
      </div>

      <div className="space-y-4">
        {members.map((member) => {
          const percentage = member.totalTasks > 0
            ? Math.round((member.tasksCompleted / member.totalTasks) * 100)
            : 0;

          return (
            <div key={member.id}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-orange-500 text-white flex items-center justify-center text-sm font-medium">
                    {member.initials}
                  </div>
                  <span className="font-medium text-gray-900">{member.name}</span>
                </div>
                <span className="text-sm font-semibold text-gray-700">
                  {member.tasksCompleted}/{member.totalTasks}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-orange-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
