// src/components/multi-month-calendar.view.tsx
"use client";

import FullCalendar from "@fullcalendar/react";
import multiMonthPlugin from "@fullcalendar/multimonth";
import interactionPlugin from "@fullcalendar/interaction";
import { useState, useEffect } from "react";

interface MultiMonthCalendarProps {
  userId: number;
}

export default function MultiMonthCalendar({ userId }: MultiMonthCalendarProps) {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

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

  // Gérer le clic sur une date
  const handleDateClick = (info: any) => {
    console.log("Date cliquée:", info.dateStr);
    // Vous pouvez ouvrir un modal ici si besoin
    alert(`Date sélectionnée: ${info.dateStr}`);
  };

  // Gérer le clic sur un événement
  const handleEventClick = (info: any) => {
    const event = info.event;
    alert(`Événement: ${event.title}\nDate: ${event.startStr}`);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="flex flex-col items-center gap-4">
          <div className="loading loading-spinner loading-lg text-primary"></div>
          <p className="text-base-content/70">Chargement du calendrier annuel...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-base-100 rounded-2xl shadow-lg p-4">
      <FullCalendar
        plugins={[multiMonthPlugin, interactionPlugin]}
        initialView="multiMonthYear"
        events={events}
        dateClick={handleDateClick}
        eventClick={handleEventClick}
        editable={true}
        headerToolbar={{
          left: "prev,next today",
          center: "title",
          right: "multiMonthYear",
        }}
        locale="fr"
        height="auto"
        buttonText={{
          today: "Aujourd'hui",
          year: "Année",
        }}
        multiMonthMaxColumns={3} // 3 colonnes de 4 mois = 12 mois
        views={{
          multiMonthYear: {
            type: "multiMonth",
            duration: { years: 1 },
            multiMonthMaxColumns: 3,
          },
        }}
      />
    </div>
  );
}