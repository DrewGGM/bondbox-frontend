import React from 'react';

export interface CalendarEvent {
  id: string;
  title: string;
  date: string;
  time?: string;
  category: string;
  color: string;
}

interface CalendarGridProps {
  currentDate: Date;
  events: CalendarEvent[];
  onDateClick?: (date: Date) => void;
  onEventClick?: (event: CalendarEvent) => void;
}

export const CalendarGrid: React.FC<CalendarGridProps> = ({
  currentDate,
  events,
  onDateClick,
  onEventClick,
}) => {
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDayOfMonth = new Date(year, month, 1);
  const lastDayOfMonth = new Date(year, month + 1, 0);
  const startingDayOfWeek = firstDayOfMonth.getDay();
  const daysInMonth = lastDayOfMonth.getDate();

  const days = [];
  const dayNames = ['DOM', 'LUN', 'MAR', 'MIÉ', 'JUE', 'VIE', 'SÁB'];

  // Empty cells for days before the month starts
  for (let i = 0; i < startingDayOfWeek; i++) {
    days.push(<div key={`empty-${i}`} className="calendar-day empty"></div>);
  }

  // Days of the month
  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, month, day);
    const dateString = date.toISOString().split('T')[0];
    const dayEvents = events.filter((e) => e.date === dateString);
    const isToday =
      date.toDateString() === new Date().toDateString();

    days.push(
      <div
        key={day}
        className={`calendar-day ${isToday ? 'today' : ''}`}
        onClick={() => onDateClick?.(date)}
      >
        <div className="day-number">{day}</div>
        <div className="day-events">
          {dayEvents.map((event) => (
            <div
              key={event.id}
              className="event-pill"
              style={{ backgroundColor: event.color }}
              onClick={(e) => {
                e.stopPropagation();
                onEventClick?.(event);
              }}
            >
              {event.title}
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="calendar-grid-container">
      <div className="calendar-grid">
        {/* Day headers */}
        {dayNames.map((name) => (
          <div key={name} className="day-header">
            {name}
          </div>
        ))}
        {/* Calendar days */}
        {days}
      </div>
    </div>
  );
};
