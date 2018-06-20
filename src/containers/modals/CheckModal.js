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
      differences: [],
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
    let differenceMessages = []
    let difference = {added: [], modified: [], removed: []}
    for (let i = 0; i < differences.length; i++) {
      for (let j = 0; j < differences[i].added.length; j++) {
        difference.added.push({html: differences[i].added[j].html})
      }
      
      for (let j = 0; j < differences[i].modified.length; j++) {
        let changes = {changes: []}
        for (let k = 0; k < differences[i].modified[j].changes.length; k++) {
          let change = differences[i].modified[j].changes[k]
          changes.changes.push(`The ${change.attribute} of element "${differences[i].modified[j].id ? differences[i].modified[j].id : differences[i].modified[j].order}" has changed from "${change.old_value}" to "${change.new_value}" `)
        }
        difference.modified.push(changes)
      }

      differenceMessages.push(difference)
      // for (let i = 0; i < differences.removed.length; i++) {
      // }
    }

    this.setState({
      differences: differenceMessages
    })
  }

  render() {
    console.log(this.state.differences)
    let { modals, grail } = this.props;
    let differences = this.state.differences.map((difference, index) => {
      let added = difference.added.map((added, index) => {
        return added
      })
      let modified = difference.modified.map((modified, index) => {
        return modified
      })
      let removed = difference.removed.map((removed, index) => {
        return removed
      })
      return (
        <div>
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
