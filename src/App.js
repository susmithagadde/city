import React from 'react';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import City from "./components/City";
import Validate from "./components/Validate";
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Switch>
            <Route path='/' strict exact component={Validate} />
            <Route path="/email" component={City} />
        </Switch>
      </div>
    </Router>
  );
}

export default App;
