import React from "react";

function Calendar() {
  const today = new Date();
  const currentDay = today.getDate();
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

  const weeks = [];
  let week = new Array(7).fill(null);
  let dayCounter = 1;

  for (let i = 0; i < 7; i++) {
    if (i === firstDayOfMonth) {
      week[i] = dayCounter++;
    }
  }
  for (let i = firstDayOfMonth + 1; i < 7 && dayCounter <= daysInMonth; i++) {
    week[i] = dayCounter++;
  }
  weeks.push(week);

  while (dayCounter <= daysInMonth) {
    week = new Array(7).fill(null);
    for (let i = 0; i < 7 && dayCounter <= daysInMonth; i++) {
      week[i] = dayCounter++;
    }
    weeks.push(week);
  }

  return (
    <div className="p-3 mb-4 bg-green rounded shadow-sm">
      <h5 className="mb-3 fw-bold">
        Calendar
      </h5>
      <span><em>Tháng {currentMonth + 1}/{currentYear}</em></span>
      <table className="table table-sm table-bordered text-center">
        <thead>
          <tr>
            <th>S</th>
            <th>M</th>
            <th>T</th>
            <th>W</th>
            <th>T</th>
            <th>F</th>
            <th>S</th>
          </tr>
        </thead>
        <tbody>
          {weeks.map((w, wi) => (
            <tr key={wi}>
              {w.map((d, di) => (
                <td
                  key={di}
                  className={d === currentDay ? "bg-primary text-white fw-bold" : ""}
                >
                  {d || ""}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Calendar;
