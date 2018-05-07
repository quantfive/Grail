import React, {Component} from 'react'
import {render} from 'react-dom'

import GrailTest from '../../src'

class Demo extends Component {
  componentDidMount() {
    this.grailTest = new GrailTest();

    this.grailTest.run();
  }
  render() {
    return <div>
      <h1>grail-component Demo</h1>
    </div>
  }
}

render(<Demo/>, document.querySelector('#demo'))
