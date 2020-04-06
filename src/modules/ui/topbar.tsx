import React from 'react';
import styled from '@emotion/styled';


const TopBar = styled.div`
  height: 40px;
  width: 100%;
  display: flex;
  position: fixed;
  top: 0;
  z-index: 1;
  padding: 10px;
  flex-direction: row;
  justify-content: flex-start;
  background-color: rgb(50, 50, 50) !important;
  border-bottom: solid 2px rgb(100,100,100);
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

export default ({ saveStatus }: { saveStatus: string }) => (
  <TopBar>
    <Button>Generate Code</Button>
    <Button>Provision</Button>
    <p>Save status: {saveStatus}</p>
  </TopBar>
);
