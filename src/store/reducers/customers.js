import { CUSTOMERS_POPULATE, CUSTOMERS_CREATE_SUCCESS } from '../actions/metadata';

export default function customersReducer(state = [], action) {
  switch (action.type) {
    case CUSTOMERS_POPULATE: {
      return action.customers;
    }
    case CUSTOMERS_CREATE_SUCCESS: {
      const { customer } = action;
      return [...state, customer];
    }
    default:
      return state;
  }
}
