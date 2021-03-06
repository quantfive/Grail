import React, {Component} from 'react'
import { BrowserRouter as Router,
  Route,
  Link 
} from 'react-router-dom'
import {render} from 'react-dom'

// Testing axios
import axios from 'axios';

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

  testFetch2 = () => {
    fetch(API.NIFFY, API.POST_CONFIG())
    .then(Helpers.checkStatus)
    .then(Helpers.parseJSON)
    .then((res) => {
      console.log(res);
    })

    // let res = fetch(API.CHECK_READY, API.POST_CONFIG({test: null}))
    // .then(Helpers.checkStatus)
    // .then(Helpers.parseJSON)
    // .then(json => {
    //   console.log(json);
    // });
  }

  xmlFetch = () => {
    let req = new XMLHttpRequest();
    req.open('POST', API.CHECK_READY);
    req.send();
  }

  axiosRequest = () => {
    let api = ''
    api = 'https://jsonplaceholder.typicode.com/posts/1';
    api = API.NIFFY;
    axios.post(api)
      .then(res => {
        console.log('AXIOS');
        console.log(res.data.body);
      });
  }

  newWindow = (event) => {
    debugger;
    window.open('www.google.com','_blank');
  }

  throwError = () => {
    throw new Error('new error');
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
        <button onClick={() => this.testFetch2()}> Error Fetch </button>
        <button onClick={() => this.testFetch('WEBPAGE FETCH CALL')}> Fetch </button>
        <button id='throw' onClick={this.throwError}> Throw Error </button>
        <div style={{opacity: 0.2}}> Styles </div>
        <button onClick={this.xmlFetch}> XML </button>
        <button onClick={this.axiosRequest}> Axios </button>
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
