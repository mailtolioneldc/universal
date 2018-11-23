'use strict';
import { GET_PAGE_TITLE } from './actionType';

export function getPageTitleAction(page_title) {
  return {
    type: GET_PAGE_TITLE,
    payload: { page_title },
  };
}
