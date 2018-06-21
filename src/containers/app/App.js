import React, { Component } from 'react';

// Components
import SaveControls from '../controls/SaveControls';
import Indicators from '../indicators/Indicators';

class App extends Component {
  render() {
    return (
      <div className="App" id ="grail-app" style={{background: 'transparent'}}>
        <SaveControls id='controls'/>
      </div>
    );
  }
}

export default App;
