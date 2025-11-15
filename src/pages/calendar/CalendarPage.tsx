import React, { useState, useMemo, useCallback } from 'react';
import { Header } from '@/components/layout/Header';
import { Calendar, momentLocalizer, View, Event as BigCalendarEvent } from 'react-big-calendar';
import moment from 'moment';
import 'moment/locale/es';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import {
  UpcomingEvents,
  Availability,
  UpcomingEvent,
  FamilyAvailability,
} from '@/components/features/calendar';
import { Plus } from 'lucide-react';
import './calendar.css';
import { useTasks } from '@/hooks/useTasks';
import { useGroupStore } from '@/store/groupStore';
import { ErrorMessage } from '@/components/common/ErrorMessage';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';

// Configure moment to use Spanish locale
moment.locale('es');
const localizer = momentLocalizer(moment);

// Extended event interface for our calendar
interface CalendarEvent extends BigCalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  category: string;
  color: string;
  location?: string;
  participants?: string[];
  description?: string;
}

export const CalendarPage: React.FC = () => {
  const [view, setView] = useState<View>('month');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  console.log(selectedEvent)
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newEventData, setNewEventData] = useState<{ start?: Date; end?: Date }>({});

  const selectedGroup = useGroupStore((state) => state.selectedGroup);

  // Guard: No group selected
  if (!selectedGroup) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
            <p className="text-yellow-800 font-medium">
              No hay un grupo seleccionado
            </p>
            <p className="text-yellow-600 text-sm mt-2">
              Por favor selecciona un grupo desde el Dashboard para ver el calendario
            </p>
          </div>
        </main>
      </div>
    );
  }

  const groupId = selectedGroup.id;

  // Use tasks hook (includes calendar functionality)
  const {
    userEvents,
    groupMembers,
    loading,
    error,
    createEvent,
    clearError,
  } = useTasks(groupId);

  // Transform backend events to calendar format
  const events: CalendarEvent[] = useMemo(() => {
    // Map backend events to calendar format
    return userEvents.map((event) => {
      const eventDate = new Date(event.event_date);
      // Default 1 hour duration if not specified
      const endDate = new Date(eventDate);
      endDate.setHours(endDate.getHours() + 1);

      // Find user name from groupMembers
      const assignedUser = groupMembers.find(m => m.id === event.user_id);

      return {
        id: String(event.id),
        title: event.title,
        start: eventDate,
        end: endDate,
        category: 'Evento', // Default category
        color: '#8B5CF6', // Default color
        description: event.description,
        participants: assignedUser ? [assignedUser.full_name] : [],
      };
    });
  }, [userEvents, groupMembers]);

  // Keep some hardcoded events for demo purposes (remove when ready)
  const demoEvents: CalendarEvent[] = useMemo(() => {
    const baseDate = new Date(2025, 8, 1); // September 2025 (month is 0-indexed)

    return [
      {
        id: 'demo-1',
        title: 'Cena familiar dominguera',
        start: new Date(baseDate.getFullYear(), baseDate.getMonth(), 1, 19, 0),
        end: new Date(baseDate.getFullYear(), baseDate.getMonth(), 1, 21, 0),
        category: 'Familiar',
        color: '#10B981',
        location: 'Casa',
        participants: ['Juan', 'María', 'Pedro', 'Ana'],
      },
      {
        id: '2',
        title: 'Entrega proyecto ciencias',
        start: new Date(baseDate.getFullYear(), baseDate.getMonth(), 2, 8, 0),
        end: new Date(baseDate.getFullYear(), baseDate.getMonth(), 2, 9, 0),
        category: 'Escolar',
        color: '#8B5CF6',
        location: 'Escuela',
        participants: ['Pedro'],
      },
      {
        id: '3',
        title: 'Trabajo proyecto',
        start: new Date(baseDate.getFullYear(), baseDate.getMonth(), 3, 9, 0),
        end: new Date(baseDate.getFullYear(), baseDate.getMonth(), 3, 17, 0),
        category: 'Trabajo',
        color: '#F59E0B',
      },
      {
        id: '4',
        title: 'Semana azul',
        start: new Date(baseDate.getFullYear(), baseDate.getMonth(), 5, 0, 0),
        end: new Date(baseDate.getFullYear(), baseDate.getMonth(), 5, 23, 59),
        category: 'Escolar',
        color: '#60A5FA',
      },
      {
        id: '5',
        title: 'Vacuna gripe',
        start: new Date(baseDate.getFullYear(), baseDate.getMonth(), 6, 10, 0),
        end: new Date(baseDate.getFullYear(), baseDate.getMonth(), 6, 11, 0),
        category: 'Médico',
        color: '#EF4444',
        location: 'Hospital Central',
      },
      {
        id: '6',
        title: 'Reunión familiar',
        start: new Date(baseDate.getFullYear(), baseDate.getMonth(), 7, 16, 0),
        end: new Date(baseDate.getFullYear(), baseDate.getMonth(), 7, 18, 0),
        category: 'Familiar',
        color: '#10B981',
      },
      {
        id: '7',
        title: 'Entrega trabajo',
        start: new Date(baseDate.getFullYear(), baseDate.getMonth(), 9, 14, 0),
        end: new Date(baseDate.getFullYear(), baseDate.getMonth(), 9, 15, 0),
        category: 'Escolar',
        color: '#8B5CF6',
      },
      {
        id: '8',
        title: 'Cumpleaños Pedro - 15 años',
        start: new Date(baseDate.getFullYear(), baseDate.getMonth(), 11, 0, 0),
        end: new Date(baseDate.getFullYear(), baseDate.getMonth(), 11, 23, 59),
        category: 'Cumpleaños',
        color: '#EC4899',
        participants: ['Juan', 'María', 'Pedro', 'Ana'],
      },
      {
        id: '9',
        title: 'Revisión dental',
        start: new Date(baseDate.getFullYear(), baseDate.getMonth(), 13, 10, 35),
        end: new Date(baseDate.getFullYear(), baseDate.getMonth(), 13, 11, 35),
        category: 'Médico',
        color: '#EF4444',
        location: 'Clínica Dental',
      },
      {
        id: '10',
        title: 'Cena familiar',
        start: new Date(baseDate.getFullYear(), baseDate.getMonth(), 15, 19, 0),
        end: new Date(baseDate.getFullYear(), baseDate.getMonth(), 15, 21, 0),
        category: 'Familiar',
        color: '#10B981',
      },
      {
        id: '11',
        title: 'Vacuna refuerzo Ana',
        start: new Date(baseDate.getFullYear(), baseDate.getMonth(), 16, 10, 35),
        end: new Date(baseDate.getFullYear(), baseDate.getMonth(), 16, 11, 35),
        category: 'Médico',
        color: '#EF4444',
        location: 'Ana María',
        participants: ['Ana', 'María'],
      },
      {
        id: '12',
        title: 'Cita familiar',
        start: new Date(baseDate.getFullYear(), baseDate.getMonth(), 18, 16, 0),
        end: new Date(baseDate.getFullYear(), baseDate.getMonth(), 18, 18, 0),
        category: 'Familiar',
        color: '#10B981',
      },
      {
        id: '13',
        title: 'Entrega proyecto',
        start: new Date(baseDate.getFullYear(), baseDate.getMonth(), 20, 14, 0),
        end: new Date(baseDate.getFullYear(), baseDate.getMonth(), 20, 15, 0),
        category: 'Escolar',
        color: '#C084FC',
      },
      {
        id: '14',
        title: 'Revisión médica',
        start: new Date(baseDate.getFullYear(), baseDate.getMonth(), 23, 9, 0),
        end: new Date(baseDate.getFullYear(), baseDate.getMonth(), 23, 10, 0),
        category: 'Médico',
        color: '#60A5FA',
      },
      {
        id: '15',
        title: 'Aniversario',
        start: new Date(baseDate.getFullYear(), baseDate.getMonth(), 25, 0, 0),
        end: new Date(baseDate.getFullYear(), baseDate.getMonth(), 25, 23, 59),
        category: 'Cumpleaños',
        color: '#EC4899',
      },
      {
        id: '16',
        title: 'Cierre de mes',
        start: new Date(baseDate.getFullYear(), baseDate.getMonth(), 30, 17, 0),
        end: new Date(baseDate.getFullYear(), baseDate.getMonth(), 30, 18, 0),
        category: 'Trabajo',
        color: '#C084FC',
      },
    ];
  }, []);

  // Combine real events with demo events
  const allEvents = useMemo(() => {
    return [...events, ...demoEvents];
  }, [events, demoEvents]);

  // Upcoming events for sidebar
  const upcomingEvents: UpcomingEvent[] = useMemo(() => {
    const now = new Date();
    return allEvents
      .filter((event) => event.start >= now)
      .sort((a, b) => a.start.getTime() - b.start.getTime())
      .slice(0, 5)
      .map((event) => ({
        id: event.id,
        title: event.title,
        date: event.start.toISOString().split('T')[0],
        time: event.start.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }),
        location: event.location,
        category: event.category,
        color: event.color,
        participants: event.participants,
      }));
  }, [allEvents]);

  // Family availability from group members
  const availability: FamilyAvailability[] = useMemo(() => {
    return groupMembers.map((member) => {
      const nameParts = member.full_name.split(' ');
      const initials = nameParts.map(n => n[0]).join('').substring(0, 2).toUpperCase();

      return {
        id: member.id,
        name: member.full_name,
        initials,
        status: 'available' as const,
        statusText: 'Disponible',
      };
    });
  }, [groupMembers]);

  // Custom event style getter
  const eventStyleGetter = useCallback((event: CalendarEvent) => {
    return {
      style: {
        backgroundColor: event.color,
        borderRadius: '4px',
        opacity: 0.9,
        color: 'white',
        border: 'none',
        display: 'block',
        fontSize: '0.875rem',
        padding: '2px 5px',
      },
    };
  }, []);

  // Handlers
  const handleSelectEvent = useCallback((event: CalendarEvent) => {
    setSelectedEvent(event);
    console.log('Event selected:', event);
    // Open event details/edit modal
  }, []);

  const handleSelectSlot = useCallback(({ start, end }: { start: Date; end: Date }) => {
    setNewEventData({ start, end });
    setShowCreateModal(true);
  }, []);

  const handleNavigate = useCallback((newDate: Date) => {
    setCurrentDate(newDate);
  }, []);

  const handleViewChange = useCallback((newView: View) => {
    setView(newView);
  }, []);

  const handleQuickAdd = () => {
    setNewEventData({});
    setShowCreateModal(true);
  };

  const handleCreateEvent = async (eventData: {
    title: string;
    description?: string;
    date: string;
    user_id?: string;
  }) => {
    try {
      await createEvent(eventData);
      setShowCreateModal(false);
      setNewEventData({});
    } catch (err) {
      console.error('Error creating event:', err);
    }
  };

  const handleEventClick = (event: UpcomingEvent) => {
    console.log('Upcoming event clicked:', event);
    // Open event details modal
  };

  // Custom messages in Spanish
  const messages = {
    allDay: 'Todo el día',
    previous: 'Anterior',
    next: 'Siguiente',
    today: 'Hoy',
    month: 'Mes',
    week: 'Semana',
    day: 'Día',
    agenda: 'Agenda',
    date: 'Fecha',
    time: 'Hora',
    event: 'Evento',
    noEventsInRange: 'No hay eventos en este rango',
    showMore: (total: number) => `+ Ver más (${total})`,
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
        {/* Error Display */}
        {error && (
          <div className="mb-6">
            <ErrorMessage message={error} onDismiss={clearError} />
          </div>
        )}

        {/* Page Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Calendario</h1>
            <p className="text-gray-600 mt-1">Gestiona los eventos de tu familia</p>
          </div>
          <button
            onClick={handleQuickAdd}
            className="flex items-center gap-2 px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors font-medium shadow-sm"
          >
            <Plus className="w-5 h-5" />
            Crear Evento
          </button>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Calendar - Left Side (2 columns on large screens) */}
          <div className="lg:col-span-2">
            {loading ? (
              <div className="flex justify-center py-12">
                <LoadingSpinner />
              </div>
            ) : (
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <div className="calendar-wrapper">
                  <Calendar
                    localizer={localizer}
                    events={allEvents}
                  startAccessor="start"
                  endAccessor="end"
                  style={{ height: 600 }}
                  view={view}
                  onView={handleViewChange}
                  date={currentDate}
                  onNavigate={handleNavigate}
                  onSelectEvent={handleSelectEvent}
                  onSelectSlot={handleSelectSlot}
                  selectable
                  eventPropGetter={eventStyleGetter}
                  messages={messages}
                  views={['month', 'week', 'day']}
                  popup
                />
              </div>
            </div>
            )}
          </div>

          {/* Sidebar - Right Side (1 column on large screens) */}
          <div className="space-y-6">
            <UpcomingEvents events={upcomingEvents} onEventClick={handleEventClick} />
            <Availability members={availability} />

            {/* Quick Add Button */}
            <button
              onClick={handleQuickAdd}
              className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-br from-orange-500 to-orange-600 text-white rounded-xl hover:from-orange-600 hover:to-orange-700 transition-all shadow-lg font-medium"
            >
              <Plus className="w-5 h-5" />
              Agregar evento rápido
            </button>
          </div>
        </div>

        {/* Create Event Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
              <h3 className="text-xl font-bold mb-4">Crear Evento</h3>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const formData = new FormData(e.currentTarget);
                  handleCreateEvent({
                    title: formData.get('title') as string,
                    description: formData.get('description') as string,
                    date: formData.get('date') as string,
                    user_id: formData.get('user_id') as string || undefined,
                  });
                }}
              >
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Título *
                    </label>
                    <input
                      type="text"
                      name="title"
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Descripción
                    </label>
                    <textarea
                      name="description"
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Fecha y Hora *
                    </label>
                    <input
                      type="datetime-local"
                      name="date"
                      required
                      defaultValue={
                        newEventData.start
                          ? moment(newEventData.start).format('YYYY-MM-DDTHH:mm')
                          : ''
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Asignar a miembro (opcional)
                    </label>
                    <select
                      name="user_id"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    >
                      <option value="">Sin asignar</option>
                      {groupMembers.map((member) => (
                        <option key={member.id} value={member.id}>
                          {member.full_name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="flex gap-3 mt-6">
                  <button
                    type="button"
                    onClick={() => {
                      setShowCreateModal(false);
                      setNewEventData({});
                    }}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
                  >
                    Crear Evento
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
