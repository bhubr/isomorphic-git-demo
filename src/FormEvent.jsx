import React, { useState } from 'react';

export default function FormEvent({ onSubmit: onSubmitFn }) {
  const [customerName, setCustomerName] = useState('');
  const [groupName, setGroupName] = useState('');
  const [eventName, setEventName] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [fullDay, setFullDay] = useState(true);
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');

  const onSubmit = async (e) => {
    e.preventDefault();
    onSubmitFn({
      customerName,
      groupName,
      eventName,
      eventDate,
      fullDay,
      startTime,
      endTime,
    });
  };
  return (
    <>
      <h3>New event</h3>
      <form onSubmit={onSubmit}>
        <input
          type="text"
          name="customer"
          onChange={(e) => setCustomerName(e.target.value)}
          placeholder="Customer name"
          value={customerName}
          required
        />
        <input
          type="text"
          name="group"
          onChange={(e) => setGroupName(e.target.value)}
          placeholder="Group name"
          value={groupName}
          required
        />
        <input
          type="text"
          name="course"
          onChange={(e) => setEventName(e.target.value)}
          placeholder="Event name"
          value={eventName}
          required
        />
        <input
          type="date"
          name="date"
          onChange={(e) => setEventDate(e.target.value)}
          value={eventDate}
          required
        />
        <input
          type="checkbox"
          name="fullDay"
          checked={fullDay}
          onChange={(e) => setFullDay(e.target.checked)}
        />
        {!fullDay && (
          <>
            <input
              type="time"
              name="startTime"
              onChange={(e) => setStartTime(e.target.value)}
              value={startTime}
            />
            <input
              type="time"
              name="endTime"
              onChange={(e) => setEndTime(e.target.value)}
              value={endTime}
            />
          </>
        )}
        <button type="submit">new event</button>
      </form>
    </>
  );
}
