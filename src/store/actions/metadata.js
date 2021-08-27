import groupBy from 'lodash/groupBy';
import { readFile, writeFile } from '../../helpers/fs';
import { addCommitPush } from '../../helpers/git';
import { generateId } from '../../helpers/utils';
import { TYPE_CUSTOMER, TYPE_GROUP } from '../../constants';

export const METADATA_POPULATE = 'METADATA_POPULATE';
export const CUSTOMERS_POPULATE = 'CUSTOMERS_POPULATE';
export const CUSTOMERS_CREATE_SUCCESS = 'CUSTOMERS_CREATE_SUCCESS';
export const CUSTOMERS_UPDATE_SUCCESS = 'CUSTOMERS_UPDATE_SUCCESS';
export const CUSTOMERS_DELETE_SUCCESS = 'CUSTOMERS_DELETE_SUCCESS';
export const GROUPS_CREATE_SUCCESS = 'GROUPS_CREATE_SUCCESS';
export const GROUPS_UPDATE_SUCCESS = 'GROUPS_UPDATE_SUCCESS';
export const GROUPS_DELETE_SUCCESS = 'GROUPS_DELETE_SUCCESS';

export const metadataPopulateAction = (metadata) => ({
  type: METADATA_POPULATE,
  metadata,
});

const customersPopulateAction = (customers) => ({
  type: CUSTOMERS_POPULATE,
  customers,
});

const customersCreateAction = (customer) => ({
  type: CUSTOMERS_CREATE_SUCCESS,
  customer,
});

const customersUpdateAction = (customer) => ({
  type: CUSTOMERS_UPDATE_SUCCESS,
  customer,
});

const customersDeleteAction = (customer) => ({
  type: CUSTOMERS_DELETE_SUCCESS,
  customer,
});

export const readMetadata = (dir) => async (dispatch) => {
  const metaJSON = await readFile(dir, 'metadata.json');
  const meta = JSON.parse(metaJSON);
  dispatch(metadataPopulateAction(meta));
  const { customers, groups } = meta;
  const groupedGroups = groupBy(groups, 'customerId');
  const customersWithGroups = customers.map((c) => ({
    ...c,
    groups: groupedGroups[c.id],
  }));
  dispatch(customersPopulateAction(customersWithGroups));
};

const writeMetadata = async ({ dir, auth, meta, message }) => {
  const metaJSON = JSON.stringify(meta, null, 2);

  await writeFile(dir, 'metadata.json', metaJSON);

  await addCommitPush({
    dir,
    filepath: 'metadata.json',
    accessToken: auth.token,
    message,
    author: auth.user,
  });
};

/**
 * Create a customer
 *
 * @param {string} dir
 * @param {object} param1 object containing { name }
 * @returns
 */
export const createCustomer =
  (dir, { name }) =>
  async (dispatch, getState) => {
    const { customers, metadata, auth } = getState();
    const newCustomer = {
      id: generateId(TYPE_CUSTOMER),
      name,
    };
    const nextCustomers = [...customers, newCustomer];
    const nextMeta = { ...metadata, customers: nextCustomers };

    await writeMetadata({
      dir,
      auth,
      meta: nextMeta,
      message: `[customer] create customer "${name}"`,
    });

    dispatch(customersCreateAction(newCustomer));
    dispatch(metadataPopulateAction(nextMeta));
  };

/**
 * Update a customer
 *
 * @param {string} dir
 * @param {object} param1 object containing { id, name }
 * @returns
 */
export const updateCustomer =
  (dir, { id, name }) =>
  async (dispatch, getState) => {
    const { customers, metadata, auth } = getState();
    const existingCustomer = customers.find((c) => c.id === id);
    const updatedCustomer = { ...existingCustomer, name };
    const nextCustomers = customers.map((c) =>
      c.id === id ? updatedCustomer : c,
    );
    const nextMeta = { ...metadata, customers: nextCustomers };

    await writeMetadata({
      dir,
      auth,
      meta: nextMeta,
      message: `[customer] update customer "${existingCustomer.name}" -> "${name}"`,
    });

    dispatch(customersUpdateAction(updatedCustomer));
    dispatch(metadataPopulateAction(nextMeta));
  };

/**
 * Delete a customer
 *
 * @param {string} dir
 * @param {string} customerId
 * @returns
 */
export const deleteCustomer =
  (dir, customerId) => async (dispatch, getState) => {
    const { customers, metadata, auth } = getState();
    const deletedCustomer = customers.find((c) => c.id === customerId);
    const nextCustomers = customers.filter((c) => c.id !== customerId);
    const nextMeta = { ...metadata, customers: nextCustomers };

    await writeMetadata({
      dir,
      auth,
      meta: nextMeta,
      message: `[customer] delete customer "${deletedCustomer.name}"`,
    });

    dispatch(customersDeleteAction(deletedCustomer));
    dispatch(metadataPopulateAction(nextMeta));
  };

const groupsCreateAction = (group) => ({
  type: GROUPS_CREATE_SUCCESS,
  group,
});

const groupsUpdateAction = (group, prevGroup) => ({
  type: GROUPS_UPDATE_SUCCESS,
  group,
  prevGroup,
});

const groupsDeleteAction = (group) => ({
  type: GROUPS_DELETE_SUCCESS,
  group,
});

/**
 * Create a group
 *
 * @param {string} dir
 * @param {object} param1 object containing { customerId, name }
 * @returns
 */
export const createGroup =
  (dir, { customerId, name }) =>
  async (dispatch, getState) => {
    const { metadata, auth } = getState();
    const newGroup = {
      id: generateId(TYPE_GROUP),
      customerId,
      name,
    };
    const groups = metadata.groups || [];
    const nextGroups = [...groups, newGroup];
    const nextMeta = { ...metadata, groups: nextGroups };

    await writeMetadata({
      dir,
      auth,
      meta: nextMeta,
      message: `[group] create group "${name}"`,
    });

    dispatch(groupsCreateAction(newGroup));
    dispatch(metadataPopulateAction(nextMeta));
  };

/**
 * Update a group
 *
 * @param {string} dir
 * @param {object} param1 object containing { id, customerId, name }
 * @returns
 */
export const updateGroup =
  (dir, { id, customerId, name }) =>
  async (dispatch, getState) => {
    const { metadata, auth } = getState();
    const groups = metadata.groups || [];
    const existingGroup = groups.find((g) => g.id === id);
    const updatedGroup = { ...existingGroup, name, customerId };
    const nextGroups = groups.map((g) => (g.id === id ? updatedGroup : g));
    const nextMeta = { ...metadata, groups: nextGroups };

    const message =
      existingGroup.name !== name
        ? `[group] update group "${existingGroup.name}" -> "${name}"`
        : `[group] update group "${name}"`;

    await writeMetadata({
      dir,
      auth,
      meta: nextMeta,
      message,
    });

    dispatch(groupsUpdateAction(updatedGroup, existingGroup));
    dispatch(metadataPopulateAction(nextMeta));
  };

/**
 * Delete a group
 *
 * @param {string} dir
 * @param {string} groupId
 * @returns
 */
export const deleteGroup = (dir, groupId) => async (dispatch, getState) => {
  const { metadata, auth } = getState();
  const groups = metadata.groups || [];
  const deletedGroup = groups.find((g) => g.id === groupId);
  const nextGroups = groups.filter((g) => g.id !== groupId);
  const nextMeta = { ...metadata, groups: nextGroups };

  await writeMetadata({
    dir,
    auth,
    meta: nextMeta,
    message: `[group] delete group "${deletedGroup.name}"`,
  });

  dispatch(groupsDeleteAction(deletedGroup));
  dispatch(metadataPopulateAction(nextMeta));
};
