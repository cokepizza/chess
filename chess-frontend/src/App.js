import React from 'react';
import MainPage from './pages/MainPage';
import GamePage from './pages/GamePage';
import RecordPage from './pages/RecordPage';
import { Route } from 'react-router-dom';

const App = () => {
  return (
    <>
      <Route component={MainPage} path='/' exact />
      <Route component={GamePage} path='/game' exact />
      <Route component={RecordPage} path='/record' exact />
    </>
  )
}

export default App;
