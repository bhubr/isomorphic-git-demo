/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import FormEvent from './FormEvent';
import { deleteEvent } from './store/actions/events';

export default function Dashboard() {
  const [editingEvent, setEditingEvent] = useState(null);

  const { repo: { dir }, events } = useSelector((state) => ({
    repo: state.repo,
    events: state.events,
  }));
  const dispatch = useDispatch();

  const onDeleteEvent = (eventId) => dispatch(deleteEvent(dir, eventId));

  return (
    <main>

      <h3>Events</h3>
      <ul>
        {(events || []).map((item) => (
          <li key={item.id}>
            {item.date} {item.startTime}-{item.endTime} {item.summary}{' '}
            <button type="button" onClick={() => setEditingEvent(item)}>
              edit
            </button>{' '}
            <button type="button" onClick={() => onDeleteEvent(item.id)}>
              x
            </button>
          </li>
        ))}
      </ul>
      
      <FormEvent
        dir={dir}
        event={editingEvent}
        onCancel={() => setEditingEvent(null)}
      />
    </main>
  );
}
