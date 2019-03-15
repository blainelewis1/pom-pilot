import React, { Component } from "react";

import { Route } from "react-router-dom";
import Settings from "./Settings";
import TimerInterface from "./TimerInterface";
import Notifier from "./Notifier";

class App extends Component {
  render() {
    return (
      <>
        <Route path="/" component={TimerInterface} />
        <Route path="/settings" component={Settings} />
        <Notifier />
      </>
    );
  }
}

export default App;
