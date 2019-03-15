import React from "react";
import { Typography, TextField } from "@material-ui/core";
import { MILLISECONDS_IN_A_MINUTE } from "./constants";
import { connect } from "react-redux";
import { useInterval, useShortcut } from "./utils";
import { invertPlayState, setPurpose, reduceTime } from "./actions";
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

// BUG: if you click pause at 500ms until 0 it will say 0 but not actually be 0
export const Timer = ({
  purpose,
  firstPlay,
  timeRemaining,
  playing,
  onReduceTime,
  onInvertPlayState,
  onSetPurpose
}) => {
  let interval = 100;

  useInterval(onReduceTime, playing ? interval : null);
  useShortcut(({ key }) => key === "Enter", onInvertPlayState);

  let minutes = Math.floor(timeRemaining / MILLISECONDS_IN_A_MINUTE);
  let seconds = Math.floor((timeRemaining % MILLISECONDS_IN_A_MINUTE) / 1000);
  let timeString = `${minutes}:${seconds.toString().padStart(2, "0")}`;

  document.title = `(${timeString}) ${purpose} | Pomodoro App`;

  return (
    <Container>
      <Typography variant="h1" onClick={onInvertPlayState}>
        {timeString}
      </Typography>
      <Purpose>
        {!firstPlay ? (
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
              onSetPurpose(e.target.value);
            }}
            onKeyPress={e => {
              if (e.key === "Enter") {
                e.preventDefault();
              }
            }}
            value={purpose}
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
    onInvertPlayState: invertPlayState,
    onSetPurpose: setPurpose,
    onReduceTime: reduceTime
  }
)(Timer);
