import React from 'react';
import MainPage from './pages/MainPage';
import { Route } from 'react-router-dom';

const App = () => {
  return (
    <Route component={MainPage} path='/' exact />
  )
}

export default App;
