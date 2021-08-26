import { CUSTOMERS_POPULATE, CUSTOMERS_CREATE_SUCCESS, CUSTOMERS_UPDATE_SUCCESS, CUSTOMERS_DELETE_SUCCESS } from '../actions/metadata';

export default function customersReducer(state = [], action) {
  switch (action.type) {
    case CUSTOMERS_POPULATE: {
      return action.customers;
    }
    case CUSTOMERS_CREATE_SUCCESS: {
      const { customer } = action;
      return [...state, customer];
    }
    case CUSTOMERS_UPDATE_SUCCESS: {
      const { customer } = action;
      return state.map(c => c.id === customer.id ? customer : c);
    }
    case CUSTOMERS_DELETE_SUCCESS: {
      const { customer: deletedCustomer } = action;
      return state.filter(c => c.id !== deletedCustomer.id);
    }
    default:
      return state;
  }
}
