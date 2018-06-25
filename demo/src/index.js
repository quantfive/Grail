import React, {Component} from 'react'
import { BrowserRouter as Router,
  Route,
  Link 
} from 'react-router-dom'
import {render} from 'react-dom'

import GrailTest from '../../src'

import API from '../../src/config/api';
import Helpers from '../../src/config/helpers';

class Demo extends Component {
  constructor(props) {
    super(props);

    this.state = {
      show: false,
      fetchResults: '',
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
      this.setState({
        fetchResults: res.title,
      });
      console.log(res)
    })
  }

  newPage = () => (
    <div>
      <h2>page</h2>
    </div>
  )

  newPage2 = () => (
    <div>
      <h2>page2</h2>
      <li><Link to="/newpage3">New Page 3 </Link></li>

      <Route exact path="/newpage3" component={this.newPage3}/>
    </div>
  )

  newPage3 = () => (
    <div>
      <h2>Something happened</h2>
    </div>
  )

  render() {
    return <Router>
    <div id='main'>
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
        <div id="fetch-results">
          {this.state.fetchResults
            ? this.state.fetchResults
            : null
          }
        </div>
        <div id='new_page'>
          <li><Link to="/newpage">New Page</Link></li>
          <li><Link to="/newpage2">New Page 2 </Link></li>
        </div>

        <Route exact path="/newpage" component={this.newPage}/>
        <Route exact path="/newpage2" component={this.newPage2}/>
        <Route exact path="/newpage3" component={this.newPage3}/>
    </div>
    </Router>
  }
}

render(<Demo id='demo'/>, document.querySelector('#demo'))
