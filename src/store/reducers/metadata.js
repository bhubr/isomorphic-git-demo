import { METADATA_POPULATE } from '../actions/metadata';

export default function metadataReducer(state = null, action) {
  switch (action.type) {
    case METADATA_POPULATE: {
      return action.metadata;
    }
    default:
      return state;
  }
}
