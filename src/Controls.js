import { connect } from "react-redux";
import React from "react";
import styled from "styled-components";
import { Button } from "@material-ui/core";
import { setupPreset } from "./actions";
const Container = styled.div`
  position: fixed;
  bottom: 0%;
  left: 50%;
  transform: translate(-50%, -100%);
`;

export const Controls = ({ presets, onSetupPreset }) => {
  console.log(presets);
  return (
    <Container>
      {presets.map(preset => (
        <Button onClick={() => onSetupPreset(preset)}>{preset.type}</Button>
      ))}
    </Container>
  );
};

export default connect(
  ({ settings: { presets } }) => {
    return { presets };
  },
  { onSetupPreset: setupPreset }
)(Controls);
