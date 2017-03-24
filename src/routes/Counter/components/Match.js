import React from 'react'


class Match extends React.Component {
  render() {
    let props = this.props
    return (
      <li>
        {props.match.date.toString()} Player One: {props.match.playerOne} Player Two: {props.match.playerTwo} Winner: {props.match.result}
      </li>
    )
  }
}

Match.propTypes = {
  match: React.PropTypes.object
}


export default Match
