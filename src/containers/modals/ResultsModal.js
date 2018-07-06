import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

// NPM Modules
import { StyleSheet, css } from 'aphrodite';
import ReactModal from 'react-modal';
import Collapsible from 'react-collapsible';

// Actions
import { ModalActions } from '../../redux/modals';

class ResultsModal extends React.Component {

  /***
  * closes the send funds modal
  */
  closeModal = () => {
    let { modalActions } = this.props;
    modalActions.openResultModal(false);
  }

  render() {
    let { modals } = this.props;

    let frontendErrors = sessionStorage.getItem('grail-frontend-errors');
    let errors = JSON.parse(frontendErrors);
    let frontendDisplay = Object.keys(errors).map((page, index) => {
      let errorMessages = errors[page].map((error, index) => {
        return (
          <Collapsible trigger={
            <div className={css(styles.collapsibleTrigger)}>
              { error['message'] } (in { error['filename'] } at { error['lineno'] })
            </div>
          }>
            <div className={css(styles.errorMessage)} >
              { error['stack'] }
            </div>
          </Collapsible>
        );
      });
      return (
        <div className={css(styles.page)} >
          <Collapsible trigger={
            <div className={css(styles.collapsibleTrigger)}>
              <div className={css(styles.pageLabel)}>
                { page }
              </div>
              <div className={css(styles.errorNumber)}>
                { errorMessages.length } Errors
              </div>
            </div>
          } open={true}>
            { errorMessages }
          </Collapsible>
        </div>
      );
    });

    let backendErrors = sessionStorage.getItem('grail_backend_errors');
    errors = JSON.parse(backendErrors);
    let backendDisplay = errors.map((error, index) => {
      let api = error['api'];
      let data = error['data'];
      let errorMessage = error['error'];

      let dataMethod = data['method'];
      let dataBody = data['body'];
      let dataHeaders = data['headers'];

      let headers = Object.keys(dataHeaders).map((header, index) => {
        return (
          <div className={css(styles.header)} >
            { header } : { dataHeaders[header] }
          </div>
        );
      });
      return (
        <div className={css(styles.errorLabel)} >
          <Collapsible trigger={
            <div className={css(styles.collapsibleTrigger)}>
              <div className={css(styles.dataMethod)} >
                { dataMethod.toUpperCase() } { api }
              </div>
              <div className={css(styles.errorLabel)} >
                { errorMessage }
              </div>
            </div>
          }>
          <div className={css(styles.dataBody)} >
            Body: { dataBody }
          </div>
          { headers ?
            <div className={css(styles.headers)} >
              <Collapsible trigger={
                <div className={css(styles.collapsibleTrigger)}>
                  Headers:
                </div>
              } open={true}>
                { headers }
              </Collapsible>
            </div>
            :
            null
          }
          </Collapsible>
        </div>
      );
    });

    return (
      <ReactModal
        className={css(styles.modal)}
        isOpen={modals.openResultsModal}
        contentLabel="ResultsModal"
        onRequestClose={this.closeModal}
        style={overlayStyles}>
        <div className={css(styles.differenceContainer)}>
          <div className={css(styles.frontendDisplay)}>
            { frontendDisplay }
          </div>
          <div className={css(styles.backendDisplay)}>
            { backendDisplay }
          </div>
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
    borderRadius: 4,
    background: '#fff',
    boxSizing: 'border-box',
    outline: 'none',
    width: '80%',
    transform: 'translate(10%, 10%)',
    position: 'absolute',
    padding: 25,
  },
  errorMessage: {

  },
  errorNumber: {

  },
  pageLabel: {
  },
  modified: {
    margin: '5px 0',
  },
  collapsibleTrigger: {
    //background: '#ddd',
    padding: 10,
    cursor: 'pointer',
    marginBottom: 16,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  collapsibleContent: {
    paddingLeft: 10,
    marginBottom: 16,
  }
});

const mapStateToProps = state => ({
  modals: state.modals,
});

const mapDispatchToProps = (dispatch) => ({
  modalActions: bindActionCreators(ModalActions, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(ResultsModal);
