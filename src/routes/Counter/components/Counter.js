import React from 'react'
import Match from './Match'

class Counter extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      playerOne: "",
      playerTwo: "",
      result: ""
    }

    this.baseState = this.state
  }

  resetState(){
    this.state = this.baseState
  }
  render() {

    let self = this;
    let props = this.props

    function submitMatch() {
      if(self.state.playerOne != "" && self.state.playerTwo != "" && self.state.result != "" && self.state.playerOne != self.state.playerTwo)
      {
        props.submitMatch(
          self.state.playerOne,
          self.state.playerTwo,
          self.state.result
        )

        self.resetState()
      }
    }

    function handleChange(event) {
      self.setState({
        [event.target.name]: event.target.value
      });
    }

    return (
      <div style={{margin: '0 auto'}}>
        <h2>Add a match</h2>
        <div className='form form-inline'>
          <div className='form-group'>
            <label >Player One</label>

            <select name="playerOne" className='form-control'
                    onChange={handleChange}
                    value={this.state.playerOne}>
              <option value="">Choose</option>
              {props.players.filter((player) => player.name != this.state.playerTwo).map(
                player => <option key={player.name}
                                  value={player.name}>{player.name}</option>
              )}
            </select>
          </div>
          <div className='form-group'>
            <label>Player Two</label>
            <select
              name="playerTwo" className='form-control'
              onChange={handleChange}
              value={this.state.playerTwo}>
              <option value="">Choose</option>
              {props.players.filter((player) => player.name != this.state.playerOne).map(
                player => <option key={player.name}
                                  value={player.name}>{player.name}</option>
              )}
            </select>
          </div>
          <div className='form-group'>
            <label>Winner</label>
            <select name="result" className='form-control'onChange={handleChange} value={this.state.result}>
              <option value=""></option>
              <option value={self.state.playerOne}>{self.state.playerOne}</option>
              <option value={self.state.playerTwo}>{self.state.playerTwo}</option>
            </select>
            <button className='btn btn-default' onClick={submitMatch}>Submit
            </button>
          </div>
        </div>
        <h2>The League</h2>
        <table className='table table-striped table-bordered'>
          <tbody>
          {props.players.sort(function(a, b) {
            return b.elo - a.elo;
          }).map(
            (player, index) => <tr key={index}><th>{index+1}</th><td>{player.name}</td><td>{player.elo}</td></tr>
          )}
          </tbody>
        </table>
        <h2>Past Matches</h2>
        <ul style={{listStyle: "none"}}>
          {props.matches.map(
            (match) => <Match match={match}></Match>
          )}
        </ul>
      </div>
    )
  }
}

Counter.propTypes = {
  submitMatch: React.PropTypes.func.isRequired,
  players: React.PropTypes.array,
  match: React.PropTypes.object
}


export default Counter
