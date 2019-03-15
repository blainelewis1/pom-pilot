import { createStore, applyMiddleware } from "redux";
import reducer from "./reducer";
import logger from "redux-logger";
import thunk from "redux-thunk";

export const configureStore = initialState => {
  return createStore(reducer, applyMiddleware(logger, thunk));
};

export default configureStore();
