// src/components/calendar.view.tsx
"use client";

import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";

interface EventData {
  id: number;
  title: string;
  description?: string;
  start: string;
  end?: string;
}

interface CalendarViewProps {
  events: any[];
  loading: boolean;
  modalOpen: boolean;
  currentEvent: EventData | null;
  isEditing: boolean;
  onDateClick: (info: any) => void;
  onEventClick: (info: any) => void;
  onSave: () => void;
  onDelete: () => void;
  onCloseModal: () => void;
  onEventChange: (event: EventData) => void;
}

export default function CalendarView({
  events,
  loading,
  modalOpen,
  currentEvent,
  isEditing,
  onDateClick,
  onEventClick,
  onSave,
  onDelete,
  onCloseModal,
  onEventChange,
}: CalendarViewProps) {
  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="flex flex-col items-center gap-4">
          <div className="loading loading-spinner loading-lg text-primary"></div>
          <p className="text-base-content/70">Chargement du calendrier...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 bg-base-100 rounded-2xl shadow-lg">
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        events={events}
        dateClick={onDateClick}
        eventClick={onEventClick}
        editable={true}
        headerToolbar={{
          left: "prev,next today",
          center: "title",
          right: "dayGridMonth,timeGridWeek,timeGridDay",
        }}
        locale="fr"
        height="auto"
        buttonText={{
          today: "Aujourd'hui",
          month: "Mois",
          week: "Semaine",
          day: "Jour"
        }}
      />

      {/* Modal */}
      {modalOpen && (
        <div className="modal modal-open backdrop-blur-sm">
          <div className="modal-box max-w-md p-0 overflow-hidden shadow-2xl">
            {/* En-tête avec dégradé */}
            <div className="bg-gradient-to-r from-primary to-secondary p-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-bold text-lg text-white">
                    {isEditing ? "Modifier l'événement" : "Nouvel événement"}
                  </h3>
                </div>
              </div>
            </div>

            {/* Corps du modal */}
            <div className="p-4 space-y-4">
              {/* Titre */}
              <div className="form-control">
                <label className="label p-0 mb-1">
                  <span className="label-text font-semibold text-sm">Titre <span className="text-error">*</span></span>
                </label>
                <input
                  type="text"
                  className="input input-bordered input-sm w-full focus:input-primary"
                  placeholder="Titre de l'événement"
                  value={currentEvent?.title || ""}
                  onChange={(e) =>
                    onEventChange({ ...currentEvent!, title: e.target.value })
                  }
                />
              </div>

              {/* Description */}
              <div className="form-control">
                <label className="label p-0 mb-1">
                  <span className="label-text font-semibold text-sm">Description</span>
                </label>
                <textarea
                  className="textarea textarea-bordered w-full h-20 focus:textarea-primary resize-none text-sm"
                  placeholder="Description de l'événement (optionnel)"
                  value={currentEvent?.description || ""}
                  onChange={(e) =>
                    onEventChange({
                      ...currentEvent!,
                      description: e.target.value,
                    })
                  }
                />
              </div>

              {/* Dates */}
              <div className="grid grid-cols-1 gap-3">
                <div className="form-control">
                  <label className="label p-0 mb-1">
                    <span className="label-text font-semibold text-sm">Début</span>
                  </label>
                  <input
                    type="datetime-local"
                    className="input input-bordered input-sm w-full focus:input-primary"
                    value={currentEvent?.start || ""}
                    onChange={(e) =>
                      onEventChange({ ...currentEvent!, start: e.target.value })
                    }
                  />
                </div>

                <div className="form-control">
                  <label className="label p-0 mb-1">
                    <span className="label-text font-semibold text-sm">Fin</span>
                  </label>
                  <input
                    type="datetime-local"
                    className="input input-bordered input-sm w-full focus:input-primary"
                    value={currentEvent?.end || ""}
                    onChange={(e) =>
                      onEventChange({ ...currentEvent!, end: e.target.value })
                    }
                  />
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="modal-action p-4 bg-base-200 border-t border-base-300">
              <div className="flex flex-col sm:flex-row gap-2 w-full">
                <div className="flex gap-2 order-2 sm:order-1">
                  {isEditing && (
                    <button 
                      className="btn btn-error btn-outline btn-sm flex-1"
                      onClick={onDelete}
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                      Supprimer
                    </button>
                  )}
                </div>
                <div className="flex gap-2 order-1 sm:order-2 ml-auto">
                  <button 
                    className="btn btn-outline btn-sm"
                    onClick={onCloseModal}
                  >
                    Annuler
                  </button>
                  <button 
                    className="btn btn-primary btn-sm"
                    onClick={onSave}
                  >
                    {isEditing ? "Modifier" : "Créer"}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Fermer en cliquant à l'extérieur */}
          <div className="modal-backdrop" onClick={onCloseModal}>
            <button>close</button>
          </div>
        </div>
      )}
    </div>
  );
}