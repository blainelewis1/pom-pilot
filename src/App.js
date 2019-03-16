import React, { Component } from "react";

import { Route } from "react-router-dom";
import Settings from "./Settings";
import TimerInterface from "./TimerInterface";
import Notifier from "./Notifier";

import { IconButton } from "@material-ui/core";
import SettingsIcon from "@material-ui/icons/Settings";
import { Link } from "react-router-dom";
import { TopRight } from "./Layout";

class App extends Component {
  render() {
    return (
      <>
        <TopRight>
          <IconButton aria-label="Settings" component={Link} to="/settings">
            <SettingsIcon color="action" />
          </IconButton>
        </TopRight>
        <Route path="/" component={TimerInterface} />
        <Route path="/settings" component={Settings} />
        <Notifier />
      </>
    );
  }
}

export default App;
