import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

// NPM Modules
import { StyleSheet, css } from 'aphrodite';
import ReactModal from 'react-modal';

// Actions
import { ModalActions } from '../../redux/modals';

class CheckModal extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      login: true,
      differences: {
        added: [],
        modified: [],
        removed: []
      },
    }
  }

  /***
  * closes the send funds modal
  */
  closeModal = () => {
    let { modalActions } = this.props;
    modalActions.openCheckModal(false);
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.grail.differences !== nextProps.grail.differences) {
      this.parseDifference(nextProps.grail.differences)
    }
  }

  parseDifference = (differences) => {
    let differenceMessages = {added: [], modified: [], removed: []}
    
    for (let i = 0; i < differences.added.length; i++) {
      differenceMessages.added.push({html: differences.added[i].html})
    }
    
    for (let i = 0; i < differences.modified.length; i++) {
      let changes = {changes: []}
      for (let j = 0; j < differences.modified[i].changes.length; j++) {
        let change = differences.modified[i].changes[j]
        changes.changes.push(`The ${change.attribute} of element "${differences.modified[i].id ? differences.modified[i].id : differences.modified[i].order}" has changed from "${change.old_value}" to "${change.new_value}" `)
      }
      differenceMessages.modified.push(changes)
    }

    for (let i = 0; i < differences.removed.length; i++) {
    }

    this.setState({
      differences: {...differenceMessages}
    })
  }

  render() {
    let { modals, grail } = this.props;
    let added = this.state.differences.added.map((difference, index) => {
      return (
        <div className={css(styles.added)}>
          {difference.html}
        </div>
      )
    })
    let modified = this.state.differences.modified.map((difference, index) => {
      let changes = difference.changes.map((change, index) => {
        return (
          <div className={css(styles.modified)}>
            {change}
          </div>
        )
      })
      return (
        <div>
          {changes}
        </div>
      )
    })
    let removed = this.state.differences.removed.map((difference, index) => {
      return (
        <div className={css(styles.removed)}>
          HELLO
        </div>
      )
    })
    return (
      <ReactModal
        className={css(styles.modal)}
        isOpen={modals.openCheckModal}
        contentLabel="CheckModal"
        onRequestClose={this.closeModal}
        style={overlayStyles}>
        <div className={css(styles.differenceContainer)}>
          <h3>Added</h3>
          {added.length !== 0
            ? added
            : 'No additions found'
          }
          <h3>Modified</h3>
          {modified.length !== 0
            ? modified
            : 'No modifications found'
          }
          <h3>Removed</h3>
          {removed.length !== 0
            ? removed
            : 'No removals found'
          }
        </div>
      </ReactModal>
    );
  }
}

var overlayStyles = {
  overlay : {
    position          : 'fixed',
    top               : 0,
    left              : 0,
    right             : 0,
    bottom            : 0,
    backgroundColor   : 'rgba(0, 0, 0, 0.75)',
    zIndex: '2',
  },
}

var styles = StyleSheet.create({
  modal: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    borderRadius: '4px',
    background: '#fff',
    boxSizing: 'border-box',
    outline: 'none',
    position: 'absolute',
    left: '50%',
    top: '50%',
    padding: '25px',
    transform: 'translate(-50%, -50%)',
    width: '700px',
  },
  modified: {
    margin: '5px 0',
  }
});

const mapStateToProps = state => ({
  modals: state.modals,
  grail: state.grail,
});

const mapDispatchToProps = (dispatch) => ({
  modalActions: bindActionCreators(ModalActions, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(CheckModal);
