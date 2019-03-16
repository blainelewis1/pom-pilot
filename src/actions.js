import { MILLISECONDS_IN_A_MINUTE } from "./constants";
import notify from "./notify";
import { addToCalendar } from "./google";

export const INVERT_PLAY_STATE = "INVERT_PLAY_STATE";
export const TIME_ELAPSED = "TIME_ELAPSED";
export const SET_PURPOSE = "SET_PURPOSE";
export const SETUP_TIMER = "SETUP_TIMER";
export const TIMER_COMPLETE = "TIMER_COMPLETE";

export const SET_POM_LENGTH = "SET_POM_LENGTH";
export const SET_BREAK_LENGTH = "SET_BREAK_LENGTH";
export const SET_NOTIFICATIONS = "SET_NOTIFICATION";
export const SET_TIMER_SOUND = "SET_TIMER_SOUND";
export const SET_GOOGLE_API_KEY = "SET_GOOGLE_API_KEY";
export const SET_GOOGLE_CLIENT_ID = "SET_GOOGLE_CLIENT_ID";

export const ENQUEUE_SNACKBAR = "ENQUEUE_SNACKBAR";
export const REMOVE_SNACKBAR = "REMOVE_SNACKBAR";

export function invertPlayState() {
  return { type: INVERT_PLAY_STATE };
}

export function reduceTime(amount) {
  return function(dispatch, getState) {
    dispatch({ type: TIME_ELAPSED, amount });
    if (getState().timer.timeRemaining <= 0) {
      dispatch(timerComplete());
    }
  };
}

function timerComplete() {
  return function(dispatch, getState) {
    dispatch({ type: TIMER_COMPLETE });
    notify(getState().settings);
    addToCalendar(getState().timer);
  };
}

export function setPurpose(value) {
  return { type: SET_PURPOSE, value };
}

export function setupTimer(timerValues) {
  return function(dispatch, getState) {
    if (
      getState().timer.firstPlay &&
      Date.now() - getState().timer.firstPlay > getState().settings.minTime
    ) {
      console.log({ ...getState().timer, complete: Date.now() });
      addToCalendar({ ...getState().timer, complete: Date.now() });
    }

    dispatch({ type: SETUP_TIMER, timerValues });
  };
}

export function startBreak() {
  return function(dispatch, getState) {
    dispatch(
      setupTimer({
        playing: true,
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
        playing: false,
        timeRemaining:
          getState().settings.pomLengthInMinutes * MILLISECONDS_IN_A_MINUTE
      })
    );
  };
}

export function startTimer() {
  return function(dispatch) {
    dispatch(
      setupTimer({
        playing: true,
        firstPlay: Date.now(),
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
