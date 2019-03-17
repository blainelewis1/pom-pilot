import { combineReducers } from "redux";
import {
  START_TIMER,
  SET_PURPOSE,
  SET_POM_LENGTH,
  SET_BREAK_LENGTH,
  SETUP_TIMER,
  TIMER_COMPLETE,
  SET_NOTIFICATIONS,
  SET_TIMER_SOUND,
  REMOVE_SNACKBAR,
  ENQUEUE_SNACKBAR,
  SET_GOOGLE_CLIENT_ID,
  SET_GOOGLE_ENABLED,
  SET_GOOGLE_SIGNED_IN,
  SET_GOOGLE_CALENDAR,
  SET_COLOR,
  NOTIFY,
  ADD_TO_CALENDAR
} from "./actions";
import { MILLISECONDS_IN_A_MINUTE } from "./constants";

export const initialState = {
  timer: {
    length: 25 * MILLISECONDS_IN_A_MINUTE,
    purpose: "",
    startedAt: null,
    completedAt: null,
    completed: false,
    notified: false,
    addedToCalendar: false,
    type: "pom"
  },
  settings: {
    pomLengthInMinutes: 25,
    breakLengthInMinutes: 5,
    notifications: true,
    timerSound: "/alarm.mp3",
    minTime: 1 * MILLISECONDS_IN_A_MINUTE,
    googleApiKey: "",
    googleClientId: "",
    googleEnabled: true,
    googleSignedIn: false,
    googleCalendar: "primary",
    colors: { pom: null, breaking: null, action: null }
  }
};

function timer(state = initialState.timer, action) {
  switch (action.type) {
    case START_TIMER:
      let completedAt = undefined;

      if (state.length) {
        completedAt = Date.now() + state.length;
      }

      return {
        ...state,
        startedAt: Date.now(),
        completedAt
      };
    case SET_PURPOSE:
      return { ...state, purpose: action.value };

    case SETUP_TIMER:
      let newTimerState = { ...initialState.timer };
      return { ...newTimerState, ...action.timerValues };
    case NOTIFY:
      return { ...state, notified: true };
    case ADD_TO_CALENDAR:
      return { ...state, addedToCalendar: true };
    case TIMER_COMPLETE:
      completedAt = state.completedAt || Date.now();
      return { ...state, completed: true, completedAt };

    default:
      return state;
  }
}

function settings(state = initialState.settings, action) {
  switch (action.type) {
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
    case SET_GOOGLE_CALENDAR:
      return { ...state, googleCalendar: action.value };
    case SET_COLOR:
      return {
        ...state,
        colors: { ...state.colors, [action.colorType]: action.value }
      };
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
