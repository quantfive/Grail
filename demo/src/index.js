import React, {Component} from 'react'
import {render} from 'react-dom'

import GrailTest from '../../src'

class Demo extends Component {
  componentDidMount() {
    this.grailTest = new GrailTest();

    this.grailTest.run();
  }

  onClick = (word) => {
    console.log(word)
  }
  render() {
    return <div id='main'>
        <div id='top'>
            <div onClick={() => this.onClick('CLICK')}>
              <p id='a' onMouseOver={() => this.onClick('MOSUE OVER')}> Grail </p>
            </div>
            <p id='b' onClick={() => this.onClick('TAP')}> Component </p>
        </div>
        <div id='bottom' onClick={() => this.onClick('WOW')}>
            <p id='c' onClick={() => this.onClick('HEHE')}> Demo </p>
            <p id='d' onMouseEnter={() => this.onClick('MOSUE OVER')}> Test </p>
        </div>
    </div>
  }
}

render(<Demo id='demo'/>, document.querySelector('#demo'))
