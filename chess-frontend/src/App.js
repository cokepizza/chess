import React from 'react';
import MainPage from './pages/MainPage';
import GamePage from './pages/GamePage';
import RecordPage from './pages/RecordPage';
import CommunityPage from './pages/CommunityPage';
import { Route } from 'react-router-dom';

const App = () => {
  return (
    <>
      <Route component={MainPage} path='/' exact />
      <Route component={GamePage} path='/game/:id' exact />
      <Route component={RecordPage} path='/record' exact />
      <Route component={CommunityPage} path='/community' exact />
    </>
  )
}

export default App;
