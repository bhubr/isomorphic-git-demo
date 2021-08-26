import {
  CUSTOMERS_POPULATE,
  CUSTOMERS_CREATE_SUCCESS,
  CUSTOMERS_UPDATE_SUCCESS,
  CUSTOMERS_DELETE_SUCCESS,
  GROUPS_CREATE_SUCCESS,
  GROUPS_UPDATE_SUCCESS,
  GROUPS_DELETE_SUCCESS,
} from '../actions/metadata';

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
      return state.map((c) => (c.id === customer.id ? customer : c));
    }
    case CUSTOMERS_DELETE_SUCCESS: {
      const { customer: deletedCustomer } = action;
      return state.filter((c) => c.id !== deletedCustomer.id);
    }
    case GROUPS_CREATE_SUCCESS: {
      const { group } = action;
      return state.map((c) => {
        if (c.id !== group.customerId) {
          return c;
        }
        const groups = c.groups || [];
        return { ...c, groups: [...groups, group] };
      });
    }
    case GROUPS_UPDATE_SUCCESS: {
      const { group, prevGroup } = action;
      return state.map((c) => {
        // neither prev or new group's customerId is that of this customer
        if (c.id !== group.customerId && c.id !== prevGroup.customerId) {
          return c;
        }
        // prev group's customerId is that of this customer => remove it
        if (c.id === prevGroup.customerId) {
          const groups = c.groups.filter((g) => g.id !== group.id);
          return { ...c, groups };
        }
        // if new group's customerId is that of this customer:
        if (c.id === group.customerId) {
          // a. if prev group's customerId wasn't the same, add it
          if (group.customerId !== prevGroup.customerId) {
            const groups = c.groups || [];
            return { ...c, groups: [...groups, group] };
          }
          // b. otherwise update it
          const groups = c.groups.map((g) => (g.id === group.id ? group : g));
          return { ...c, groups };
        }
        // This shouldn't happen
        throw new Error('unexpected case');
      });
    }
    case GROUPS_DELETE_SUCCESS: {
      const { group } = action;
      return state.map((c) => {
        if (c.id !== group.customerId) {
          return c;
        }
        const groups = c.groups.filter((g) => g.id !== group.id);
        return { ...c, groups };
      });
    }
    default:
      return state;
  }
}
