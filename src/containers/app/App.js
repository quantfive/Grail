import React, { Component } from 'react';

// Components
import SaveControls from '../controls/SaveControls';
import Indicators from '../indicators/Indicators';
import CheckModal from '../modals/CheckModal';

class App extends Component {
  componentDidMount() {
    document.addEventListener('mousemove', this.recordMouseEvents, false);
    document.addEventListener('click', this.recordMouseEvents, false)
  }

  recordMouseEvents = (e) => {
    if (e.type === 'click') {
      //console.log(e)
      //console.log(`Click event occured at (x: ${e.clientX} y: ${e.clientY})`)
    } else if (e.type === 'mousemove') {
      //console.log(`Current Mouse Position: (x: ${e.clientX} y: ${e.clientY})`)
    }
  }
  render() {
    return (
      <div className="App" id ='app'style={{background: 'transparent'}}>
        <SaveControls id='controls'/>
        <CheckModal />
      </div>
    );
  }
}

export default App;
