
import React from 'react';
import { BrowserRouter, Route, Routes} from 'react-router-dom';
import { withCookies, Cookies } from 'react-cookie';
import { instanceOf } from 'prop-types';
import './styles/styles.css';
import Splash from './routes/Splash';
import TeamBuilder from './routes/TeamBuilder';
import Charts from './routes/Charts';
import Header from './components/Header';
import Groups from './routes/Groups';
import Login from './routes/Login';
import Logout from './routes/Logout';
import Signup from './routes/Signup';
//Change baseurl here!
//d21df53e94da97bbda4fa51be779df1dcf9b8074
const base_url = '/api/';
class App extends React.Component {
  static propTypes = {
    cookies: instanceOf(Cookies).isRequired
  };
  constructor(props){
    super(props);
    const {cookies} = props;
    this.state = {
      _email: cookies.get('email') || 'None',
      _jwt: cookies.get('jwt_token') || 'None',
      _is_logged_in: cookies.get('is_logged_in') || false,
     _entries_uploaded: false,
     _salaries_uploaded: false,
     _disable_salaries_upload: false,
     _disable_entries_upload: false,
     _contestId: -1,
     _contest_name: "",
     _all_user_contests_list: [],
     _cpt_salary_dict: {},
     _util_salary_dict: {},
     _num_entries: -1,
     _all_lineups: [],
    _is_captain_set: [],
     _is_utility_set: [],
     _failure_dict: {},
     _current_groups_email_list: [],
     _current_groups_entry_list_data: [],

    }
    this.handleCookiesUpdate = this.handleCookiesUpdate.bind(this);
    this.handleCookiesDelete = this.handleCookiesDelete.bind(this);
    this.shouldRenderHeader  = this.shouldRenderHeader.bind(this);

    this.handleUploadSuccess = this.handleUploadSuccess.bind(this);
    this.handleContestUpload = this.handleContestUpload.bind(this);
    this.handleSalaryUpload = this.handleSalaryUpload.bind(this);
    this.handleSelectCaptain = this.handleSelectCaptain.bind(this);
    this.handleSelectUtility = this.handleSelectUtility.bind(this);
    this.handleSetEntryTableRowCaptain = this.handleSetEntryTableRowCaptain.bind(this);
    this.handleSetEntryTableRowUtility = this.handleSetEntryTableRowUtility.bind(this);

    this.handleSaveLintLineups = this.handleSaveLintLineups.bind(this);
    this.handleDownloadLineupCsv = this.handleDownloadLineupCsv.bind(this);

    this.handleDisplayContestData = this.handleDisplayContestData.bind(this);
    this.handleDisplayGroupsAndContestCharts = this.handleDisplayGroupsAndContestCharts.bind(this);
  }

  handleCookiesUpdate(data) {
    const {cookies} = this.props;
    cookies.set('email', data.email, {path: '/'});
    cookies.set('jwt_token', data.jwt_token, {path: '/'});
    cookies.set('is_logged_in', data.is_logged_in, {path: '/'});
    this.setState({
      _email: data.email,
      _jwt: data.jwt_token,
      _is_logged_in: data.is_logged_in
    });
  }
  handleCookiesDelete() {
    console.log('removed cookies fired')
    const {cookies} = this.props;
    cookies.remove('email', {path: '/'});
    cookies.remove('jwt_token', {path: '/'});
    cookies.remove('is_logged_in', {path: '/'});
    this.setState({
      _email: 'None',
      _jwt: 'None',
      _is_logged_in: false
    });
  }
  shouldRenderHeader() {
    if (typeof window !== 'undefined') {
      const { pathname } = window.location;
      return pathname !== '/';
    }
    return false;
  }

  handleDownloadLineupCsv(){
    const myHeaders = new Headers();
    myHeaders.append('Content-Type', 'application/json');
    myHeaders.append("Access-Control-Allow-Origin","*");
    myHeaders.append('Authorization', 'Bearer ' + this.state._jwt);
    const fetch_req = "download-entries";
    const end_url = '-route';
    // const filename = 'download_DKEntries.csv';
    const full_url = base_url + fetch_req + end_url;
    //this is a list of objects
    const bodyData = JSON.stringify({contest_id: this.state._contestId});
    fetch(full_url, {
            method: 'PUT',
            headers: myHeaders,
            body: bodyData
        }).then(response => {
          console.log(response)
          if (!response.ok) {
              throw new Error("HTTP status " + response.status + " bad contestID or server error");
          }
          return response.blob();
        })
        .then(data => {
          const reader = new FileReader();
          reader.onload = function(event) {
            // create a download link element
            const link = document.createElement('a');
            link.href = event.target.result;
            // console.log(link.href)
            // link.download = '/application/downloads/download_DKEntries.csv';
            // add the link element to the DOM
            document.body.appendChild(link);
    
            // trigger the download
            link.click();
    
            // remove the link element from the DOM
            document.body.removeChild(link);
          };
          reader.readAsDataURL(data);
        }).catch(error => {
            console.error(error);
            alert(error.message);
        });
  };

 handleSaveLintLineups() {
    const myHeaders = new Headers();
    myHeaders.append('Content-Type', 'application/json');
    myHeaders.append('Authorization', 'Bearer ' + this.state._jwt);
    const fetch_req = "save-lint-entries";
    const end_url = '-route';
    const full_url =  + fetch_req + end_url;
    //this is a list of objects
    const bodyData = JSON.stringify({lineupData: this.state._all_lineups});
    fetch(full_url, {
            method: 'PUT',
            headers: myHeaders,
            body: bodyData
        }).then(response => {
          if (!response.ok) {
              throw new Error("HTTP status " + response.status + " bad json lineup data or server error");
          }
          return response.json();
        })
        .then(data => {
          //  console.log(data.failureDict)
          this.setState({
            _failure_dict: data.failure_dict
          })
        }).catch(error => {
            console.error(error);
            alert(error.message);
        });
    };



  handleUploadSuccess(fileType) {
    this.setState({ [`_${fileType}_uploaded`]: true , [`disable_${fileType}_uploaded`]: true});
  };
  handleContestUpload(contestName, id, numEntries, entry_data){
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
      _contest_name: contestName,
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
    let allLineups = [...this.state._all_lineups]; // make a copy of the lineup array
    let lineup = {...allLineups[lineupIndex]}; // make a copy of the lineup object at the specified index
    lineup._captain = cpt; // set the _captain object for the lineup
    allLineups[lineupIndex] = lineup; // replace the lineup object at the specified index with the updated copy
    this.setState({
      _all_lineups: allLineups // set the state with the updated lineup array
    });
  }
  handleSetEntryTableRowCaptain(val, lineupIndex) {
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

  //Group lineup and stat display
  handleDisplayContestData(){
    const myHeaders = new Headers();
    myHeaders.append('Content-Type', 'application/json');
    myHeaders.append("Access-Control-Allow-Origin","*");
    myHeaders.append('Authorization', 'Bearer ' + this.state._jwt);
    let path = "user-contests-route";
    let full_url = base_url + path;
    const bodyData = JSON.stringify({email: this.state._email});
    fetch(full_url, {
      method: 'PUT',
      headers: myHeaders,
      body: bodyData
    }).then(response => {
      if (!response.ok) {
          throw new Error("HTTP status " + response.status + " bad request to user contests");
      }
      return response.json();
    })
    .then(data => {
      this.setState({
        _all_user_contests_list: data["contest_list"]
      })
    }).catch(error => {
        console.error(error);
        alert(error.message);
    });

  }
  handleDisplayGroupsAndContestCharts(selectedContestId) {
    const myHeaders = new Headers();
    myHeaders.append('Content-Type', 'application/json');
    myHeaders.append("Access-Control-Allow-Origin","*");
    myHeaders.append('Authorization', 'Bearer ' + this.state._jwt);
    let path = "group-contests-route";
    let full_url = base_url + path;
    const bodyData = JSON.stringify({contest_id: selectedContestId});
    fetch(full_url, {
      method: 'PUT',
      headers: myHeaders,
      body: bodyData
    }).then(response => {
      if (!response.ok) {
        console.log(response)
          throw new Error("HTTP status " + response.status + " bad request to group contests");
      }
      return response.json();
    })
    .then(data => {
      this.setState({
        _current_groups_entry_list_data: data['entry_obj_list'],
        _current_groups_email_list: data['email_list']
      })
    }).catch(error => {
        console.error(error);
        alert(error.message);
    });

  }

  render() {
    return (
      <BrowserRouter>
      <div className="App">
        <header className="App-header">
          <Header
           is_logged_in={this.state._is_logged_in}
           handleLogout={this.handleCookiesDelete}
          ></Header>
        </header>
        <div>
          <Routes>
            <Route path="/" element={
            <Splash
            is_logged_in={this.state._is_logged_in}
            isEntriesUploaded={this.state._entries_uploaded}
            isSalariesUploaded={this.state._salaries_uploaded}
            onUploadSuccess={this.handleUploadSuccess}
            handleContestUpload={this.handleContestUpload}
            handleSalaryUpload={this.handleSalaryUpload}
            contestId={this.state._contestId}
            isDisabled = {this._disable_salaries_upload}
            _jwt={this.state._jwt}
            _email={this.state._email}
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
              contestName={this.state._contest_name}
              failureDict={this.state._failure_dict}
              
              handleDownloadLineupCsv={this.handleDownloadLineupCsv}

              _jwt={this.state._jwt}
              handleSaveLintLineups={this.handleSaveLintLineups}
              ></TeamBuilder>} />

            <Route path="/charts" element={
              <Charts
              allLineups={this.state._all_lineups}
              numEntries={this.state._num_entries}
              ></Charts>
            } />
            <Route path="/groups" element={
              <Groups
              groupEmailList={this.state._current_groups_email_list}
              groupEntryDataList={this.state._current_groups_entry_list_data}
              handleDisplayContestData={this.handleDisplayContestData}
              allUserContestsList={this.state._all_user_contests_list}
              handleDisplayGroupsAndContestCharts={this.handleDisplayGroupsAndContestCharts}
              _jwt={this.state._jwt}
              ></Groups>
            }/>
            <Route path="/login" element={<Login handleCookiesUpdate={this.handleCookiesUpdate}></Login>} />
            <Route path="/signup" element={<Signup handleCookiesUpdate={this.handleCookiesUpdate}></Signup>} />
            <Route path="/logout" element={<Logout></Logout>} />
          </Routes>
        </div>
      </div>
      </BrowserRouter>
    );
  }
}

export default withCookies(App);
