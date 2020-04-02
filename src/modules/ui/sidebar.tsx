import React from 'react';
import styled from '@emotion/styled';


const SideBar = styled.div`
  width: 150px;
  display: flex;
  padding: 10px;
  flex-direction: column;
  background-color: rgb(50, 50, 50) !important;
  border-right: solid 2px rgb(100, 100, 100);
`;

const Button = styled.button`
  padding: 3px 5px;
  margin: 3px 0px;
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

export default () => (
  <SideBar>
    <Button>Generate Code</Button>
    <Button>Provision</Button>
  </SideBar>
);
