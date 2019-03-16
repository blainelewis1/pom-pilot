import { createStore, applyMiddleware } from "redux";
import reducer from "./reducer";
import logger from "redux-logger";
import thunk from "redux-thunk";

export const configureStore = initialState => {
  const persistedState = localStorage.getItem("reduxState")
    ? JSON.parse(localStorage.getItem("reduxState"))
    : {};

  let store = createStore(
    reducer,
    { ...persistedState, initialState },
    applyMiddleware(logger, thunk)
  );

  store.subscribe(() => {
    localStorage.setItem("reduxState", JSON.stringify(store.getState()));
  });

  return store;
};

export default configureStore();
