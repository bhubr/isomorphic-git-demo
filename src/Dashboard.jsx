/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Modal from 'react-modal';
import FormEvent from './FormEvent';
import FormEventClone from './FormEventClone';
import Select from './components/Select';
import { deleteEvent } from './store/actions/events';

const customModalStyles = {
  overlay: {
    backgroundColor: 'black',
  },
  content: {
    backgroundColor: '#333',
    color: '#ddd',
  },
};

const stripEventId = ({ id, ...event }) => event;

export default function Dashboard() {
  const [editingEvent, setEditingEvent] = useState(null);
  const [cloningEvent, setCloningEvent] = useState(null);
  const [eventOptions, setEventOptions] = useState([]);
  const [eventSummaryFilter, setEventSummaryFilter] = useState('');

  const {
    repo: { dir },
    events,
  } = useSelector((state) => ({
    repo: state.repo,
    events: state.events,
  }));
  const dispatch = useDispatch();

  useEffect(() => {
    const eventSumOptions = events.reduce(
      (carry, { summary }) =>
        carry.find((it) => it.id === summary)
          ? carry
          : [...carry, { id: summary, name: summary }],
      [],
    );
    setEventOptions(eventSumOptions);
  }, [events]);

  const onDeleteEvent = (eventId) => dispatch(deleteEvent(dir, eventId));

  return (
    <main>
      <h3>Events</h3>
      <Select
        // id, name, label, options, value, onChange
        id="filter-by-summary"
        name="event-summary"
        label="Filter by event summary"
        options={eventOptions}
        value={eventSummaryFilter}
        onChange={(e) => setEventSummaryFilter(e.target.value)}
      />
      <ul>
        {(
          events.filter(
            (e) => !eventSummaryFilter || e.summary === eventSummaryFilter,
          ) || []
        ).map((item) => (
          <li key={item.id}>
            {item.date} {item.startTime}-{item.endTime} {item.summary}{' '}
            <button type="button" onClick={() => setEditingEvent(item)}>
              edit
            </button>{' '}
            <button
              type="button"
              onClick={() => setCloningEvent(stripEventId(item))}
            >
              clone
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
      <Modal
        isOpen={!!cloningEvent}
        contentLabel={cloningEvent ? `Clone ${cloningEvent.name}` : ''}
        style={customModalStyles}
      >
        <h2>Clone event</h2>
        <button type="button" onClick={() => setCloningEvent(null)}>
          close
        </button>
        {cloningEvent && (
          <FormEventClone
            dir={dir}
            event={cloningEvent}
            onCancel={() => setCloningEvent(null)}
          />
        )}
      </Modal>
    </main>
  );
}
