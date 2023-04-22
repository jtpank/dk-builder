
import React from 'react';
import { BrowserRouter, Route, Routes} from 'react-router-dom';
import './styles/styles.css';
import Splash from './routes/Splash';
import TeamBuilder from './routes/TeamBuilder';
import Charts from './routes/Charts';
import Header from './components/Header';
import Groups from './routes/Groups';
class App extends React.Component {
  constructor(props){
    super(props);
    const {cookies} = props;
    this.state = {
     _entries_uploaded: false,
     _salaries_uploaded: false,
     _disable_salaries_upload: false,
     _disable_entries_upload: false,
     _contestId: -1,
     _cpt_salary_dict: {},
     _util_salary_dict: {},
     _num_entries: -1,
     _all_lineups: [],
    _is_captain_set: [],
     _is_utility_set: []

    }
    this.handleUploadSuccess = this.handleUploadSuccess.bind(this);
    this.handleContestUpload = this.handleContestUpload.bind(this);
    this.handleSalaryUpload = this.handleSalaryUpload.bind(this);
    this.handleSelectCaptain = this.handleSelectCaptain.bind(this);
    this.handleSelectUtility = this.handleSelectUtility.bind(this);
    this.handleSetEntryTableRowCaptain = this.handleSetEntryTableRowCaptain.bind(this);
    this.handleSetEntryTableRowUtility = this.handleSetEntryTableRowUtility.bind(this);
  }
  handleUploadSuccess(fileType){
    this.setState({ [`_${fileType}_uploaded`]: true , [`disable_${fileType}_uploaded`]: true});
  };
  handleContestUpload(id, numEntries, entry_data){
    let allLineups = [];
    let isCaptainSet = [];
    let isUtilitySet = [];
    //create dummy lineups
    for (let i = 0; i < numEntries; ++i) {
      let obj =   {
        _entry_id: entry_data[i]['entry_id'],
        _captain: {},
        _utility: [
          {}, 
          {}, 
          {}, 
          {}, 
          {}
        ]
  }
      allLineups.push({...obj});
      isCaptainSet.push(false);
      isUtilitySet.push([false, false, false, false, false]);
    }
    this.setState({
      _contestId: id,
      _num_entries: numEntries,
      _all_lineups: allLineups,
      _is_captain_set: isCaptainSet,
      _is_utility_set: isUtilitySet,
    });

  }
  handleSalaryUpload(salary_data){
    //split data into home and away
    this.setState({
      _cpt_salary_dict: salary_data['Captains'],
      _util_salary_dict: salary_data['Utility']
    })
  }
  //Lineup specific functions
  handleSelectCaptain(cpt, lineupIndex) {
    console.log("handle select captain function: ");
    console.log(cpt.player_name);
    console.log(cpt.salary);
    let allLineups = [...this.state._all_lineups]; // make a copy of the lineup array
    let lineup = {...allLineups[lineupIndex]}; // make a copy of the lineup object at the specified index
    lineup._captain = cpt; // set the _captain object for the lineup
    allLineups[lineupIndex] = lineup; // replace the lineup object at the specified index with the updated copy
    this.setState({
      _all_lineups: allLineups // set the state with the updated lineup array
    });
  }
  handleSetEntryTableRowCaptain(val, lineupIndex) {
    console.log("handle captain set: " + String(val) + " index: " + String(lineupIndex));
    let setCaptain = [...this.state._is_captain_set]; // make a copy of the lineup array
    setCaptain[lineupIndex] = val;
    this.setState({
      _is_captain_set: setCaptain // set the state with the updated lineup array
    });
    if(!val)
    {
      //need to clear the field in the state
      let allLineups = [...this.state._all_lineups]; // make a copy of the lineup array
      let lineup = {...allLineups[lineupIndex]}; // make a copy of the lineup object at the specified index
      lineup._captain = {}; // set the _captain object empty
      allLineups[lineupIndex] = lineup; // replace the lineup object at the specified index with the updated copy
      this.setState({
        _all_lineups: allLineups // set the state with the updated lineup array
      });

    }

  }
  handleSelectUtility(player, lineupIndex, index) {
    console.log("handle select utility function");
    console.log("index: " + String(index))
    console.log("player: " + player);
    const allLineups = [...this.state._all_lineups]; // make a copy of the lineup array
    const lineup = {...allLineups[lineupIndex]}; // make a copy of the lineup object at the specified index
    const utility = [...lineup._utility]; // make a copy of the _utility array
    utility[index] = player; // set the player at the specified _utility index
    lineup._utility = utility; // set the _utility array for the copied lineup object
    allLineups[lineupIndex] = lineup; // replace the lineup object at the specified index with the updated copy
    this.setState({
      _all_lineups: allLineups // set the state with the updated lineup array
    });
  }
  handleSetEntryTableRowUtility(val, lineupIndex, index) {
    let setUtility = [...this.state._is_utility_set]; // make a copy of the lineup array
    let utilityArray = setUtility[lineupIndex];
    utilityArray[index] = val;
    this.setState({
      _is_utility_set: setUtility
    });
    if(!val)
    {
      const allLineups = [...this.state._all_lineups]; // make a copy of the lineup array
      const lineup = {...allLineups[lineupIndex]}; // make a copy of the lineup object at the specified index
      const utility = [...lineup._utility]; // make a copy of the _utility array
      utility[index] = {}; // set the player at the specified _utility index
      lineup._utility = utility; // set the _utility array for the copied lineup object
      allLineups[lineupIndex] = lineup; // replace the lineup object at the specified index with the updated copy
      this.setState({
        _all_lineups: allLineups // set the state with the updated lineup array
      });

    }
  }

  render() {
    let tempCptDict = {
      "values" : [
          {
            "player_id":201, "player_name": "Lebron", "salary": 1000, "roster_position": "CPT"
          },
          {
            "player_id":889, "player_name": "Giannis", "salary": 2000, "roster_position": "CPT"
          },
          {
            "player_id":9032, "player_name": "Jordan", "salary": 9030, "roster_position": "CPT"
          }
        ]
    };

    let tempUtilDict = {
      "values" : [
        {
          "player_id":333, "player_name": "Lebron", "salary": 2000, "roster_position": "UTIL"
        },
        {
          "player_id":444, "player_name": "Giannis", "salary": 4000, "roster_position": "UTIL"
        },
        {
          "player_id":34233, "player_name": "Jordan", "salary": 3300, "roster_position": "UTIL"
        },
        {
          "player_id":33366, "player_name": "Jokic", "salary": 2200, "roster_position": "UTIL"
        },
        {
          "player_id":2354234, "player_name": "Norman", "salary": 1100, "roster_position": "UTIL"
        },
        {
          "player_id":981, "player_name": "Blake", "salary": 9000, "roster_position": "UTIL"
        }
      ]
    };
    return (
      <BrowserRouter>
      <div className="App">
        <header className="App-header">
          <Header></Header>
        </header>
        <div>
          <Routes>
            <Route path="/" element={
            <Splash
            isEntriesUploaded={this.state._entries_uploaded}
            isSalariesUploaded={this.state._salaries_uploaded}
            onUploadSuccess={this.handleUploadSuccess}
            handleContestUpload={this.handleContestUpload}
            handleSalaryUpload={this.handleSalaryUpload}
            contestId={this.state._contestId}
            isDisabled = {this._disable_salaries_upload}
            ></Splash>}></Route>

            <Route path="/team-builder" element={
            <TeamBuilder
            contestId={this.state._contestId}
            numEntries={this.state._num_entries}
            cptSalaryDict={this.state._cpt_salary_dict}
            utilSalaryDict={this.state._util_salary_dict}
            isEntriesUploaded={this.state._entries_uploaded}
            isSalariesUploaded={this.state._salaries_uploaded}
            allLineups={this.state._all_lineups}
            handleSelectCaptain={(cpt, lineupIndex) => this.handleSelectCaptain(cpt, lineupIndex)}
            handleSelectUtility={(player, lineupIndex, idx) => this.handleSelectUtility(player, lineupIndex, idx)}
            handleSetEntryTableRowCaptain={(val, lineupIndex) => this.handleSetEntryTableRowCaptain(val, lineupIndex)}
            isCaptainSet={this.state._is_captain_set}
            handleSetEntryTableRowUtility={(val, lineupIndex, index) => this.handleSetEntryTableRowUtility(val, lineupIndex, index)}
            isUtilitySet={this.state._is_utility_set}
            ></TeamBuilder>} />

            <Route path="/charts" element={
            <Charts
            allLineups={this.state._all_lineups}
            numEntries={this.state._num_entries}
            ></Charts>
            } />
            <Route path="/groups" element={<Groups></Groups>
            }/>
          </Routes>
        </div>
      </div>
      </BrowserRouter>
    );
  }
}

export default App;
// static propTypes = {
//   cookies: instanceOf(Cookies).isRequired
// };



//For testing state (no api)

// _num_entries: 3,
// _all_lineups:
//  [ 
//      {
//          _entry_id: 123,
//          _captain: {},
//          _utility: [
//              {},
//              {},
//              {},
//              {},
//              {},
//          ]
//      },
//      {
//          _entry_id: 456,
//          _captain: {},
//          _utility: [
//              {},
//              {},
//              {},
//              {},
//              {},
//          ]
//      },
//      {
//          _entry_id: 789,
//          _captain: {},
//          _utility: [
//              {},
//              {},
//              {},
//              {},
//              {},
//          ]
//      }
//  ],
// _is_captain_set: [
//  false,
//  false,
//  false,
// ],
// _is_utility_set: [
//  [false,false,false,false,false],
//  [false,false,false,false,false],
//  [false,false,false,false,false]
// ]
// let tempCptDict = {
//   "values" : [
//       {
//         "player_id":201, "player_name": "Lebron", "salary": 1000, "roster_position": "CPT"
//       },
//       {
//         "player_id":889, "player_name": "Giannis", "salary": 2000, "roster_position": "CPT"
//       },
//       {
//         "player_id":9032, "player_name": "Jordan", "salary": 9030, "roster_position": "CPT"
//       }
//     ]
// };

// let tempUtilDict = {
//   "values" : [
//     {
//       "player_id":333, "player_name": "Lebron", "salary": 2000, "roster_position": "UTIL"
//     },
//     {
//       "player_id":444, "player_name": "Giannis", "salary": 4000, "roster_position": "UTIL"
//     },
//     {
//       "player_id":34233, "player_name": "Jordan", "salary": 3300, "roster_position": "UTIL"
//     },
//     {
//       "player_id":33366, "player_name": "Jokic", "salary": 2200, "roster_position": "UTIL"
//     },
//     {
//       "player_id":2354234, "player_name": "Norman", "salary": 1100, "roster_position": "UTIL"
//     },
//     {
//       "player_id":981, "player_name": "Blake", "salary": 9000, "roster_position": "UTIL"
//     }
//   ]
// };
