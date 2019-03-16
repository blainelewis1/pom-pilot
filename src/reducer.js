import { combineReducers } from "redux";
import {
  START_TIMER,
  TIME_ELAPSED,
  SET_PURPOSE,
  SET_POM_LENGTH,
  SET_BREAK_LENGTH,
  SETUP_TIMER,
  TIMER_COMPLETE,
  SET_NOTIFICATIONS,
  SET_TIMER_SOUND,
  REMOVE_SNACKBAR,
  ENQUEUE_SNACKBAR,
  SET_GOOGLE_API_KEY,
  SET_GOOGLE_CLIENT_ID,
  SET_GOOGLE_ENABLED,
  SET_GOOGLE_SIGNED_IN
} from "./actions";
import { MILLISECONDS_IN_A_MINUTE } from "./constants";

let defaultTimer = {
  // The amount of time remaining in milliseconds. If direction is positive this is the time elapsed
  timeRemaining: 25 * MILLISECONDS_IN_A_MINUTE,
  purpose: "",
  // the timestamp when the timer was first started
  startedAt: null,
  completedAt: null,
  direction: -1,
  notified: false
};

function timer(state = defaultTimer, action) {
  switch (action.type) {
    case START_TIMER:
      return {
        ...state,
        startedAt: Date.now()
      };
    case TIME_ELAPSED:
      let timeRemaining = state.timeRemaining + state.direction * action.amount;

      if (timeRemaining < 0) {
        timeRemaining = 0;
      }

      return { ...state, timeRemaining };
    case SET_PURPOSE:
      return { ...state, purpose: action.value };
    case SETUP_TIMER:
      let newTimerState = { ...defaultTimer };

      return { ...newTimerState, ...action.timerValues };
    case TIMER_COMPLETE:
      return { ...state, completedAt: Date.now() };
    default:
      return state;
  }
}

function settings(
  state = {
    pomLengthInMinutes: 25,
    breakLengthInMinutes: 5,
    notifications: true,
    timerSound: "/alarm.mp3",
    minTime: 1 * MILLISECONDS_IN_A_MINUTE,
    googleApiKey: "",
    googleClientId: "",
    googleEnabled: true,
    googleSignedIn: false
  },
  action
) {
  switch (action.type) {
    case SET_GOOGLE_API_KEY:
      return { ...state, googleApiKey: action.value };
    case SET_GOOGLE_CLIENT_ID:
      return { ...state, googleClientId: action.value };
    case SET_POM_LENGTH:
      return { ...state, pomLengthInMinutes: action.value };
    case SET_BREAK_LENGTH:
      return { ...state, breakLengthInMinutes: action.value };
    case SET_NOTIFICATIONS:
      return { ...state, notifications: action.value };
    case SET_TIMER_SOUND:
      return { ...state, timerSound: action.value };
    case SET_GOOGLE_ENABLED:
      return { ...state, googleEnabled: action.value };
    case SET_GOOGLE_SIGNED_IN:
      return { ...state, googleSignedIn: action.value };
    default:
      return state;
  }
}

function notifications(state = [], action) {
  switch (action.type) {
    case ENQUEUE_SNACKBAR:
      return [
        ...state,
        {
          ...action.notification
        }
      ];
    case REMOVE_SNACKBAR:
      return state.filter(notification => notification.key !== action.key);

    default:
      return state;
  }
}

export default combineReducers({
  timer,
  settings,
  notifications
});
