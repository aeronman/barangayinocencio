import React from "react";
import "react-calendar/dist/Calendar.css";
import Calendar from "react-calendar";
import "../../css/react_calendar.css";

function CustomCalendar({
  hasPastDates = true,
  onChange,
  value,
  eventDates = [],
}) {
  const formatDate = (date) => date.toLocaleDateString("en-CA");

  const renderTileContent = ({ date, view }) => {
    if (view !== "month") return null;

    const dateString = formatDate(date);
    const hasEvent = eventDates.includes(dateString);

    return hasEvent ? (
      <div
        style={{
          position: "relative",
          width: "100%",
          height: "100%",
        }}
        aria-hidden="true"
      >
        <span
          style={{
            position: "absolute",
            bottom: 4,
            left: "50%",
            transform: "translateX(-50%)",
            width: "6px",
            height: "6px",
            backgroundColor: "#0d6efd",
            borderRadius: "50%",
            pointerEvents: "none",
          }}
        />
      </div>
    ) : null;
  };

  const disablePastDates = ({ date, view }) => {
    if (view !== "month") return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
  };

  return (
    <Calendar
      onChange={onChange}
      value={value}
      tileContent={renderTileContent}
      tileDisabled={hasPastDates ? undefined : disablePastDates}
      className="react-calendar border-0 rounded-4 shadow-sm"
    />
  );
}

export default CustomCalendar;
