import Papa from 'papaparse';
import { readFile, writeFile } from '../../helpers/fs';
import { add, addCommitPush } from '../../helpers/git';
import { generateId } from '../../helpers/utils';
import {
  sortEventByDateFn,
  makeSummary,
  makeMarkdown,
} from '../../helpers/events';
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
  const { data: events, ...rest } = Papa.parse(calendarCsv.trim(), {
    header: true,
  });
  const sanitizedEvents = events.map(({ fullDay, ...evt }) => ({
    ...evt,
    fullDay: fullDay === 'true',
  }));
  console.log('csv parse', calendarCsv, events, rest);
  dispatch(eventsPopulateAction(sanitizedEvents));
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

  await writeFile(dir, 'calendar.csv', `${eventsCSV}\n`);
  await addCommitPush({
    dir,
    filepath: 'calendar.csv',
    accessToken: auth.token,
    message,
    author: auth.user,
  });
};

const writeMarkdown = async ({ dir, md }) => {
  await writeFile(dir, 'calendar.md', md);
  await add({ dir, filepath: 'calendar.md' });
};

export const createEvent = (dir, data) => async (dispatch, getState) => {
  const { customers, events, auth } = getState();
  const newEvent = {
    id: generateId(TYPE_EVENT),
    ...data,
  };
  const nextEvents = [...events, newEvent].sort(sortEventByDateFn);
  const eventsWithSummary = nextEvents.map((evt) => ({
    ...evt,
    summary: makeSummary(evt, customers),
  }));

  const md = makeMarkdown(customers, eventsWithSummary);
  await writeMarkdown({ dir, md });

  const customer = customers.find((c) => c.id === newEvent.customerId);
  const group = customer.groups.find((g) => g.id === newEvent.groupId);

  await writeEvents({
    dir,
    auth,
    events: eventsWithSummary,
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

    const eventsWithSummary = nextEvents.map((evt) => ({
      ...evt,
      summary: makeSummary(evt, customers),
    }));

    const md = makeMarkdown(customers, eventsWithSummary);
    await writeMarkdown({ dir, md });

    const customer = customers.find((c) => c.id === updatedEvent.customerId);
    const group = customer.groups.find((g) => g.id === updatedEvent.groupId);

    await writeEvents({
      dir,
      auth,
      events: eventsWithSummary,
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
  const eventsWithSummary = nextEvents.map((evt) => ({
    ...evt,
    summary: makeSummary(evt, customers),
  }));

  const md = makeMarkdown(customers, eventsWithSummary);
  await writeMarkdown({ dir, md });

  const customer = customers.find((c) => c.id === deletedEvent.customerId);
  const group = customer.groups.find((g) => g.id === deletedEvent.groupId);

  await writeEvents({
    dir,
    auth,
    events: eventsWithSummary,
    message: `[event] delete event "${deletedEvent.name}" (${customer.name}/${group.name})`,
  });

  dispatch(eventsDeleteAction(deletedEvent));
};
