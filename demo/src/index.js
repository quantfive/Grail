import React, {Component} from 'react'
import {render} from 'react-dom'

import GrailTest from '../../src'

class Demo extends Component {
  componentDidMount() {
    this.grailTest = new GrailTest();

    this.grailTest.run();
  }
  render() {
    return <div id='main'>
        <div id='top'>
            <p id='a'> Grail </p>
            <p id='b'> Component </p>
        </div>
        <div id='bottom'>
            <p id='c'> Demo </p>
            <p id='d'> Test </p>
        </div>
    </div>
  }
}

render(<Demo/>, document.querySelector('#demo'))
