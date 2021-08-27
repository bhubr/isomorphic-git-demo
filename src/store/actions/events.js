import Papa from 'papaparse';
import { readFile, writeFile } from '../../helpers/fs';
import { addCommitPush } from '../../helpers/git';
import { generateId, sortEventByDateFn } from '../../helpers/utils';
import { TYPE_EVENT } from '../../constants';

export const EVENTS_POPULATE = 'EVENTS_POPULATE';
export const EVENTS_CREATE_SUCCESS = 'EVENTS_CREATE_SUCCESS';
export const EVENTS_UPDATE_SUCCESS = 'EVENTS_UPDATE_SUCCESS';
export const EVENTS_DELETE_SUCCESS = 'EVENTS_DELETE_SUCCESS';

const eventsPopulateAction = (events) => ({
  type: EVENTS_POPULATE,
  events,
});

export const readEvents = (dir) => async (dispatch) => {
  const calendarCsv = await readFile(dir, 'calendar.csv');
  const { data: events, ...rest } = Papa.parse(calendarCsv, { header: true });
  console.log('csv parse', calendarCsv, events, rest);
  dispatch(eventsPopulateAction(events));
};

const eventsCreateAction = (event) => ({
  type: EVENTS_CREATE_SUCCESS,
  event,
});

const eventsUpdateAction = (event) => ({
  type: EVENTS_UPDATE_SUCCESS,
  event,
});

const eventsDeleteAction = (event) => ({
  type: EVENTS_DELETE_SUCCESS,
  event,
});

const writeEvents = async ({ dir, auth, events, message }) => {
  const eventsCSV = Papa.unparse(events, {
    columns: [
      'date',
      'startTime',
      'endTime',
      'summary',
      'name',
      'code',
      'id',
      'fullDay',
      'customerId',
      'groupId',
    ],
  });

  console.log(dir, auth, events, message, eventsCSV);

  await writeFile(dir, 'calendar.csv', eventsCSV);
  await addCommitPush({
    dir,
    filepath: 'calendar.csv',
    accessToken: auth.token,
    message,
    author: auth.user,
  });
};

const makeSummary = (data, customers) => {
  const { customerId, groupId } = data;
  const cust = customers.find((c) => c.id === customerId);
  const grp = cust.groups.find((g) => g.id === groupId);
  return `${cust.name} - ${grp.name} - ${data.name}`;
};

export const createEvent = (dir, data) => async (dispatch, getState) => {
  const { customers, events, auth } = getState();
  const newEvent = {
    id: generateId(TYPE_EVENT),
    ...data,
  };
  const nextEvents = [...events, newEvent].sort(sortEventByDateFn);

  const customer = customers.find((c) => c.id === newEvent.customerId);
  const group = customer.groups.find((g) => g.id === newEvent.groupId);

  await writeEvents({
    dir,
    auth,
    events: nextEvents.map((evt) => ({
      ...evt,
      summary: makeSummary(evt, customers),
    })),
    message: `[event] create event "${newEvent.name}" (${customer.name}/${group.name})`,
  });

  dispatch(eventsCreateAction(newEvent));
};

export const updateEvent =
  (dir, { id, ...rest }) =>
  async (dispatch, getState) => {
    const { customers, events, auth } = getState();
    const existingEvent = events.find((e) => e.id === id);
    const updatedEvent = { id, ...rest };
    const nextEvents = events
      .map((e) => (e.id === id ? updatedEvent : e))
      .sort(sortEventByDateFn);

    const customer = customers.find((c) => c.id === updatedEvent.customerId);
    const group = customer.groups.find((g) => g.id === updatedEvent.groupId);

    await writeEvents({
      dir,
      auth,
      events: nextEvents.map((evt) => ({
        ...evt,
        summary: makeSummary(evt, customers),
      })),
      message: `[event] update event "${updatedEvent.name}" (${customer.name}/${group.name})`,
    });

    dispatch(eventsUpdateAction(updatedEvent));
  };

/**
 * Delete an event
 *
 * @param {string} dir
 * @param {string} eventId
 * @returns
 */
export const deleteEvent = (dir, eventId) => async (dispatch, getState) => {
  const { customers, events, auth } = getState();
  const deletedEvent = events.find((e) => e.id === eventId);
  const nextEvents = events.filter((e) => e.id !== eventId);
  const customer = customers.find((c) => c.id === deletedEvent.customerId);
  const group = customer.groups.find((g) => g.id === deletedEvent.groupId);

  await writeEvents({
    dir,
    auth,
    events: nextEvents.map((evt) => ({
      ...evt,
      summary: makeSummary(evt, customers),
    })),
    message: `[event] delete event "${deletedEvent.name}" (${customer.name}/${group.name})`,
  });

  dispatch(eventsDeleteAction(deletedEvent));
};
