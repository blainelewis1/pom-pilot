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

// We can use https because we chrome://flags/#allow-insecure-localhost
// And we set https=  in npm start.

// Get an API key here. https://console.developers.google.com/start/api?id=calendar
// FOllow instructions on this page for which one https://developers.google.com/calendar/quickstart/js

// Then create the proper things in the project root .env.development.local

/*
REACT_APP_GOOGLE_API_KEY=
REACT_APP_GOOGLE_CLIENT_ID=
REACT_APP_GOOGLE_SECRET=

*/

// TODO: integrate with spotify

// TODO: I don't love the blue when clicking the initial text field
// TODO: persistence and pickup when laptop is  closed
// TODO: decide when it is appropriate to push to calendar.
// TODO: make a logo
// TODO: keyboard shortcuts
// TODO: Configuration for which calendar.

// TODO: there is currently no way to end the timer, except by clicking away

// TODO: add ability to track location of work by prompting where you are occasionally

// TODO: transparency (whether or not time is blocked.
// TODO: visibility, whether or not other people can see the event.
// TODO: add meta data to event with some parseable syntax like ```{timesPaused:1}```
// TODO: should pausing even be a thing...

// TODO: "off track" button that logs to google calendar since the last time completed until now that you were off track. Or maybe even just "Back track" where you can label what you did during the last untracked time.

// TODO: maybe timer just automatically picks up the time since the last event?

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
