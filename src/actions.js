import { MILLISECONDS_IN_A_MINUTE } from "./constants";
import notify from "./notify";
import { addToCalendar } from "./google";

export const START_TIMER = "START_TIMER";
export const TIME_ELAPSED = "TIME_ELAPSED";
export const SET_PURPOSE = "SET_PURPOSE";
export const SETUP_TIMER = "SETUP_TIMER";
export const TIMER_COMPLETE = "TIMER_COMPLETE";
export const NOTIFY = "NOTIFY";
export const ADD_TO_CALENDAR = "ADD_TO_CALENDAR";

export const SET_POM_LENGTH = "SET_POM_LENGTH";
export const SET_BREAK_LENGTH = "SET_BREAK_LENGTH";
export const SET_NOTIFICATIONS = "SET_NOTIFICATION";
export const SET_TIMER_SOUND = "SET_TIMER_SOUND";
export const SET_GOOGLE_API_KEY = "SET_GOOGLE_API_KEY";
export const SET_GOOGLE_CLIENT_ID = "SET_GOOGLE_CLIENT_ID";
export const SET_GOOGLE_ENABLED = "SET_GOOGLE_ENABLED";
export const SET_GOOGLE_SIGNED_IN = "SET_GOOGLE_SIGNED_IN";

export const ENQUEUE_SNACKBAR = "ENQUEUE_SNACKBAR";
export const REMOVE_SNACKBAR = "REMOVE_SNACKBAR";

export function startTimer() {
  return { type: START_TIMER };
}

export function reduceTime(amount) {
  return function(dispatch, getState) {
    dispatch({ type: TIME_ELAPSED, amount });
    if (getState().timer.timeRemaining <= 0) {
      dispatch(timerComplete());
    }
  };
}

function timerComplete(notifyEnabled = true) {
  return function(dispatch, getState) {
    if (!getState().timer.completedAt) {
      dispatch({ type: TIMER_COMPLETE });
      if (notifyEnabled) {
        dispatch(notify());
      }
      dispatch(addToCalendar(getState().timer));
    }
  };
}

export function setPurpose(value) {
  return function(dispatch, getState) {
    dispatch({ type: SET_PURPOSE, value });
    if (!getState().startedAt) {
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
      dispatch(timerComplete(false));
    }

    dispatch({ type: SETUP_TIMER, timerValues });
  };
}

export function startBreak() {
  return function(dispatch, getState) {
    dispatch(
      setupTimer({
        startedAt: Date.now(),
        timeRemaining:
          getState().settings.breakLengthInMinutes * MILLISECONDS_IN_A_MINUTE,
        purpose: "Break"
      })
    );
  };
}

export function startPom() {
  return function(dispatch, getState) {
    dispatch(
      setupTimer({
        startedAt: null,
        timeRemaining:
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
        timeRemaining: 0,
        direction: 1
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

export function setGoogleApiKey(value) {
  return { type: SET_GOOGLE_API_KEY, value };
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
