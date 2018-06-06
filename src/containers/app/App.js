import React, { Component } from 'react';

// Components
import SaveControls from '../controls/SaveControls';

class App extends Component {
  render() {
    return (
      <div className="App" id ='app'style={{background: 'transparent'}}>
        <SaveControls id='controls'/>
      </div>
    );
  }
}

export default App;
