import { EVENTS_CREATE_SUCCESS, EVENTS_UPDATE_SUCCESS, EVENTS_DELETE_SUCCESS, EVENTS_POPULATE } from '../actions/events';

export default function eventsReducer(state = [], action) {
  switch (action.type) {
    case EVENTS_POPULATE: {
      return action.events;
    }
    case EVENTS_CREATE_SUCCESS: {
      return [...state, action.event];
    }
    case EVENTS_UPDATE_SUCCESS: {
      const { event } = action;
      return state.map(e => e.id === event.id ? event : e);
    }
    case EVENTS_DELETE_SUCCESS: {
      const { event } = action;
      return state.filter(e => e.id !== event.id);
    }
    default:
      return state;
  }
}
