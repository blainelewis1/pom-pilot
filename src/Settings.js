import React from "react";
import { Link } from "react-router-dom";
import gapi, { isSignedIn } from "./google";
import {
  Button,
  Modal,
  Paper,
  IconButton,
  InputAdornment,
  Input,
  FormControlLabel,
  Checkbox,
  FormHelperText,
  FormControl,
  Select,
  MenuItem
} from "@material-ui/core";
import styled from "styled-components";
import CloseIcon from "@material-ui/icons/Close";
import {
  setBreakLength,
  setPomLength,
  setNotifications,
  setTimerSound
} from "./actions";
import { connect } from "react-redux";
import { TIMER_SOUNDS } from "./constants";

const CenteredPaper = styled(Paper)`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);

  text-align: center;

  max-width: 600px;
  width: 100%;
  padding: 30px;
`;

const CloseContainer = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  display: inline-block;
`;

function handleAuthClick(event) {
  gapi.auth2.getAuthInstance().signIn();
}

function handleSignoutClick(event) {
  gapi.auth2.getAuthInstance().signOut();
}

//TODO: the google sign in stuff breaks many things, maybe it should go into redux? As it stands it  doesn't update because it's not in the state.

export const Settings = ({
  breakLengthInMinutes,
  pomLengthInMinutes,
  timerSound,
  notifications,
  onSetPomLength,
  onSetBreakLength,
  onSetNotifications,
  onSetTimerSound,
  history
}) => {
  const signedIn = isSignedIn();
  return (
    <div>
      <Modal open onClose={() => history.push("/")}>
        <CenteredPaper>
          <CloseContainer>
            <IconButton aria-label="Settings">
              <Link to="/">
                <CloseIcon color="action" />
              </Link>
            </IconButton>
          </CloseContainer>
          {signedIn ? (
            <Button onClick={handleSignoutClick}>Google Sign out</Button>
          ) : (
            <Button onClick={handleAuthClick}>Authorise Google</Button>
          )}
          <br />
          <Input
            label="Break Length"
            onChange={e => {
              onSetBreakLength(e.target.value);
            }}
            value={breakLengthInMinutes}
            aria-describedby="break-length-helper-text"
            endAdornment={
              <InputAdornment position="end">minutes</InputAdornment>
            }
            inputProps={{
              "aria-label": "Break Length"
            }}
            type="number"
          />
          <br />

          <Input
            label="Pom Length"
            onChange={e => {
              onSetPomLength(e.target.value);
            }}
            value={pomLengthInMinutes}
            aria-describedby="break-length-helper-text"
            endAdornment={
              <InputAdornment position="end">minutes</InputAdornment>
            }
            inputProps={{
              "aria-label": "Break Length"
            }}
            type="number"
          />
          <FormControl error={window.Notification.permission === "denied"}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={notifications}
                  onChange={e => onSetNotifications(e.target.checked)}
                />
              }
              label="Notifications"
            />
            {window.Notification.permission === "denied" && (
              <FormHelperText>
                Notifications are currently denied, you will have to reset them
                in the settings.
              </FormHelperText>
            )}
          </FormControl>

          <FormControl>
            <Select
              value={timerSound}
              onChange={e => {
                onSetTimerSound(e.target.value);
                new Audio(e.target.value).play();
              }}
              displayEmpty
              name="Timer Sound"
            >
              <MenuItem value="" />
              {TIMER_SOUNDS.map(soundUrl => (
                <MenuItem key={soundUrl} value={soundUrl}>
                  {soundUrl}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </CenteredPaper>
      </Modal>
    </div>
  );
};

export default connect(
  ({ settings, google }) => ({ ...settings, ...google }),
  {
    onSetBreakLength: setBreakLength,
    onSetPomLength: setPomLength,
    onSetNotifications: setNotifications,
    onSetTimerSound: setTimerSound
  }
)(Settings);
