import React from "react";
import { Link } from "react-router-dom";
import gapi, { isSignedIn } from "./google";
import {
  Button,
  Modal,
  Paper,
  IconButton,
  InputAdornment,
  FormControlLabel,
  FormHelperText,
  FormControl,
  Select,
  MenuItem,
  TextField,
  Typography as TypographyImp,
  Grid,
  Switch,
  InputLabel
} from "@material-ui/core";
import styled from "styled-components";
import CloseIcon from "@material-ui/icons/Close";
import {
  setBreakLength,
  setPomLength,
  setNotifications,
  setTimerSound,
  setGoogleApiKey,
  setGoogleClientId
} from "./actions";
import { connect } from "react-redux";
import { TIMER_SOUNDS } from "./constants";

const CenteredPaper = styled(Paper)`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);

  max-width: 600px;
  width: 100%;
  padding: 30px;
`;

const Typography = styled(TypographyImp)`
  margin-top: 20px;
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
  history,
  breakLengthInMinutes,
  pomLengthInMinutes,
  timerSound,
  notifications,
  googleApiKey,
  googleClientId,
  onSetPomLength,
  onSetBreakLength,
  onSetNotifications,
  onSetTimerSound,
  onSetGoogleApiKey,
  onSetGoogleClientId
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
          <Grid container spacing={8}>
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Google Calendar
                {signedIn ? (
                  <Button color="secondary" onClick={handleSignoutClick}>
                    Sign out
                  </Button>
                ) : (
                  <Button color="primary" onClick={handleAuthClick}>
                    Authorise
                  </Button>
                )}
              </Typography>
              <Grid item>
                <TextField
                  value={googleApiKey}
                  onChange={e => onSetGoogleApiKey(e.target.value)}
                  label={"API Key"}
                  fullWidth
                />
              </Grid>
              <Grid item>
                <br />
                <TextField
                  value={googleClientId}
                  onChange={e => onSetGoogleClientId(e.target.value)}
                  label={"Client ID"}
                  fullWidth
                />
              </Grid>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Timer
              </Typography>

              <Grid item>
                <TextField
                  label="Break Length"
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
              <Grid item>
                <TextField
                  label="Pom Length"
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
                <FormControl fullWidth>
                  <InputLabel shrink htmlFor="age-label-placeholder">
                    Timer Sound
                  </InputLabel>
                  <Select
                    value={timerSound}
                    onChange={e => {
                      onSetTimerSound(e.target.value);
                      new Audio(e.target.value).play();
                    }}
                    displayEmpty
                    name="Timer Sound"
                    fullWidth
                  >
                    <MenuItem value="" />
                    {TIMER_SOUNDS.map(soundUrl => (
                      <MenuItem key={soundUrl} value={soundUrl}>
                        {soundUrl}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item>
                <FormControl
                  error={window.Notification.permission === "denied"}
                >
                  <FormControlLabel
                    control={
                      <Switch
                        checked={notifications}
                        onChange={e => onSetNotifications(e.target.checked)}
                      />
                    }
                    label="Notifications"
                  />
                  {window.Notification.permission === "denied" &&
                    notifications && (
                      <FormHelperText>
                        Notifications are currently denied, you will have to
                        reset them in the settings.
                      </FormHelperText>
                    )}
                </FormControl>
              </Grid>
            </Grid>
          </Grid>
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
    onSetTimerSound: setTimerSound,
    onSetGoogleApiKey: setGoogleApiKey,
    onSetGoogleClientId: setGoogleClientId
  }
)(Settings);
