import React, {Component} from 'react'
import {render} from 'react-dom'

import GrailTest from '../../src'

import API from '../../src/config/api';
import Helpers from '../../src/config/helpers';

class Demo extends Component {
  constructor(props) {
    super(props);

    this.state = {
      show: false,
    }
  }
  componentDidMount() {
    this.grailTest = new GrailTest();

    this.grailTest.run();
  }

  onClick = (word) => {
    console.log(word)
  }

  testFetch = (word) => {
    fetch('https://jsonplaceholder.typicode.com/posts/1', API.GET_CONFIG())
    .then(Helpers.checkStatus)
    .then(Helpers.parseJSON)
    .then((res) => {
      console.log(res)
    })
  }

  render() {
    return <div id='main'>
        <div id='top'>
            <div onClick={() => this.onClick('CLICK')}>
              <p id='a' onClick={() => this.setState({show: false})}> Grail </p>
            </div>
            <p id='b' onClick={() => this.setState({show: true})}> Component </p>
        </div>
        <div id='bottom' onClick={() => this.onClick('WOW')}>
            <p id='c' onClick={() => this.onClick('HEHE')}> Demo </p>
            <p id='d' onMouseEnter={() => this.onClick('MOSUE OVER')}> Test </p>
        </div>
        <button onClick={() => this.testFetch('WEBPAGE FETCH CALL')}> Fetch </button>
        {this.state.show && <div id="bamba"> NEW THING HERE YO! </div>}
    </div>
  }
}

render(<Demo id='demo'/>, document.querySelector('#demo'))
