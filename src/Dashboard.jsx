/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useState, useEffect, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Modal from 'react-modal';
import { Calendar, Views, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import FormEvent from './FormEvent';
import FormEventClone from './FormEventClone';
import Select from './components/Select';
import { deleteEvent } from './store/actions/events';
import { formatDateMonth } from './helpers/utils';
import * as dates from './helpers/dates';

import 'react-big-calendar/lib/css/react-big-calendar.css';

const customModalStyles = {
  overlay: {
    backgroundColor: 'black',
  },
  content: {
    backgroundColor: '#333',
    color: '#ddd',
  },
};

const allViews = Object.keys(Views).map((k) => Views[k]);

const localizer = momentLocalizer(moment);

const ColoredDateCellWrapper = ({ children }) =>
  React.cloneElement(React.Children.only(children), {
    style: {
      backgroundColor: 'lightblue',
    },
  });

const stripEventId = ({ id, ...event }) => event;

const mapEventToBigCalendar = ({
  id,
  name: title,
  summary: desc,
  fullDay: allDay,
  date,
  startTime,
  endTime,
}) => ({
  id,
  desc,
  title,
  allDay,
  start: new Date(`${date} ${startTime}`),
  end: new Date(`${date} ${endTime}`),
});

export default function Dashboard() {
  const [editingEvent, setEditingEvent] = useState(null);
  const [cloningEvent, setCloningEvent] = useState(null);
  const [eventSummaryFilter, setEventSummaryFilter] = useState('');
  const [customerFilter, setCustomerFilter] = useState('');
  const [eventMonthFilter, setEventMonthFilter] = useState('');
  const {
    repo: { dir },
    events,
    customers,
  } = useSelector((state) => ({
    repo: state.repo,
    events: state.events,
    customers: state.customers,
  }));
  const calendarEvents = useMemo(
    () => events.map(mapEventToBigCalendar),
    [events],
  );
  const eventSummaryOptions = useMemo(
    () =>
      events.reduce(
        (carry, { summary }) =>
          carry.find((it) => it.id === summary)
            ? carry
            : [...carry, { id: summary, name: summary }],
        [],
      ),
    [events],
  );
  const eventMonthOptions = useMemo(
    () =>
      events.reduce(
        (carry, { date }) =>
          carry.find((it) => it.id === date.substr(0, 7))
            ? carry
            : [
                ...carry,
                { id: date.substr(0, 7), name: formatDateMonth(date) },
              ],
        [],
      ),
    [events],
  );
  const filteredEvents = useMemo(
    () =>
      events
        .filter((e) => !eventSummaryFilter || e.summary === eventSummaryFilter)
        .filter(
          (e) => !eventMonthFilter || e.date.substr(0, 7) === eventMonthFilter,
        )
        .filter((e) => !customerFilter || e.customerId === customerFilter),
    [events, eventSummaryFilter, eventMonthFilter, customerFilter],
  );
  const computeDuration = () => 3.5;
  const reducedEvents = useMemo(
    () =>
      filteredEvents
        .reduce((carry, evt) => {
          const evtInCarry = carry.find((e) => e.summary === evt.summary);
          if (!evtInCarry) {
            return [
              ...carry,
              {
                summary: evt.summary,
                code: evt.code,
                total: computeDuration(evt),
              },
            ];
          }
          const nextTotal = evtInCarry.total + computeDuration(evt);
          return carry.map((e) =>
            e.summary === evt.summary ? { ...e, total: nextTotal } : e,
          );
        }, [])
        .sort((e1, e2) => {
          if (e1.summary < e2.summary) return -1;
          if (e1.summary > e2.summary) return 1;
          return 0;
        }),
    [filteredEvents],
  );
  const dispatch = useDispatch();

  const onDeleteEvent = (eventId) => dispatch(deleteEvent(dir, eventId));

  return (
    <main>
      <Calendar
        events={calendarEvents}
        views={allViews}
        step={60}
        showMultiDayTimes
        max={dates.add(dates.endOf(new Date(2021, 19, 1), 'day'), -1, 'hours')}
        defaultDate={new Date(2021, 7, 1)}
        components={{
          timeSlotWrapper: ColoredDateCellWrapper,
        }}
        localizer={localizer}
      />

      <h3>Events</h3>
      <Select
        // id, name, label, options, value, onChange
        id="filter-by-customer"
        name="customer"
        label="Filter by customer"
        options={customers}
        value={customerFilter}
        onChange={(e) => setCustomerFilter(e.target.value)}
      />
      <Select
        // id, name, label, options, value, onChange
        id="filter-by-summary"
        name="event-summary"
        label="Filter by event summary"
        options={eventSummaryOptions}
        value={eventSummaryFilter}
        onChange={(e) => setEventSummaryFilter(e.target.value)}
      />
      <Select
        // id, name, label, options, value, onChange
        id="filter-by-month"
        name="event-month"
        label="Filter by month"
        options={eventMonthOptions}
        value={eventMonthFilter}
        onChange={(e) => setEventMonthFilter(e.target.value)}
      />

      <table>
        {reducedEvents.map(({ code, summary, total }) => (
          <tr key={summary}>
            <td>{code}</td>
            <td>{summary}</td>
            <td>{total}</td>
          </tr>
        ))}
      </table>

      <ul>
        {(filteredEvents || []).map((item) => (
          <li key={item.id}>
            {item.date} {item.code} {item.startTime}-{item.endTime}{' '}
            {item.summary}{' '}
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
