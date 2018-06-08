import React from 'react';
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
    }
  }

  /***
  * closes the send funds modal
  */
  closeModal = () => {
    let { modalActions } = this.props;
    modalActions.openCheckModal(false);
  }

  render() {
    let { modals, grail } = this.props;
    let added = grail.differences.added.map((difference, index) => {
      return (
        <div className={css(styles.added)}>
          Things were added
        </div>
      )
    })
    let modified = grail.differences.modified.map((difference, index) => {
      return (
        <div className={css(styles.modified)}>
          Things changed
        </div>
      )
    })
    let removed = grail.differences.removed.map((difference, index) => {
      return (
        <div className={css(styles.modified)}>
          Things were removed
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
          {added}
          {modified}
          {removed}
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
  },
});

const mapStateToProps = state => ({
  modals: state.modals,
  grail: state.grail,
});

const mapDispatchToProps = (dispatch) => ({
  modalActions: bindActionCreators(ModalActions, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(CheckModal);
