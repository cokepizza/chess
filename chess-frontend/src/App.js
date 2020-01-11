import React from 'react';
import MainPage from './pages/MainPage';
import GamePlayPage from './pages/GamePlayPage';
import CommunityPage from './pages/CommunityPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
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
        <Route component={LoginPage} path='/login' exact />
        <Route component={RegisterPage} path='/register' exact />
        <Route component={GamePlayPage} path='/game/:id' exact />
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
