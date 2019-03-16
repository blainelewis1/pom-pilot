import store from "./configureStore";
import { timerComplete } from "./actions";

export function manageTimers() {
  store.getState();
  if (
    store.getState().timer.length &&
    store.getState().timer.startedAt &&
    Date.now() >= store.getState().timer.completedAt &&
    !store.getState().timer.completed
  ) {
    store.dispatch(timerComplete());
  }
}

export default () => {
  setInterval(manageTimers, 100);
};
