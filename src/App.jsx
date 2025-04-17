import React, { useState, useEffect } from 'react'
import { Outlet, useNavigate } from "react-router-dom";
import Header from './components/Header';

const App = () => {

  return (
    <>
      <Header />
      <Outlet />
    </>
  )
}

export default App
