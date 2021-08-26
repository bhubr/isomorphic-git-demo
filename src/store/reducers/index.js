import { combineReducers } from 'redux';
import auth from './auth';
import metadata from './metadata';
import customers from './customers';
import events from './events';

export default combineReducers({
  auth,
  metadata,
  customers,
  events,
});
