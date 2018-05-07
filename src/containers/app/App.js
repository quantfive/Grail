import React, { Component } from 'react';

// Components
import SaveControls from '../controls/SaveControls';

class App extends Component {
  render() {
    return (
      <div className="App" style={{background: 'transparent'}}>
        <SaveControls />
      </div>
    );
  }
}

export default App;
