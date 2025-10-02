// src/components/calendar.container.tsx
"use client";

import { useState, useEffect } from "react";
import CalendarView from "./calendar.view";

interface EventData {
  id: number;
  title: string;
  description?: string;
  start: string;
  end?: string;
}

interface CalendarContainerProps {
  userId: number;
}

export default function CalendarContainer({ userId }: CalendarContainerProps) {
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

  // Props à passer à la vue
  const viewProps = {
    events,
    loading,
    modalOpen,
    currentEvent,
    isEditing,
    onDateClick: handleDateClick,
    onEventClick: handleEventClick,
    onSave: handleSave,
    onDelete: handleDelete,
    onCloseModal: () => setModalOpen(false),
    onEventChange: setCurrentEvent,
  };

  return <CalendarView {...viewProps} />;
}