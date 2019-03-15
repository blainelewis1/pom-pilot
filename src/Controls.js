import { connect } from "react-redux";
import React from "react";
import styled from "styled-components";
import { Button } from "@material-ui/core";
import { startBreak, startPom, startTimer } from "./actions";
const Container = styled.div`
  position: fixed;
  bottom: 0%;
  left: 50%;
  transform: translate(-50%, -100%);
`;

export const Controls = ({ onStartPom, onStartBreak, onStartTimer }) => {
  return (
    <Container>
      <Button onClick={onStartPom}>Pom</Button>
      <Button onClick={onStartTimer}>Timer</Button>
      <Button onClick={onStartBreak}>Break</Button>
      {/* <Button>Coffee</Button> */}
    </Container>
  );
};

export default connect(
  null,
  { onStartPom: startPom, onStartBreak: startBreak, onStartTimer: startTimer }
)(Controls);
