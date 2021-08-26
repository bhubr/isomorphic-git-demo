import { readFile, writeFile } from '../../helpers/fs';
import { addCommitPush } from '../../helpers/git';
import { genId } from '../../helpers/utils';

export const METADATA_POPULATE = 'METADATA_POPULATE';
export const CUSTOMERS_POPULATE = 'CUSTOMERS_POPULATE';
export const CUSTOMERS_CREATE_SUCCESS = 'CUSTOMERS_CREATE_SUCCESS';
export const CUSTOMERS_UPDATE_SUCCESS = 'CUSTOMERS_UPDATE_SUCCESS';
export const CUSTOMERS_DELETE_SUCCESS = 'CUSTOMERS_DELETE_SUCCESS';

export const metadataPopulateAction = (metadata) => ({
  type: METADATA_POPULATE,
  metadata,
})

const customersPopulateAction = (customers) => ({
  type: CUSTOMERS_POPULATE,
  customers,
})

const customersCreateAction = (customer) => ({
  type: CUSTOMERS_CREATE_SUCCESS,
  customer,
})

const customersUpdateAction = (customer) => ({
  type: CUSTOMERS_UPDATE_SUCCESS,
  customer,
});

const customersDeleteAction = (customer) => ({
  type: CUSTOMERS_DELETE_SUCCESS,
  customer,
})

export const readMetadata = (dir) => async (dispatch) => {
  const metaJSON = await readFile(dir, 'metadata.json');
  const meta = JSON.parse(metaJSON);
  dispatch(metadataPopulateAction(meta));
  dispatch(customersPopulateAction(meta.customers));
}

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

}

export const createCustomer = (dir, { name }) => async (dispatch, getState) => {
  const { customers, metadata, auth } = getState();
  const newCustomer = {
    id: genId(),
    name,
  };
  const nextCustomers = [...customers, newCustomer];
  const nextMeta = { ...metadata, customers: nextCustomers };

  await writeMetadata({
    dir, auth, meta: nextMeta, message: `[customer] create customer "${name}"`
  });

  dispatch(customersCreateAction(newCustomer));
  dispatch(metadataPopulateAction(nextMeta));
  console.log(getState());
}

export const updateCustomer = (dir, { id, name }) => async (dispatch, getState) => {
  const { customers, metadata, auth } = getState();
  const existingCustomer = customers.find(c => c.id === id);
  const updatedCustomer = { ...existingCustomer, name };
  const nextCustomers = customers.map(c => c.id === id ? updatedCustomer : c);
  const nextMeta = { ...metadata, customers: nextCustomers };

  await writeMetadata({
    dir, auth, meta: nextMeta, message: `[customer] update customer "${existingCustomer.name}" -> "${name}"`
  });

  dispatch(customersUpdateAction(updatedCustomer));
  dispatch(metadataPopulateAction(nextMeta));
  console.log(getState());
}

export const deleteCustomer = (dir, customerId) => async (dispatch, getState) => {
  const { customers, metadata, auth } = getState();
  const deletedCustomer = customers.find(c => c.id === customerId);
  const nextCustomers = customers.filter(c => c.id !== customerId);
  const nextMeta = { ...metadata, customers: nextCustomers };

  await writeMetadata({
    dir, auth, meta: nextMeta, message: `[customer] delete customer "${deletedCustomer.name}"`
  });

  dispatch(customersDeleteAction(deletedCustomer));
  dispatch(metadataPopulateAction(nextMeta));
  console.log(getState());
}