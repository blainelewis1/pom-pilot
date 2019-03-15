import { combineReducers } from "redux";
import {
  INVERT_PLAY_STATE,
  TIME_ELAPSED,
  SET_PURPOSE,
  SET_POM_LENGTH,
  SET_BREAK_LENGTH,
  SETUP_TIMER,
  TIMER_COMPLETE,
  SET_NOTIFICATIONS,
  SET_TIMER_SOUND,
  REMOVE_SNACKBAR,
  ENQUEUE_SNACKBAR
} from "./actions";
import { MILLISECONDS_IN_A_MINUTE } from "./constants";

let defaultTimer = {
  playing: false,
  // The amount of time remaining in milliseconds. If direction is positive this is the time elapsed
  timeRemaining: 25 * MILLISECONDS_IN_A_MINUTE,
  purpose: "",
  // the timestamp when the timer was first started
  firstPlay: null,
  complete: false,
  direction: -1
};

function timer(state = defaultTimer, action) {
  switch (action.type) {
    case INVERT_PLAY_STATE:
      let playing = state.playing;

      if (state.purpose) {
        playing = !playing;
      }

      let firstPlay = state.firstPlay;

      if (!state.firstPlay && playing) {
        firstPlay = Date.now();
      }

      return {
        ...state,
        firstPlay,
        playing
      };
    case TIME_ELAPSED:
      let timeRemaining = state.timeRemaining + state.direction * action.amount;
      playing = state.playing;

      if (timeRemaining < 0) {
        timeRemaining = 0;
        playing = false;
      }

      return { ...state, timeRemaining, playing };
    case SET_PURPOSE:
      return { ...state, purpose: action.value };
    case SETUP_TIMER:
      let newTimerState = { ...defaultTimer };
      if (action.timerValues.playing) {
        newTimerState.firstPlay = Date.now();
      }

      return { ...newTimerState, ...action.timerValues };
    case TIMER_COMPLETE:
      return { ...state, complete: Date.now() };
    default:
      return state;
  }
}

function settings(
  state = {
    pomLengthInMinutes: 25,
    breakLengthInMinutes: 5,
    notifications: true,
    timerSound: "/alarm.mp3"
  },
  action
) {
  switch (action.type) {
    case SET_POM_LENGTH:
      return { ...state, pomLengthInMinutes: action.value };
    case SET_BREAK_LENGTH:
      return { ...state, breakLengthInMinutes: action.value };
    case SET_NOTIFICATIONS:
      return { ...state, notifications: action.value };
    case SET_TIMER_SOUND:
      return { ...state, timerSound: action.value };
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
