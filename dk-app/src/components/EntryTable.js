import React from 'react';
import EntryTableRowHeader from './EntryTableRowHeader';
import EntryTableRowCaptain from './EntryTableRowCaptain';
import EntryTableRowUtility from './EntryTableRowUtility';
import EntryTableRowFooter from './EntryTableRowFooter';
import '../styles/styles.css';
class EntryTable extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            _lineup: {
                _captain: {},
                _utility: [
                    {},
                    {},
                    {},
                    {},
                    {},
                ]
                // _util_1: {},
                // _util_2: {},
            }
        }
      }
      handleSelectCaptain(cpt) {
        console.log("handle select captain function: ");
        console.log(cpt.player_name);
        console.log(cpt.salary);
        this.setState({
            _lineup: {
              ...this.state._lineup,
              _captain: cpt,
            },
          });
      }
      handleSelectUtility(player, index) {
        console.log("handle select utility function");
        console.log("index: " + String(index))
        console.log("player: " + player);
        const newUtility = [...this.state._lineup._utility];
        newUtility[index] = player;
        this.setState({
            _lineup: {
                ...this.state._lineup,
                _utility: newUtility
            }
        })
      }
    
    render() {
        let rows = [];
        for(let i = 0; i < 5; ++i)
        {
            rows.push(
                <EntryTableRowUtility
                key={i}
                playerDict={this.props.utilityDict}
                onSelectUtility={(player) => this.handleSelectUtility(player, i)}
                utility={this.state._lineup._utility[i]}
                utilityId={i+1}
                ></EntryTableRowUtility>
            )
        }
        return(
            <div className='splash-header'>
                <EntryTableRowHeader
                entryNumber={0}
                ></EntryTableRowHeader>
                <EntryTableRowCaptain
                playerDict={this.props.captainDict}
                onSelectCaptain={(cpt) => this.handleSelectCaptain(cpt)}
                captain={this.state._lineup._captain}
                ></EntryTableRowCaptain>
                {rows}
                <EntryTableRowFooter
                captain={this.state._lineup._captain}
                utilityArray={this.state._lineup._utility}
                ></EntryTableRowFooter>

            </div>
    
        );
    }
}

export default EntryTable;
