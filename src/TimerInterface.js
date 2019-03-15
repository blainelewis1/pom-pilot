import React from "react";
import Timer from "./Timer";
import Controls from "./Controls";
import { IconButton } from "@material-ui/core";
import SettingsIcon from "@material-ui/icons/Settings";
import { Link } from "react-router-dom";
import styled from "styled-components";

const SettingsContainer = styled.div`
  position: fixed;
  top: 0;
  right: 0;
`;

export default () => (
  <>
    <SettingsContainer>
      <IconButton aria-label="Settings">
        <Link to="/settings">
          <SettingsIcon color="action" />
        </Link>
      </IconButton>
    </SettingsContainer>
    <Timer />
    <Controls />
  </>
);
