import { combineReducers } from 'redux'
import locationReducer from './location'

const counterReducer = require('../routes/Counter/modules/counter').default


export const makeRootReducer = (asyncReducers) => {
  return combineReducers({
    location: locationReducer,
    app: counterReducer,
    ...asyncReducers
  })
}

export const injectReducer = (store, { key, reducer }) => {
  if (Object.hasOwnProperty.call(store.asyncReducers, key)) return

  store.asyncReducers[key] = reducer
  store.replaceReducer(makeRootReducer(store.asyncReducers))
}

export default makeRootReducer
