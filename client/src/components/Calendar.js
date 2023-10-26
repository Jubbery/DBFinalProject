import React from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid"; // a plugin!

// https://fullcalendar.io/docs/react

export default class Calendar extends React.Component {
  render() {
    return (
      <FullCalendar
        plugins={[dayGridPlugin]}
        initialView="dayGridMonth"
        events={[
          { title: "event 1", date: "2023-10-23" },
          { title: "event 2", date: "2023-10-24" },
        ]}
        eventContent={renderEventContent}
        eventClick={this.handleDateClick}
        selectAllow="true"
      />
    );
  }
  handleDateClick = (arg) => {
    // bind with an arrow function
    console.log(arg.view.getCurrentData());
  };
}

function renderEventContent(eventInfo) {
  return (
    <>
      <b>{eventInfo.timeText}</b>
      <i>{eventInfo.event.title}</i>
    </>
  );
}
