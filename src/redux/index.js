import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
import ModalReducer from './modals';

export default combineReducers({
  routing: routerReducer,
  modals: ModalReducer,
});
