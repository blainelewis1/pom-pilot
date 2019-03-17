import store from "./configureStore";
import { enqueueSnackbar, setGoogleSignedIn, ADD_TO_CALENDAR } from "./actions";
import { IconButton, Button, TextField, MenuItem } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import CloseIcon from "@material-ui/icons/Close";
import styled from "styled-components";

const gapi = window.gapi;

const Splotch = styled.div`
  width: 100%;
  height: 100%;
  border-radius: 5px;
  background-color: ${({ color }) => color};
`;

// Array of API discovery doc URLs for APIs used by the quickstart
var DISCOVERY_DOCS = [
  "https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest"
];

// Authorization scopes required by the API; multiple scopes can be
// included, separated by spaces.
var SCOPES = "https://www.googleapis.com/auth/calendar";

/**
 *  On load, called to load the auth2 library and API client library.
 */
function handleClientLoad() {
  gapi.load("client:auth2", initClient);
}

export function getAllCalendars() {
  return gapi.client.calendar.calendarList
    .list()
    .getPromise()
    .then(data => Promise.resolve(data.result.items));
}
export function getAllColors() {
  return gapi.client.calendar.colors
    .get({ calendarId: store.getState().settings.googleCalendar })
    .getPromise()
    .then(data =>
      Object.keys(data.result.event).map(id => ({
        id,
        color: data.result.event[id].background
      }))
    );
}

export const GoogleCalendarList = ({ ...props }) => {
  let [calendars, setCalendars] = useState([]);

  useEffect(() => {
    getAllCalendars().then(calendars => setCalendars(calendars));
  }, []);

  return (
    <TextField
      select
      label="Calendar"
      margin="normal"
      variant="outlined"
      fullWidth
      disabled={calendars.length === 0}
      {...props}
    >
      {calendars.map(({ id, summary, primary }) => (
        <MenuItem key={id} value={primary ? "primary" : id}>
          {summary}
        </MenuItem>
      ))}
    </TextField>
  );
};

export const GoogleColorList = ({ ...props }) => {
  let [colors, setColors] = useState([]);

  useEffect(() => {
    getAllColors().then(colors => setColors(colors));
  }, []);

  return (
    <TextField
      select
      margin="normal"
      variant="outlined"
      fullWidth
      disabled={colors.length === 0}
      {...props}
    >
      {colors.map(({ id, color }) => (
        <MenuItem key={id} value={id}>
          <Splotch color={color}>&nbsp;</Splotch>
        </MenuItem>
      ))}
    </TextField>
  );
};

function getApiLogin() {
  // TODO: if there is no api login then create a snackbar with a link to the settings page?

  return {
    // apiKey:
    //   process.env.REACT_APP_GOOGLE_API_KEY ||
    //   store.getState().settings.googleApiKey,
    clientId:
      process.env.REACT_APP_GOOGLE_CLIENT_ID ||
      store.getState().settings.googleClientId
  };
}

/**
 *  Initializes the API client library and sets up sign-in state
 *  listeners.
 */
function initClient() {
  gapi.client
    .init({
      ...getApiLogin(),
      discoveryDocs: DISCOVERY_DOCS,
      scope: SCOPES
    })
    .then(function() {
      // Listen for sign-in state changes.
      gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus);

      // Handle the initial sign-in state.
      updateSigninStatus(isSignedIn());
    })
    .catch(error => {
      updateSigninStatus(false, error);
    });
}

/**
 *  Called when the signed in status changes, to update the UI
 *  appropriately. After a sign-in, the API is called.
 */
function updateSigninStatus(isSignedIn, error) {
  if (isSignedIn) {
    store.dispatch(
      enqueueSnackbar({
        message: "Signed into Google Calendar.",
        options: {
          variant: "success"
        }
      })
    );
  } else {
    store.dispatch(
      enqueueSnackbar({
        message: "Signed out of Google Calendar",
        options: {
          variant: "error",
          action: [
            <Button key="authorise" size="small" onClick={signIn}>
              AUTHORISE
            </Button>,
            <IconButton key="close" aria-label="Close" color="inherit">
              <CloseIcon />
            </IconButton>
          ]
        }
      })
    );
  }

  store.dispatch(setGoogleSignedIn(isSignedIn));
}

export function signIn() {
  gapi.auth2.getAuthInstance().signIn();
}

function formatDate(d) {
  d.setMilliseconds(0);
  return d.toJSON();
}

export function addToCalendar() {
  return function(dispatch, getState) {
    let {
      settings: { googleEnabled, googleCalendar, colors },
      timer: { purpose, startedAt, completedAt, addedToCalendar, type }
    } = getState();

    if (!addedToCalendar) {
      if (!googleEnabled) {
        return;
      }
      // BUG: this won't let retries work.
      dispatch({ type: ADD_TO_CALENDAR });

      try {
        var request = gapi.client.calendar.events.insert({
          calendarId: googleCalendar,
          resource: {
            summary: purpose,
            colorId: colors[type],
            start: {
              dateTime: formatDate(new Date(startedAt))
            },
            end: {
              dateTime: formatDate(new Date(completedAt))
            }
          }
        });

        request
          .getPromise()
          .then(() => {
            dispatch(
              enqueueSnackbar({
                message: "Successfully added to Google Calendar!",
                options: {
                  variant: "success"
                }
              })
            );
          })
          .catch(e => {
            console.log(e);
            store.dispatch(
              enqueueSnackbar({
                message: "Something went wrong adding to Google Calendar.",
                options: {
                  variant: "error"
                }
              })
            );
          });
      } catch (e) {
        console.log(e);
        //TODO: add a retry button?
        store.dispatch(
          enqueueSnackbar({
            message: "Something went wrong adding to Google Calendar.",
            options: {
              variant: "error"
            }
          })
        );
      }
    }
  };
}

export function isSignedIn() {
  if (gapi.auth2) {
    return gapi.auth2.getAuthInstance().isSignedIn.get();
  } else {
    return false;
  }
}

handleClientLoad();

export default gapi;
