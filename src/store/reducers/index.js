import { combineReducers } from 'redux';
import auth from './auth';
import metadata from './metadata';
import customers from './customers';

export default combineReducers({
  auth,
  metadata,
  customers,
});
