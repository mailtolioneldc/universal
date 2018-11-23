/*eslint no-unreachable: 0*/

import { PAGE_TITLE } from './actionType';

const INITIAL_STATE = { pageTitle: '' };

export default function(state = INITIAL_STATE, action) {
  switch (action.type) {
    case PAGE_TITLE:
      return { ...state, pageTitle: action.payload };
      break;

    default:
      return state;
  }
}
