import React from 'react';
import MainPage from './pages/MainPage';
import GamePage from './pages/GamePage';
import RecordPage from './pages/RecordPage';
import CommunityPage from './pages/CommunityPage';
import { Route, Switch } from 'react-router-dom';
import styled from 'styled-components';

const ErrorPageDiv = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-top: 200px;
  font-size: 50px;
`;


const App = () => {
  return (
    <>
      <Switch>
        <Route component={MainPage} path='/' exact />
        <Route component={GamePage} path='/game/:id' exact />
        <Route component={RecordPage} path='/record' exact />
        <Route component={CommunityPage} path='/community' exact />
        <Route 
          render={({ location }) => (
            <ErrorPageDiv>
              <h1>404 Error</h1>
              <p>요청한 페이지를 찾을 수 없습니다.</p>
            </ErrorPageDiv>
          )}
          />
      </Switch>
    </>
  )
}

export default App;
