// src/components/calendar.container.tsx
"use client";

import { useState } from "react";
import MultiMonthCalendar from "./multi-month-calendar";
import NormalCalendar from "./normal-calendar";

interface CalendarContainerProps {
  userId: number;
}

type ViewType = "normal" | "multi-month";

export default function CalendarContainer({ userId }: CalendarContainerProps) {
  const [currentView, setCurrentView] = useState<ViewType>("normal");

  return (
    <div className="w-full">
      {/* Onglets */}
      <div className="tabs tabs-boxed bg-base-200 p-1 rounded-lg mb-4">
        <button
          className={`tab tab-lg ${currentView === "normal" ? "tab-active" : ""}`}
          onClick={() => setCurrentView("normal")}
        >
          📅 Vue Normale
        </button>
        <button
          className={`tab tab-lg ${currentView === "multi-month" ? "tab-active" : ""}`}
          onClick={() => setCurrentView("multi-month")}
        >
          📊 Vue Multi-Mois
        </button>
      </div>

      {/* Contenu selon l'onglet */}
      {currentView === "normal" ? (
        <NormalCalendar userId={userId} />
      ) : (
        <MultiMonthCalendar userId={userId} />
      )}
    </div>
  );
}