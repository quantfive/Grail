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
    sessionStorage.clear();
    modalActions.openResultsModal(false);
  }

  render() {
    let { modals } = this.props;

    let frontendErrors = sessionStorage.getItem('grail-frontend-errors');
    frontendErrors = JSON.parse(frontendErrors);
    let frontendDisplay = Object.keys(frontendErrors).map((page, index) => {
      let errorMessages = frontendErrors[page].map((error, index) => {
        return (
          <Collapsible trigger={
            <div className={css(styles.collapsibleTrigger, styles.errorCollapsible)}>
              { error['message'] } (in { error['filename'] }: { error['lineno'] })
            </div>
          }>
            <div className={css(styles.errorMessage)}>
              <code>
                { error['stack'] }
              </code>
            </div>
          </Collapsible>
        );
      });
      return (
        <div className={css(styles.page)}>
          <Collapsible
            trigger={
              <div className={css(styles.collapsibleTrigger)}>
                <div className={css(styles.pageLabel)}>
                  { page }
                </div>
                <div className={css(styles.errorNumber)}>
                  { errorMessages.length } Errors
                </div>
              </div>
            }>
            <div className={css(styles.collapsibleContent)}>
              { errorMessages }
            </div>
          </Collapsible>
        </div>
      );
    });

    let backendErrors = sessionStorage.getItem('grail_backend_errors');
    backendErrors = JSON.parse(backendErrors);
    let backendDisplay = Object.keys(backendErrors).map((page, index) => {
      let errorMessages = backendErrors[page].map((error, index) => {
        let api = error['api'];
        let errorMessage = error['error'];
        let data = error['data'];

        let dataMethod = '';
        let dataBody = '';
        let dataHeaders = null;
        let headers = null;
        if (data) {
          dataMethod = data['method'];
          dataBody = data['body'];
          dataHeaders = data['headers'];

          headers = Object.keys(dataHeaders).map((header, index) => {
            return (
              <div className={css(styles.header)} >
                { header } : { dataHeaders[header] }
              </div>
            );
          });
        }

        return (
          <div className={css(styles.errorLabel)} >
            <Collapsible
              trigger={
                <div className={css(styles.collapsibleTrigger)}>
                  <div className={css(styles.dataMethod)} >
                    { dataMethod.toUpperCase() } { api }
                  </div>
                  <div className={css(styles.errorLabel)} >
                    { errorMessage }
                  </div>
                </div>
              }>
              <div className={css(styles.collapsibleContent)}>
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
              </div>
            </Collapsible>
          </div>
        );
      });
      return (
        <div className={css(styles.page)}>
          <Collapsible
            trigger={
              <div className={css(styles.collapsibleTrigger)}>
                <div className={css(styles.pageLabel)}>
                  { page }
                </div>
                <div className={css(styles.errorNumber)}>
                  { errorMessages.length } Errors
                </div>
              </div>
            }>
            <div className={css(styles.collapsibleContent)}>
              { errorMessages }
            </div>
          </Collapsible>
        </div>
      );
    });

    let errorCount = 0;
    for (let key in frontendErrors) {
      errorCount += frontendErrors[key].length
    }
    for (let key in backendErrors) {
      errorCount += backendErrors[key].length
    }

    return (
      <ReactModal
        className={css(styles.modal)}
        isOpen={modals.openResultsModal}
        contentLabel="ResultsModal"
        onRequestClose={this.closeModal}
        style={overlayStyles}>
        <div className={css(styles.info)}>
          <div className={css(styles.close)} onClick={this.closeModal}>
            ×
          </div>
          <div className={css(styles.grailHeader)}>
            Grail Found { errorCount } errors
          </div>
          <div className={css(styles.differenceContainer)}>
            <div className={css(styles.frontendDisplay)}>
              <div className={css(styles.frontendHeaders)}>
                Frontend Errors
              </div>
              { frontendDisplay }
            </div>
            <div className={css(styles.backendDisplay)}>
              <div className={css(styles.frontendHeaders)}>
                Network Errors
              </div>
              { backendDisplay }
            </div>
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
    alignItems: 'center',
    borderRadius: 4,
    background: '#fff',
    boxSizing: 'border-box',
    outline: 'none',
    width: '100%',
    height: '100%',
    padding: 25,
  },
  differenceContainer: {
    width: '100%',
    height: '100%',
    overflow: 'auto',
  },
  info: {
    maxWidth: 1024,
    width: '100%',
    height: '100%',
    position: 'relative',
  },
  grailHeader: {
    color: 'rgb(206, 17, 38)',
    letterSpacing: .7,
    fontSize: 24,
    marginBottom: 16,
  },
  errorMessage: {
    whiteSpace: 'pre',
    marginLeft: 30,
    padding: 12,
    background: 'rgba(206, 17, 38, 0.05)',
    overflow: 'auto',
  },
  frontendHeaders: {
    borderBottom: '3px solid',
    fontSize: 18,
    letterSpacing: .7,
  },
  errorNumber: {
    marginLeft: 16,
    color: 'rgb(206, 17, 38)',
  },
  errorCollapsible: {
    boxShadow: 'rgba(85, 37, 131, 0.39) 0px 3px 10px 0px',
    padding: 12,
    width: '95%',
    borderRadius: 4,
  },
  pageLabel: {
  },
  modified: {
    margin: '5px 0',
  },
  collapsibleTrigger: {
    cursor: 'pointer',
    marginBottom: 8,
    marginTop: 8,
    display: 'flex',
    flexDirection: 'row',
  },
  backendDisplay: {
    marginTop: 16,
  },
  collapsibleContent: {
    marginLeft: 30,
  },
  collapsibleContent: {
    paddingLeft: 10,
    marginBottom: 16,
  },
  close: {
    position: 'absolute',
    fontSize: 26,
    padding: 16,
    right: -16,
    cursor: 'pointer',
  },
});

const mapStateToProps = state => ({
  modals: state.modals,
});

const mapDispatchToProps = (dispatch) => ({
  modalActions: bindActionCreators(ModalActions, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(ResultsModal);
