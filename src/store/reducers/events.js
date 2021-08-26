import { EVENTS_CREATE_SUCCESS } from '../actions/events';

export default function eventsReducer(state = [], action) {
  switch (action.type) {
    case EVENTS_CREATE_SUCCESS: {
      return [...state, action.event];
    }
    default:
      return state;
  }
}
