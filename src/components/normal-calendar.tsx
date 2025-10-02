// src/components/normal-calendar.tsx
"use client";

import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { useState, useEffect } from "react";

interface EventData {
  id: number;
  title: string;
  description?: string;
  start: string;
  end?: string;
}

interface NormalCalendarProps {
  userId: number;
}

export default function NormalCalendar({ userId }: NormalCalendarProps) {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [currentEvent, setCurrentEvent] = useState<EventData | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  // Charger les événements depuis l'API
  useEffect(() => {
    loadEvents();
  }, [userId]);

  const loadEvents = () => {
    setLoading(true);
    fetch(`/api/calendars/${userId}/events`)
      .then((res) => {
        if (!res.ok) throw new Error("Erreur de chargement");
        return res.json();
      })
      .then((data) => {
        const formattedEvents = data.map((event: any) => ({
          id: event.id,
          title: event.title,
          start: event.start,
          end: event.end,
          extendedProps: {
            description: event.description,
          },
        }));
        setEvents(formattedEvents);
      })
      .catch((err) => {
        console.error("Erreur lors du chargement des événements:", err);
      })
      .finally(() => setLoading(false));
  };

  // Ouvrir le modal pour créer un événement
  const handleDateClick = (info: any) => {
    setCurrentEvent({
      id: 0,
      title: "",
      description: "",
      start: info.dateStr,
      end: info.dateStr,
    });
    setIsEditing(false);
    setModalOpen(true);
  };

  // Ouvrir le modal pour éditer un événement
  const handleEventClick = (info: any) => {
    const event = info.event;
    setCurrentEvent({
      id: parseInt(event.id),
      title: event.title,
      description: event.extendedProps.description || "",
      start: formatForInput(event.startStr),
      end: formatForInput(event.endStr || event.startStr)
    });
    setIsEditing(true);
    setModalOpen(true);
  };

  // Sauvegarder (créer ou modifier)
  const handleSave = async () => {
    if (!currentEvent?.title) {
      alert("Le titre est requis");
      return;
    }

    try {
      if (isEditing) {
        const res = await fetch(`/api/events/${currentEvent.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: currentEvent.title,
            description: currentEvent.description,
            start: currentEvent.start,
            end: currentEvent.end,
          }),
        });

        if (res.ok) {
          loadEvents();
          setModalOpen(false);
        } else {
          alert("Erreur lors de la modification");
        }
      } else {
        const res = await fetch(`/api/calendars/${userId}/events`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: currentEvent.title,
            description: currentEvent.description,
            start: currentEvent.start,
            end: currentEvent.end,
          }),
        });

        if (res.ok) {
          loadEvents();
          setModalOpen(false);
        } else {
          alert("Erreur lors de la création");
        }
      }
    } catch (err) {
      console.error("Erreur:", err);
      alert("Erreur lors de la sauvegarde");
    }
  };

  // Supprimer un événement
  const handleDelete = async () => {
    if (!currentEvent?.id || !confirm("Supprimer cet événement ?")) return;

    try {
      const res = await fetch(`/api/events/${currentEvent.id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        loadEvents();
        setModalOpen(false);
      } else {
        alert("Erreur lors de la suppression");
      }
    } catch (err) {
      console.error("Erreur:", err);
      alert("Erreur lors de la suppression");
    }
  };

  // Formater pour input datetime-local
  const formatForInput = (date: Date | null) =>
    date ? new Date(date).toISOString().slice(0, 16) : "";

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
        dateClick={handleDateClick}
        eventClick={handleEventClick}
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
                    setCurrentEvent({ ...currentEvent!, title: e.target.value })
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
                    setCurrentEvent({
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
                      setCurrentEvent({ ...currentEvent!, start: e.target.value })
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
                      setCurrentEvent({ ...currentEvent!, end: e.target.value })
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
                      onClick={handleDelete}
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
                    onClick={() => setModalOpen(false)}
                  >
                    Annuler
                  </button>
                  <button 
                    className="btn btn-primary btn-sm"
                    onClick={handleSave}
                  >
                    {isEditing ? "Modifier" : "Créer"}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Fermer en cliquant à l'extérieur */}
          <div className="modal-backdrop" onClick={() => setModalOpen(false)}>
            <button>close</button>
          </div>
        </div>
      )}
    </div>
  );
}