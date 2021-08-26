import { readFile, writeFile } from '../../helpers/fs';
import { addCommitPush } from '../../helpers/git';
import { genId } from '../../helpers/utils';

export const METADATA_POPULATE = 'METADATA_POPULATE';
export const CUSTOMERS_POPULATE = 'CUSTOMERS_POPULATE';
export const CUSTOMERS_CREATE_SUCCESS = 'CUSTOMERS_CREATE_SUCCESS';

export const metadataPopulateAction = (metadata) => ({
  type: METADATA_POPULATE,
  metadata,
})

export const customersPopulateAction = (customers) => ({
  type: CUSTOMERS_POPULATE,
  customers,
})

export const customersCreateAction = (customer) => ({
  type: CUSTOMERS_CREATE_SUCCESS,
  customer,
})

export const readMetadata = (dir) => async (dispatch) => {
  const metaJSON = await readFile(dir, 'metadata.json');
  const meta = JSON.parse(metaJSON);
  dispatch(metadataPopulateAction(meta));
  dispatch(customersPopulateAction(meta.customers));
}

export const createCustomer = (dir, name) => async (dispatch, getState) => {
  const { customers, metadata, auth } = getState();
    const newCustomer = {
      id: genId(),
      name,
    };
    const nextCustomers = [...customers, newCustomer];
    const nextMeta = { ...metadata, customers: nextCustomers };
    const nextMetaJSON = JSON.stringify(nextMeta, null, 2);

    await writeFile(dir, 'metadata.json', nextMetaJSON);

    await addCommitPush({
      dir,
      filepath: 'metadata.json',
      accessToken: auth.token,
      message: `[customer] create customer "${name}"`,
      author: auth.user,
    });

    dispatch(customersCreateAction(newCustomer));
    dispatch(metadataPopulateAction(nextMeta));
    console.log(getState());
}