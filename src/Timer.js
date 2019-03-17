import React, { useState, useEffect } from "react";
import { Typography, TextField } from "@material-ui/core";
import { MILLISECONDS_IN_A_MINUTE } from "./constants";
import { connect } from "react-redux";
import { useInterval } from "./utils";
import { setPurpose } from "./actions";
import styled from "styled-components";

const Container = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);

  text-align: center;

  max-width: 600px;
  width: 100%;
`;

const Purpose = styled.div`
  margin-top: 30px;
`;

const PurposeTextField = styled(TextField)`
  & textarea {
    color: rgba(0, 0, 0, 0.87);
    font-size: 3.75rem;
    font-family: "Roboto", "Helvetica", "Arial", sans-serif;
    font-weight: 300;
    line-height: 1;
    letter-spacing: -0.00833em;
    text-align: center;
    padding-top: 6px;
    padding-right: 0px;
    padding-bottom: 7px;
    padding-left: 0px;
  }
`;

//create your forceUpdate hook
function useForceUpdate() {
  const [value, set] = useState(true); //boolean state
  return () => set(!value); // toggle the state to force render
}

// TODO: maybe the timer bit should actually exist outside of the component?
export const Timer = ({
  purpose,
  startedAt,
  completedAt,
  length,
  onSetPurpose
}) => {
  let interval = 100;

  let timerStarted = startedAt && completedAt;
  let timerComplete = Date.now() >= completedAt;
  let actionStarted = startedAt && !length;
  let forceUpdate = useForceUpdate();

  useInterval(
    () => forceUpdate(),
    (timerStarted && !timerComplete) || actionStarted ? interval : null
  );

  // useShortcut(({ key }) => key === "Enter", onInvertPlayState);

  let [p, setPurpose] = useState(purpose);
  // This is a neat way to reset the internal purpose state whenever the external one changes.
  useEffect(() => setPurpose(purpose), [purpose]);

  let displayTime;

  if (timerStarted) {
    displayTime = completedAt - Date.now();
  } else if (actionStarted) {
    displayTime = Date.now() - startedAt;
  } else {
    displayTime = length;
  }

  displayTime = Math.max(0, displayTime);

  let minutes = Math.floor(displayTime / MILLISECONDS_IN_A_MINUTE);
  let seconds = Math.floor((displayTime % MILLISECONDS_IN_A_MINUTE) / 1000);
  let timeString = `${minutes}:${seconds.toString().padStart(2, "0")}`;

  document.title = `(${timeString}) ${purpose} | Pom Pilot`;

  return (
    <Container>
      <Typography variant="h1">{timeString}</Typography>
      <Purpose>
        {!purpose ? (
          <PurposeTextField
            autoFocus
            fullWidth
            multiline
            // InputLabelProps={{
            //   shrink: true
            // }}
            // rows={2}
            placeholder="What are you doing?"
            onChange={e => {
              setPurpose(e.target.value);
            }}
            onKeyPress={e => {
              if (e.key === "Enter") {
                e.preventDefault();
                onSetPurpose(p);
              }
            }}
            value={p}
          />
        ) : (
          <Typography variant="h2">{purpose}</Typography>
        )}
      </Purpose>
    </Container>
  );
};

export default connect(
  ({ timer }) => timer,
  {
    onSetPurpose: setPurpose
  }
)(Timer);
