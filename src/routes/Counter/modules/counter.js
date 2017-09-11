import eloRank from 'elo-rank'
// ------------------------------------
// Constants
// ------------------------------------
export const SUBMIT_MATCH = 'SUBMIT_MATCH'
export const REFRESH_MATCHES = 'REFRESH_MATCHES'
export const REFRESH_PLAYERS = 'REFRESH_PLAYESR'
// ------------------------------------
// Actions
// ------------------------------------
export function submitMatch (playerOne, playerTwo, result) {
  let date = new Date()
  return {
    type    : SUBMIT_MATCH,
    payload : {
      playerOne: playerOne,
      playerTwo: playerTwo,
      result: result,
      date: date
    }
  }
}
//
// /*  This is a thunk, meaning it is a function that immediately
//     returns a function for lazy evaluation. It is incredibly useful for
//     creating async actions, especially when combined with redux-thunk! */
//
export const doubleAsync = () => {
  return (dispatch, getState) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        dispatch({
          type    : COUNTER_DOUBLE_ASYNC,
          payload : getState().counter
        })
        resolve()
      }, 200)
    })
  }
}

export const actions = {
  submitMatch,
}

// ------------------------------------
// Action Handlers
// ------------------------------------
const ACTION_HANDLERS = {
  [SUBMIT_MATCH]    : (state, action) => {

    let elo = new eloRank(24)

    let playerOne = state.players.filter((player) => {return player.name == action.payload.playerOne})[0]
    let playerTwo = state.players.filter((player) => {return player.name == action.payload.playerTwo})[0]

    let expectedScoreOne = elo.getExpected(playerOne.elo, playerTwo.elo)
    let expectedScoreTwo = elo.getExpected(playerTwo.elo, playerOne.elo)

    playerOne.elo = elo.updateRating(expectedScoreOne, action.payload.result == playerOne.name, playerOne.elo)
    playerTwo.elo = elo.updateRating(expectedScoreTwo, action.payload.result == playerTwo.name, playerTwo.elo)

    let newPlayers = state.players.filter((player) => {return player.name != action.payload.playerOne && player.name != action.payload.playerTwo}).concat(
      [playerOne, playerTwo]
    )

    return Object.assign({}, state, {players: newPlayers, matches: state.matches.concat([action.payload]), match:{playerOne: "", playerTwo: "", result: ""}})
  },
  [REFRESH_MATCHES] : (state, action) => {
    return Object.assign({}, state, {matches: action.payload})
  },
  [REFRESH_PLAYERS] : (state, action) => {
    return Object.assign({}, state, {players: action.payload})
  }
}

// ------------------------------------
// Reducer
// ------------------------------------
const initialState = {matches: [], players: []}


export default function counterReducer (state = initialState, action) {
  if(action){
    const handler = ACTION_HANDLERS[action.type]
    return handler ? handler(state, action) : state
  }
  return state
}
