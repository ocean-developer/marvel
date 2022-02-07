import React from 'react';
import {BrowserRouter, Route, Switch, Redirect} from "react-router-dom";
import MainLayout from 'layouts/MainLayout.js';
import './App.css';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <BrowserRouter>
    <Switch>
        {/* add routes with layouts */}
        <Route path="/" component={MainLayout}/>
        <Redirect from="*" to="/"/>
    </Switch>
    </BrowserRouter>
  );
}

export default App;
