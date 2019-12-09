import React from 'react';
import MainPage from './pages/MainPage';
import ChatPage from './pages/ChatPage';
import { Route } from 'react-router-dom';

const App = () => {
  return (
    <>
      <Route component={MainPage} path='/' exact />
      <Route component={ChatPage} path='/chat' exact />
    </>
  )
}

export default App;
