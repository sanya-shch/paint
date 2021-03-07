import React from "react";
import { BrowserRouter, Switch, Route, Redirect } from "react-router-dom";

import SettingBar from "./components/SettingBar";
import Toolbar from "./components/ToolBar";
import Canvas from "./components/Canvas";

import "./style/app.scss";

const App = () => {
  return (
    <BrowserRouter>
      <div className="app">
        <Switch>
          <Route path="/:id">
            <Toolbar />
            <SettingBar />
            <Canvas />
          </Route>
          <Redirect to={`f${(+new Date()).toString(16)}`} />
        </Switch>
      </div>
    </BrowserRouter>
  );
};

export default App;
