import {createStore} from 'redux'
import rootReducer from './reducers/reducer'
import { composeWithDevTools } from 'redux-devtools-extension';

// const store = createStore(rootReducer)
const store = createStore(rootReducer, composeWithDevTools());

export default store