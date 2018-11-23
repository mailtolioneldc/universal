import { applyMiddleware, compose } from 'redux';
import createSagaMiddleware, { END } from 'redux-saga';
import thunk from 'redux-thunk';
import { createInjectStore } from 'redux-injector';
//  import rootSaga from './sagas';
import createReducer from './store';
import rootSaga from './sagas';

const composeEnhancers =
  typeof window === 'object' && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
    ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
        // Specify extension’s options like name, actionsBlacklist, actionsCreators, serialize...
      })
    : compose;

export function injectAsyncReducer(store, name, asyncReducer) {
  if (store.asyncReducers[name]) return;

  store.asyncReducers[name] = asyncReducer;
  store.replaceReducer(createReducer(store.asyncReducers));
}

export const sagaMiddleware = createSagaMiddleware();

export default function configureStore(initialState = {}) {
  initialState = initialState || {};
  const store = createInjectStore(
    createReducer(),
    initialState,
    composeEnhancers(applyMiddleware(thunk, sagaMiddleware)),
  );
  store.asyncReducers = {};
  rootSaga.runSagas(sagaMiddleware);
  store.asyncReducers = {};
  store.asyncSagas = {};
  store.runSaga = sagaMiddleware.run;
  store.close = () => {
    store.dispatch(END);
  };
  /*
  if (module.hot) {
    module.hot.accept('./store', () => {
      const nextCreateReducer = require('./store').default;
      store.replaceReducer(nextCreateReducer(store.asyncReducers));
    });
    module.hot.accept('./sagas', () => {
      rootSaga.cancelSagas(store);
      require('./sagas').default.runSagas(sagaMiddleware);
    });
  }*/
  return store;
}
