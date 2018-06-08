import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
import GrailReducer from './grail';
import ModalReducer from './modals';

export default combineReducers({
  routing: routerReducer,
  grail: GrailReducer,
  modals: ModalReducer,
});
