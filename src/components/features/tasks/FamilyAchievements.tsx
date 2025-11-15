import React from 'react';

interface AchievementData {
  totalPoints: number;
  topPerformer: {
    name: string;
    initials: string;
    tasksCompleted: number;
    totalTasks: number;
  };
}

interface FamilyAchievementsProps {
  data: AchievementData;
}

export const FamilyAchievements: React.FC<FamilyAchievementsProps> = ({ data }) => {
  return (
    <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl p-6 shadow-lg text-white">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-2xl">🏆</span>
        <h3 className="text-lg font-bold">Logros Familiares</h3>
      </div>

      <div className="text-center mb-6">
        <div className="text-5xl font-bold mb-2">
          {data.totalPoints.toLocaleString()}
        </div>
        <div className="text-orange-100 text-sm">Puntos totales</div>
      </div>

      <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4">
        <div className="text-sm font-medium mb-2 text-orange-100">
          Familiar más productivo
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-white text-orange-500 flex items-center justify-center text-sm font-bold">
              {data.topPerformer.initials}
            </div>
            <span className="font-semibold">{data.topPerformer.name}</span>
          </div>
          <div className="text-lg font-bold">
            {data.topPerformer.tasksCompleted}/{data.topPerformer.totalTasks}
          </div>
        </div>
      </div>
    </div>
  );
};
