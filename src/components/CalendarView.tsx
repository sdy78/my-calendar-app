"use client";

import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { useState, useEffect } from "react";

export default function CalendarView({ userId }: { userId: number }) {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Charger les événements depuis ton API
  useEffect(() => {
    setLoading(true);
    fetch(`/api/calendars/${userId}/events`)
      .then((res) => {
        if (!res.ok) throw new Error("Erreur de chargement");
        return res.json();
      })
      .then((data) => {
   //     console.log("Événements reçus:", data);
        
        // Transformer les événements au format FullCalendar
        const formattedEvents = data.map((event: any) => ({
          id: event.id,
          title: event.title,
          start: event.start || event.startDate,
          end: event.end || event.endDate,
          // Ajouter d'autres propriétés si nécessaire
          backgroundColor: event.color || undefined,
          borderColor: event.color || undefined,
        }));
        
      //  console.log("Événements formatés:", formattedEvents);
        setEvents(formattedEvents);
      })
      .catch((err) => {
        console.error("Erreur lors du chargement des événements:", err);
      })
      .finally(() => setLoading(false));
  }, [userId]);

  // Gestion de l'ajout d'événement
  const handleDateClick = async (info: any) => {
    const title = prompt("Titre de l'événement :");
    if (title) {
      const newEvent = {
        title,
        start: info.date.toISOString(),
        end: info.date.toISOString(),
      };

      try {
        const res = await fetch(`/api/calendars/${userId}/events`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newEvent),
        });

        if (res.ok) {
          const saved = await res.json();
          setEvents([...events, {
            id: saved.id,
            title: saved.title,
            start: saved.start || saved.startDate,
            end: saved.end || saved.endDate,
          }]);
        } else {
          console.error("Erreur lors de la création:", await res.text());
          alert("Erreur lors de la création de l'événement");
        }
      } catch (err) {
        console.error("Erreur:", err);
        alert("Erreur lors de la création de l'événement");
      }
    }
  };

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
        editable={true}
        headerToolbar={{
          left: "prev,next today",
          center: "title",
          right: "dayGridMonth,timeGridWeek,timeGridDay",
        }}
        locale="fr"
        eventDidMount={(info) => {
          //console.log("Événement rendu:", info.event);
        }}
      />
    </div>
  );
}