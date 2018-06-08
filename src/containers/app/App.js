import React, { Component } from 'react';

// Components
import SaveControls from '../controls/SaveControls';
import Indicators from '../indicators/Indicators';
import CheckModal from '../modals/CheckModal';

class App extends Component {
  render() {
    return (
      <div className="App" id ='app'style={{background: 'transparent'}}>
        <SaveControls id='controls'/>
        <Indicators />
        <CheckModal />
      </div>
    );
  }
}

export default App;
