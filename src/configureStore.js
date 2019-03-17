import { createStore, applyMiddleware } from "redux";
import reducer, { initialState } from "./reducer";
import logger from "redux-logger";
import thunk from "redux-thunk";

export const configureStore = () => {
  const persistedState = localStorage.getItem("reduxState")
    ? JSON.parse(localStorage.getItem("reduxState"))
    : initialState;

  persistedState.settings.googleSignedIn = false;

  let store = createStore(
    reducer,
    persistedState,
    applyMiddleware(logger, thunk)
  );

  store.subscribe(() => {
    localStorage.setItem("reduxState", JSON.stringify(store.getState()));
  });

  return store;
};

export default configureStore();
