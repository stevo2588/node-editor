import React from 'react';
import styled from '@emotion/styled';


const SideBar = styled.div<{ open: boolean }>`
  width: 150px;
  height: 100%;
  overflow-x: hidden;
  display: flex;
  padding: 10px;
  position: fixed;
  top: 62px;
  right: 0;
  z-index: 1;
  margin-right: ${p => p.open ? '0px' : '-170px'};
  flex-direction: column;
  background-color: rgb(50, 50, 50) !important;
  border-left: solid 2px rgb(100,100,100);
  transition: 0.5s;
  transition-timing-function: ease-out;
`;

const Button = styled.button`
  padding: 3px 5px;
  margin: 3px 3px;
  display: inline-block;
  color: white;
  background-color: transparent;
  font-size: 1em;
  border: 1px solid white;
  border-radius: 3px;
  display: block;
  &:hover {
    background: rgba(255, 255, 255, 0.1);
  }
  &:active {
    border: solid 1px black;
    background: rgba(255, 255, 255, 0.1);
    color: black;
  }
`;

export default ({ open, activeNodes }: { open: boolean, activeNodes: any }) => (
  <SideBar open={open}>
    <Button>Stuff</Button>
    <div>
      {JSON.stringify(activeNodes)}
    </div>
  </SideBar>
);
