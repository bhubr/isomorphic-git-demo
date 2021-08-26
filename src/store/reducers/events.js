import { EVENTS_CREATE_SUCCESS, EVENTS_POPULATE } from '../actions/events';

export default function eventsReducer(state = [], action) {
  switch (action.type) {
    case EVENTS_POPULATE: {
      return action.events;
    }
    case EVENTS_CREATE_SUCCESS: {
      return [...state, action.event];
    }
    default:
      return state;
  }
}
