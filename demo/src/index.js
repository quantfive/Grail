import React, {Component} from 'react'
import {render} from 'react-dom'

import GrailTest from '../../src'

class Demo extends Component {
  componentDidMount() {
    this.grailTest = new GrailTest();

    this.grailTest.run();
  }
  render() {
    return <div id='component'>
      <h1 id='header'>grail-component Demo</h1>
    </div>
  }
}

render(<Demo/>, document.querySelector('#demo'))
