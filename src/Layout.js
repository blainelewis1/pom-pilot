import { Link } from "react-router-dom";
import { Modal, Paper, IconButton } from "@material-ui/core";
import styled from "styled-components";
import CloseIcon from "@material-ui/icons/Close";
import React from "react";

export const CenteredPaper = styled(Paper)`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);

  max-width: 100%;
  width: 600px;
  padding: 30px;
`;
export const TopRight = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  display: inline-block;
`;

export const ClosableModal = ({ children, ...props }) => {
  return (
    <Modal {...props}>
      <CenteredPaper>
        <TopRight>
          <IconButton aria-label="Settings" component={Link} to="/">
            <CloseIcon color="action" />
          </IconButton>
        </TopRight>
        {children}
      </CenteredPaper>
    </Modal>
  );
};
