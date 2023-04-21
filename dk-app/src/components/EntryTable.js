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
                // onSelectUtility={(player) => this.handleSelectUtility(player, i)}
                handleSelectUtility={this.props.handleSelectUtility}
                handleSetEntryTableRowUtility={this.props.handleSetEntryTableRowUtility}
                isUtilitySet={this.props.isUtilitySet}
                utility={this.props.lineup._utility[i]}
                lineupIndex={this.props.lineupIndex}
                utilityId={i+1}
                ></EntryTableRowUtility>
            )
        }
        return(
            <div className='entry-table_container'>
                <EntryTableRowHeader
                entryNumber={this.props.lineup._entry_id}
                ></EntryTableRowHeader>
                <EntryTableRowCaptain
                playerDict={this.props.captainDict}
                // onSelectCaptain={(cpt) => this.handleSelectCaptain(cpt)}
                handleSelectCaptain={this.props.handleSelectCaptain}
                handleSetEntryTableRowCaptain={this.props.handleSetEntryTableRowCaptain}
                isCaptainSet={this.props.isCaptainSet}
                captain={this.props.lineup._captain}
                lineupIndex={this.props.lineupIndex}
                ></EntryTableRowCaptain>
                {rows}
                <EntryTableRowFooter
                captain={this.props.lineup._captain}
                utilityArray={this.props.lineup._utility}
                ></EntryTableRowFooter>

            </div>
    
        );
    }
}

export default EntryTable;
