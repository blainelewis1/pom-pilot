import { MILLISECONDS_IN_A_MINUTE } from "./constants";
import notify from "./notify";
import { addToCalendar } from "./google";

export const START_TIMER = "START_TIMER";
export const SET_PURPOSE = "SET_PURPOSE";
export const SETUP_TIMER = "SETUP_TIMER";
export const TIMER_COMPLETE = "TIMER_COMPLETE";
export const NOTIFY = "NOTIFY";
export const ADD_TO_CALENDAR = "ADD_TO_CALENDAR";

export const SET_POM_LENGTH = "SET_POM_LENGTH";
export const SET_BREAK_LENGTH = "SET_BREAK_LENGTH";
export const SET_NOTIFICATIONS = "SET_NOTIFICATION";
export const SET_TIMER_SOUND = "SET_TIMER_SOUND";
export const SET_GOOGLE_CLIENT_ID = "SET_GOOGLE_CLIENT_ID";
export const SET_GOOGLE_ENABLED = "SET_GOOGLE_ENABLED";
export const SET_GOOGLE_SIGNED_IN = "SET_GOOGLE_SIGNED_IN";
export const SET_GOOGLE_CALENDAR = "SET_GOOGLE_CALENDAR";
export const SET_COLOR = "SET_COLOR";
export const ENQUEUE_SNACKBAR = "ENQUEUE_SNACKBAR";
export const REMOVE_SNACKBAR = "REMOVE_SNACKBAR";

export function startTimer() {
  return { type: START_TIMER };
}

export function timerComplete() {
  return function(dispatch, getState) {
    if (!getState().timer.completed) {
      dispatch({ type: TIMER_COMPLETE });
      dispatch(notify());
      dispatch(addToCalendar());
    }
  };
}

export function setPurpose(value) {
  return function(dispatch, getState) {
    dispatch({ type: SET_PURPOSE, value });
    if (!getState().timer.startedAt) {
      dispatch(startTimer());
    }
  };
}

export function setupTimer(timerValues) {
  return function(dispatch, getState) {
    if (
      getState().timer.startedAt &&
      Date.now() - getState().timer.startedAt > getState().settings.minTime
    ) {
      dispatch({ type: TIMER_COMPLETE });
      dispatch(addToCalendar());
    }

    dispatch({ type: SETUP_TIMER, timerValues });
  };
}

export function startBreak() {
  return function(dispatch, getState) {
    dispatch(
      setupTimer({
        startedAt: Date.now(),
        type: "breaking",
        length:
          getState().settings.breakLengthInMinutes * MILLISECONDS_IN_A_MINUTE,
        purpose: "Break"
      })
    );
    dispatch(startTimer());
  };
}

export function startPom() {
  return function(dispatch, getState) {
    dispatch(
      setupTimer({
        startedAt: null,
        type: "pom",
        length:
          getState().settings.pomLengthInMinutes * MILLISECONDS_IN_A_MINUTE
      })
    );
  };
}

export function startAction() {
  return function(dispatch) {
    dispatch(
      setupTimer({
        startedAt: Date.now(),
        length: 0,
        type: "action"
      })
    );
  };
}

export function setPomLength(value) {
  return { type: SET_POM_LENGTH, value };
}

export function setNotifications(value) {
  return { type: SET_NOTIFICATIONS, value };
}

export function setBreakLength(value) {
  return { type: SET_BREAK_LENGTH, value };
}

export function setTimerSound(value) {
  return { type: SET_TIMER_SOUND, value };
}

export function setGoogleClientId(value) {
  return { type: SET_GOOGLE_CLIENT_ID, value };
}

export function setGoogleEnabled(value) {
  return { type: SET_GOOGLE_ENABLED, value };
}

export function setGoogleSignedIn(value) {
  return { type: SET_GOOGLE_SIGNED_IN, value };
}

export function setGoogleCalendar(value) {
  return { type: SET_GOOGLE_CALENDAR, value };
}

export function setColor(colorType, value) {
  return { type: SET_COLOR, colorType, value };
}

export function enqueueSnackbar(notification) {
  return {
    type: ENQUEUE_SNACKBAR,
    notification: {
      key: new Date().getTime() + Math.random(),
      ...notification
    }
  };
}

export function removeSnackbar(key) {
  return {
    type: REMOVE_SNACKBAR,
    key
  };
}
