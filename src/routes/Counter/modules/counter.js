import eloRank from 'elo-rank'
// ------------------------------------
// Constants
// ------------------------------------
export const SUBMIT_MATCH = 'SUBMIT_MATCH'

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
      date
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

    let elo = eloRank(24)

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
}

// ------------------------------------
// Reducer
// ------------------------------------
const initialState = {matches: [], players: [
  {name: "Dylan", elo: 1000},
  {name: "Pete", elo: 1000},
  {name: "Jimmy", elo: 1000},
  {name: "Io", elo: 1000},
  {name: "Steven", elo: 1000},
  {name: "Daniel", elo: 1000}
]}


export default function counterReducer (state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type]
  return handler ? handler(state, action) : state
}
