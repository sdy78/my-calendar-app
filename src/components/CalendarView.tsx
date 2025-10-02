// src/components/CalendarView.tsx
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

export default function CalendarView({ userId }: { userId: number }) {
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
    console.log("event startSt", event.startStr);
    console.log("event endStr", event.endStr);
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
        // Mise à jour
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
        // Création
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
    return <div className="p-4">Chargement du calendrier...</div>;
  }

  return (
    <div className="p-4">
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
      />

      {/* Modal DaisyUI */}
      {modalOpen && (
        <div className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg mb-4">
              {isEditing ? "Modifier l'événement" : "Nouvel événement"}
            </h3>

            <div className="form-control mb-4">
              <label className="label">
                <span className="label-text">Titre *</span>
              </label>
              <input
                type="text"
                className="input input-bordered"
                value={currentEvent?.title || ""}
                onChange={(e) =>
                  setCurrentEvent({ ...currentEvent!, title: e.target.value })
                }
              />
            </div>

            <div className="form-control mb-4">
              <label className="label">
                <span className="label-text">Description</span>
              </label>
              <textarea
                className="textarea textarea-bordered h-24"
                value={currentEvent?.description || ""}
                onChange={(e) =>
                  setCurrentEvent({
                    ...currentEvent!,
                    description: e.target.value,
                  })
                }
              />
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Début</span>
                </label>
                <input
                  type="datetime-local"
                  className="input input-bordered"
                  value={currentEvent?.start || ""}
                  onChange={(e) =>
                    setCurrentEvent({ ...currentEvent!, start: e.target.value })
                  }
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text">Fin</span>
                </label>
                <input
                  type="datetime-local"
                  className="input input-bordered"
                  value={currentEvent?.end || ""}
                  onChange={(e) =>
                    setCurrentEvent({ ...currentEvent!, end: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="modal-action">
              {isEditing && (
                <button className="btn btn-error" onClick={handleDelete}>
                  Supprimer
                </button>
              )}
              <button className="btn" onClick={() => setModalOpen(false)}>
                Annuler
              </button>
              <button className="btn btn-primary" onClick={handleSave}>
                {isEditing ? "Modifier" : "Créer"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}