import { readFile, writeFile } from '../../helpers/fs';
import { addCommitPush } from '../../helpers/git';
import { generateId } from '../../helpers/utils';
import { TYPE_EVENT } from '../../constants';

export const EVENTS_CREATE_SUCCESS = 'EVENTS_CREATE_SUCCESS';

const eventsCreateAction = (event) => ({
  type: EVENTS_CREATE_SUCCESS,
  event,
})

export const createEvent = (dir, data) => (dispatch, getState) => {
  const { customers, events } = getState();
  const newEvent = {
    id: generateId(TYPE_EVENT),
    ...data,
  }
  console.log(newEvent)
  const nextEvents = [...events, newEvent];

  dispatch(eventsCreateAction(newEvent));
}