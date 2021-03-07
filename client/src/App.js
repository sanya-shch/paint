import React from 'react';

import SettingBar from "./components/SettingBar";
import Toolbar from "./components/ToolBar";
import Canvas from "./components/Canvas";

import "./style/app.scss"

const App = () => {
  return (
    <div className="app">
      <Toolbar/>
      <SettingBar/>
      <Canvas/>
    </div>
  );
};

export default App;