const dir = '/agenda-wip4';
const url = 'https://github.com/bhubr/git-agenda';

// const dir = '/git-calendar';
// const url = 'https://github.com/bhubr/git-calendar'

const initialState = {
  dir,
  url,
};

export default function repoReducer(state = initialState, action) {
  switch (action.type) {
    default:
      return state;
  }
}
