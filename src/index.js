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
import timerManager from "./timerManager";

import grey from "@material-ui/core/colors/grey";
import lightBlue from "@material-ui/core/colors/lightBlue";

/** VISUAL */

// TODO: make a logo
// TODO: scrollable modal
// TODO: background image?

/** FUNCTIONAL */

// TODO: add new presets like long break or lunch or whatever...

// TODO: a method of adding new things to redux without clearing local storage, like a deep merge of the default config

// BUG: sometimes if it runs long enough or the tab is open too long you get signed out.

// TODO: add the upcoming event buttonx

// TODO: what if a pom has mutliple objectives? Maybe make it so you can add another one? And it scoops the current one off and adds a new calendar event and everything, but now with just the remaining time.

// TODO: quickly adjust break length / retime somthing with a double click before starting maybe?

// TODO: autocomplete using old events to keep data sanity?

// TODO: animate the previous timer upwards and faded out. Probably the easiest way to do this is by making the timers in the redux state an array and then rendering all of them...

// TODO: "off track" button that logs to google calendar since the last time completed until now that you were off track. Or maybe even just "Back track" where you can label what you did during the last untracked time. maybe timer just automatically picks up the time since the last event? should backtrack go all the way to the last google calendar event or should it go to the last timer? What if there wasn't one?
// TODO: Label backwards at the end of the day, give a bumch of segments to label with either the whole time or add an end time.
// TODO: before you can start a break write what you'll do next?
// TODO: projects would be nice.
// TODO: "routine" presets so I can say [sleep, wakeup, freetime, ...]

// TODO: limit characters to avoid errors when contacting google.
// TODO: keep a list of failed uploads and give people the chance to fix them, lost data seems bad
// TODO: undo event creation by adding a button.
// BUG: google doesn't load fast enough so sometimes events fail to upload

// TODO: Make it an extension so I can pause spotify and youtube.

/** MOBILE */

// BUG: can't construct notification on mobile. This Notification needs a better wrapper
// TODO: improve mobile setting screen etc.
// TODO: use a service worker for push notifications.
// TODO: make it a PWA so it can be added to the home screen and everything

/** MORE DATA */

// TODO: add ability to track location of work by prompting where you are occasionally
// TODO: transparency (whether or not time is blocked.
// TODO: visibility, whether or not other people casn see the event.
// TODO: add meta data to event with some parseable syntax like ```{timesPaused:1}```

const theme = createMuiTheme({
  typography: {
    useNextVariants: true
  },
  palette: {
    primary: grey,
    secondary: lightBlue
  }
});

timerManager();

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
