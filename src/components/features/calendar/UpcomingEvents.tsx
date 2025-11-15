import React from 'react';
import { Clock, MapPin } from 'lucide-react';
import { format, isToday, isTomorrow, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';

export interface UpcomingEvent {
  id: string;
  title: string;
  date: string;
  time: string;
  location?: string;
  category: string;
  color: string;
  participants?: string[];
}

interface UpcomingEventsProps {
  events: UpcomingEvent[];
  onEventClick?: (event: UpcomingEvent) => void;
}

export const UpcomingEvents: React.FC<UpcomingEventsProps> = ({
  events,
  onEventClick,
}) => {
  const formatDate = (dateString: string) => {
    const date = parseISO(dateString);

    if (isToday(date)) return 'Hoy';
    if (isTomorrow(date)) return 'Mañana';

    return format(date, 'd MMM', { locale: es });
  };

  const getCategoryIcon = (category: string) => {
    const icons: Record<string, string> = {
      Médico: '🏥',
      Cumpleaños: '🎂',
      Familiar: '👨‍👩‍👧‍👦',
      Trabajo: '💼',
      Escolar: '📚',
    };
    return icons[category] || '📅';
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mb-6">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-2xl">📋</span>
        <h3 className="text-lg font-bold text-gray-900">Próximos Eventos</h3>
      </div>

      <div className="space-y-3">
        {events.length === 0 ? (
          <p className="text-gray-500 text-sm text-center py-4">
            No hay eventos próximos
          </p>
        ) : (
          events.map((event) => (
            <div
              key={event.id}
              className="p-3 rounded-lg border hover:shadow-sm transition-shadow cursor-pointer"
              style={{ borderLeftWidth: '4px', borderLeftColor: event.color }}
              onClick={() => onEventClick?.(event)}
            >
              <div className="flex items-start gap-3">
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center text-xl flex-shrink-0"
                  style={{ backgroundColor: `${event.color}20` }}
                >
                  {getCategoryIcon(event.category)}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-gray-900 text-sm mb-1">
                    {event.title}
                  </h4>
                  <div className="flex flex-wrap items-center gap-2 text-xs text-gray-600">
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span>{event.time}</span>
                    </div>
                    <span className="text-gray-400">•</span>
                    <span>{formatDate(event.date)}</span>
                    {event.location && (
                      <>
                        <span className="text-gray-400">•</span>
                        <div className="flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          <span>{event.location}</span>
                        </div>
                      </>
                    )}
                  </div>
                  {event.participants && event.participants.length > 0 && (
                    <div className="flex items-center gap-1 mt-2">
                      {event.participants.slice(0, 3).map((participant, idx) => (
                        <div
                          key={idx}
                          className="w-6 h-6 rounded-full bg-orange-500 text-white flex items-center justify-center text-xs font-medium"
                          title={participant}
                        >
                          {participant.charAt(0)}
                        </div>
                      ))}
                      {event.participants.length > 3 && (
                        <div className="w-6 h-6 rounded-full bg-gray-200 text-gray-600 flex items-center justify-center text-xs font-medium">
                          +{event.participants.length - 3}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
