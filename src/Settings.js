import React from "react";
import gapi from "./google";
import {
  Button,
  InputAdornment,
  FormControlLabel,
  FormHelperText,
  FormControl,
  MenuItem,
  TextField,
  Typography as TypographyImp,
  Grid as GridImp,
  Switch,
  IconButton,
  Tooltip
} from "@material-ui/core";
import HelpIcon from "@material-ui/icons/Help";

import styled from "styled-components";
import {
  setBreakLength,
  setPomLength,
  setNotifications,
  setTimerSound,
  setGoogleClientId,
  setGoogleEnabled
} from "./actions";
import { connect } from "react-redux";
import { TIMER_SOUNDS } from "./constants";
import { ClosableModal } from "./Layout";

const Typography = styled(TypographyImp)`
  margin-top: 20px;
`;

const Grid = styled(GridImp)`
  margin-bottom: 15px !important;
`;

function handleAuthClick(event) {
  gapi.auth2.getAuthInstance().signIn();
}

function handleSignoutClick(event) {
  gapi.auth2.getAuthInstance().signOut();
}

//TODO: the google sign in stuff breaks many things, maybe it should go into redux? As it stands it  doesn't update because it's not in the state.

export const Settings = ({
  history,
  breakLengthInMinutes,
  pomLengthInMinutes,
  timerSound,
  notifications,
  googleClientId,
  googleEnabled,
  googleSignedIn,
  onSetGoogleEnabled,
  onSetPomLength,
  onSetBreakLength,
  onSetNotifications,
  onSetTimerSound,
  onSetGoogleClientId
}) => {
  return (
    <ClosableModal open onClose={() => history.push("/")}>
      <Grid container spacing={8}>
        <Grid item xs={12}>
          <Typography variant="h6" gutterBottom>
            Google Calendar
            <Switch
              variant="outlined"
              checked={googleEnabled}
              onChange={e => onSetGoogleEnabled(e.target.checked)}
            />
          </Typography>
          {googleEnabled && (
            <>
              <Grid container spacing={8}>
                <Grid item xs={11}>
                  <TextField
                    variant="outlined"
                    value={googleClientId}
                    onChange={e => onSetGoogleClientId(e.target.value)}
                    label={"Client ID"}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={1}>
                  <Tooltip title="In order to use the google calendar integration you must generate your own client id. It should be restricted to just this URL. Setup should be for javascript in the browser, accessing user data.">
                    <IconButton>
                      <HelpIcon />
                    </IconButton>
                  </Tooltip>
                </Grid>
              </Grid>

              <Grid item xs={12}>
                {googleSignedIn ? (
                  <Button color="secondary" onClick={handleSignoutClick}>
                    Sign out
                  </Button>
                ) : (
                  <Button color="primary" onClick={handleAuthClick}>
                    Authorise
                  </Button>
                )}
                <Button
                  color="secondary"
                  target="_blank"
                  href="https://console.developers.google.com/start/api?id=calendar"
                >
                  Generate client id
                </Button>
              </Grid>
            </>
          )}
        </Grid>
        <Grid item xs={12}>
          <Typography variant="h6" gutterBottom>
            Timer
          </Typography>

          <Grid item md={6} xs={12}>
            <TextField
              label="Break Length"
              variant="outlined"
              onChange={e => {
                onSetBreakLength(e.target.value);
              }}
              value={breakLengthInMinutes}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">minutes</InputAdornment>
                )
              }}
              type="number"
              fullWidth
            />
          </Grid>
          <Grid item md={6} xs={12}>
            <TextField
              label="Pom Length"
              variant="outlined"
              onChange={e => {
                onSetPomLength(e.target.value);
              }}
              value={pomLengthInMinutes}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">minutes</InputAdornment>
                )
              }}
              type="number"
              fullWidth
            />
          </Grid>
          <Grid item>
            <TextField
              select
              label="Select"
              value={timerSound}
              onChange={e => {
                onSetTimerSound(e.target.value);
                new Audio(e.target.value).play();
              }}
              margin="normal"
              variant="outlined"
              fullWidth
            >
              <MenuItem value="" />
              {TIMER_SOUNDS.map(soundUrl => (
                <MenuItem key={soundUrl} value={soundUrl}>
                  {soundUrl}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item>
            <FormControl error={window.Notification.permission === "denied"}>
              <FormControlLabel
                control={
                  <Switch
                    variant="outlined"
                    checked={notifications}
                    onChange={e => onSetNotifications(e.target.checked)}
                  />
                }
                label="Notifications"
              />
              {window.Notification.permission === "denied" && notifications && (
                <FormHelperText>
                  Notifications are currently denied, you will have to reset
                  them in the settings.
                </FormHelperText>
              )}
            </FormControl>
          </Grid>
        </Grid>
      </Grid>
    </ClosableModal>
  );
};

export default connect(
  ({ settings, google }) => ({ ...settings, ...google }),
  {
    onSetBreakLength: setBreakLength,
    onSetPomLength: setPomLength,
    onSetNotifications: setNotifications,
    onSetTimerSound: setTimerSound,
    onSetGoogleClientId: setGoogleClientId,
    onSetGoogleEnabled: setGoogleEnabled
  }
)(Settings);
