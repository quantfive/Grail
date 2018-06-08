import React, { Component } from 'react';

// NPM Modules
import { StyleSheet, css } from 'aphrodite';
class Indicators extends Component {
  render() {
    return (
      <div className={css(styles.indicatorContainer)}>
        <div 
          className='indicator'
          style={{position: 'absolute', left: '0px', top: '152px', width: '1099px', height: '18px', border: '2px solid green'}}
        >
        </div>
      </div>
    );
  }
}

let styles = StyleSheet.create({
  indicatorContainer: {
    width: '100%',
    height: '100%',
  }
})

export default Indicators;
