import { connect } from "react-redux";
import React from "react";
import styled from "styled-components";
import { Button } from "@material-ui/core";
import { startBreak, startPom, startAction } from "./actions";
const Container = styled.div`
  position: fixed;
  bottom: 0%;
  left: 50%;
  transform: translate(-50%, -100%);
`;

export const Controls = ({ onStartPom, onStartBreak, onStartAction }) => {
  return (
    <Container>
      <Button onClick={onStartPom}>Pom</Button>
      <Button onClick={onStartAction}>Action</Button>
      <Button onClick={onStartBreak}>Break</Button>
      {/* <Button>Coffee</Button> */}
    </Container>
  );
};

export default connect(
  null,
  { onStartPom: startPom, onStartBreak: startBreak, onStartAction: startAction }
)(Controls);
