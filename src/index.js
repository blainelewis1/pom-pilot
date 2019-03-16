import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import * as serviceWorker from "./serviceWorker";
import {
  createMuiTheme,
  MuiThemeProvider,
  IconButton
} from "@material-ui/core";
import { Provider } from "react-redux";
import store from "./configureStore";
import { HashRouter as Router } from "react-router-dom";
import CloseIcon from "@material-ui/icons/Close";
import { SnackbarProvider } from "notistack";

/*
REACT_APP_GOOGLE_API_KEY=
REACT_APP_GOOGLE_CLIENT_ID=
REACT_APP_GOOGLE_SECRET=

*/
/** VISUAL */

// TODO: make a logo
// TODO: I don't love the blue when clicking the initial text field
// TODO: Organise the settings screen properly
// TODO: Background image?

/** FUNCTIONAL */

// TODO: integrate with spotify
// TODO: keyboard shortcuts
// TODO: Configuration for which calendar.

// TODO: "off track" button that logs to google calendar since the last time completed until now that you were off track. Or maybe even just "Back track" where you can label what you did during the last untracked time.

// TODO: maybe timer just automatically picks up the time since the last event?
// TODO: should backtrack go all the way to the last google calendar event or should it go to the last timer? What if there wasn't one?

// TODO: use a service worker for push notifications.
// TODO: add instructions for the BTYOAPIKEY etc.

/** MORE DATA */

// TODO: add ability to track location of work by prompting where you are occasionally
// TODO: transparency (whether or not time is blocked.
// TODO: visibility, whether or not other people casn see the event.
// TODO: add meta data to event with some parseable syntax like ```{timesPaused:1}```

/** BUGS */

// BUG: persisted state doesn't use correct time elapsed.
// BUG: counts down too quickly in first second
// BUG: can't construct notification on mobile. This needs a better wrapper
// BUG: once I fix persisted state not using correct time elapsed then I need to limit when we give notifications...

// TODO: deploy to github

// TODO: first time setup stuff (instructions etc.).
const theme = createMuiTheme({
  typography: {
    useNextVariants: true
  }
});

ReactDOM.render(
  <MuiThemeProvider theme={theme}>
    <Provider store={store}>
      <SnackbarProvider
        action={[
          <IconButton key="close" aria-label="Close" color="inherit">
            <CloseIcon />
          </IconButton>
        ]}
        autoHideDuration={3000}
      >
        <Router>
          <App />
        </Router>
      </SnackbarProvider>
    </Provider>
  </MuiThemeProvider>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
