import {applyMiddleware, compose, createStore} from 'redux'
import thunk from 'redux-thunk'
import {browserHistory} from 'react-router'
import makeRootReducer from './reducers'
import {updateLocation} from './location'
import Horizon from '@horizon/client'
import {
  SUBMIT_MATCH,
  REFRESH_MATCHES,
  REFRESH_PLAYERS
} from '../routes/Counter/modules/counter'

export default (initialState = {}) => {

  // DB!
  const horizon = Horizon({host: 'admin002.spotx.belfast.lod:8181'})
  horizon.connect()
  const matches = horizon("matches")
  const players = horizon("players")

  let horizonMiddleware = (store) => (next) => (action) => {
    let result = next(action)

    if (action.type == SUBMIT_MATCH) {
      let state = store.getState()
      matches.store(state.app.matches)
      players.store(state.app.players)
    }
    return result
  }

  // ======================================================
  // Middleware Configuration
  // ======================================================
  const middleware = [thunk, horizonMiddleware]

  // ======================================================
  // Store Enhancers
  // ======================================================
  const enhancers = []

  let composeEnhancers = compose

  if (__DEV__) {
    const composeWithDevToolsExtension = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
    if (typeof composeWithDevToolsExtension === 'function') {
      composeEnhancers = composeWithDevToolsExtension
    }
  }

  // ======================================================
  // Store Instantiation and HMR Setup
  // ======================================================
  const store = createStore(
    makeRootReducer(),
    initialState,
    composeEnhancers(
      applyMiddleware(...middleware),
      ...enhancers
    )
  )

  matches.watch().subscribe(
    (matches) => {
      store.dispatch({
        type: REFRESH_MATCHES,
        payload: matches
      })
    }
  )

  players.watch().subscribe(
    (players) => {
      store.dispatch({
        type: REFRESH_PLAYERS,
        payload: players
      })
    }
  )

  if (players.fetch().subscribe(
      result => {
        console.log(result, "result")
        if (result.length == 0) {
          players.store([
            {name: "Dylan", elo: 1000},
            {name: "Pete", elo: 1000},
            {name: "Jimmy", elo: 1000},
            {name: "Io", elo: 1000},
            {name: "Stephen", elo: 1000},
            {name: "Rory", elo: 1000},
            {name: "Tim", elo: 1000},
            {name: "David", elo: 1000},
            {name: "Charlie", elo: 1000},
            {name: "Cormac", elo: 1000},
            {name: "Brian", elo: 1000},
            {name: "Fiona", elo: 1000},
            {name: "Gavin", elo: 1000},
            {name: "Glenn", elo: 1000},
            {name: "Gregor", elo: 1000},
            {name: "Jen", elo: 1000},
            {name: "Jonathan", elo: 1000},
            {name: "Josh", elo: 1000},
            {name: "Matthew", elo: 1000},
            {name: "Oonagh", elo: 1000},
            {name: "Niall", elo: 1000},
            {name: "Piotr", elo: 1000},
            {name: "Shai", elo: 1000},
            {name: "Xiaolian", elo: 1000},
            {name: "Ashton", elo: 1000},
            {name: "Charlie", elo: 1000},
            {name: "Kevin", elo: 1000}])
        }
      }
    ))

    store.asyncReducers = {}

  // To unsubscribe, invoke `store.unsubscribeHistory()` anytime
  store.unsubscribeHistory = browserHistory.listen(updateLocation(store))


  if (module.hot) {
    module.hot.accept('./reducers', () => {
      const reducers = require('./reducers').default
      store.replaceReducer(reducers(store.asyncReducers))
    })
  }

  return store
}
