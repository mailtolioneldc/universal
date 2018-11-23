import { take, put, select } from 'redux-saga/effects';
import { PAGE_TITLE, GET_PAGE_TITLE } from './actionType';
import * as selectors from './actionSelector';

export function* getPageTitleFlow() {
  while (true) {
    const {
      payload: { page_title },
    } = yield take(GET_PAGE_TITLE);
    try {
      yield put({ type: PAGE_TITLE, payload: page_title });
    } catch (e) {
      yield put({ type: PAGE_TITLE, payload: '' });
    }
  }
}

export function* getPageTitle(title) {
  console.log("calling here")
  const page_title = yield select(selectors.getPageTitle);
  if (!page_title) {
    yield put({ type: PAGE_TITLE, payload: title });
  }
}
