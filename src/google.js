import store from "./configureStore";
import { enqueueSnackbar, setGoogleSignedIn, ADD_TO_CALENDAR } from "./actions";
import { IconButton, Button } from "@material-ui/core";
import React from "react";
import CloseIcon from "@material-ui/icons/Close";

const gapi = window.gapi;

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

function getApiLogin() {
  // TODO: if there is no api login then create a snackbar with a link to the settings page.

  return {
    apiKey:
      process.env.REACT_APP_GOOGLE_API_KEY ||
      store.getState().settings.googleApiKey,
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
export function addToCalendar({ purpose, startedAt, completedAt }) {
  return function(dispatch, getState) {
    if (!getState().timer.addedToCalendar) {
      if (!getState().settings.googleEnabled) {
        return;
      }

      try {
        var request = gapi.client.calendar.events.insert({
          calendarId: "primary",
          resource: {
            summary: purpose,
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
            dispatch({ type: ADD_TO_CALENDAR });
            dispatch(
              enqueueSnackbar({
                message: "Successfully added to Google Calendar!",
                options: {
                  variant: "success"
                }
              })
            );
          })
          .catch(() => {
            store.dispatch(
              enqueueSnackbar({
                message: "Something went wrong adding to Google Calendar.",
                options: {
                  variant: "error"
                }
              })
            );
          });
      } catch {
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

// window.gapi.client.calendar.events.list({
//   calendarId: "primary",
//   timeMin: new Date().toISOString(),
//   showDeleted: false,
//   singleEvents: true,
//   maxResults: 10,
//   orderBy: "startTime"
// });

handleClientLoad();

export default gapi;
