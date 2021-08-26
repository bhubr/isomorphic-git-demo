import Papa from 'papaparse';
import { readFile, writeFile } from '../../helpers/fs';
import { addCommitPush } from '../../helpers/git';
import { generateId } from '../../helpers/utils';
import { TYPE_EVENT } from '../../constants';

export const EVENTS_POPULATE = 'EVENTS_POPULATE';
export const EVENTS_CREATE_SUCCESS = 'EVENTS_CREATE_SUCCESS';

const eventsPopulateAction = (events) => ({
  type: EVENTS_POPULATE,
  events,
});

export const readEvents = (dir) => async (dispatch) => {
  const calendarCsv = await readFile(dir, 'calendar.csv');
  const { data: events } = Papa.parse(calendarCsv);
  console.log('csv parse', calendarCsv, events);
  dispatch(eventsPopulateAction(events));
};

const eventsCreateAction = (event) => ({
  type: EVENTS_CREATE_SUCCESS,
  event,
});

export const createEvent = (dir, data) => (dispatch, getState) => {
  const { customers, events } = getState();
  const newEvent = {
    id: generateId(TYPE_EVENT),
    ...data,
  };
  console.log(newEvent);
  const nextEvents = [...events, newEvent];
  console.log(Papa.unparse(nextEvents));

  dispatch(eventsCreateAction(newEvent));
};
