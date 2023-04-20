
import React from 'react';
import { BrowserRouter, Route, Routes} from 'react-router-dom';
import './styles/styles.css';
import Splash from './routes/Splash';
import TeamBuilder from './routes/TeamBuilder';
import Charts from './routes/Charts';
import Header from './components/Header';
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
     _num_entries: 0,
     _cpt_salary_dict: {},
     _util_salary_dict: {},
    }
    this.handleUploadSuccess = this.handleUploadSuccess.bind(this);
    this.handleContestUpload = this.handleContestUpload.bind(this);
    this.handleSalaryUpload = this.handleSalaryUpload.bind(this);
  }
  handleUploadSuccess(fileType){
    this.setState({ [`_${fileType}_uploaded`]: true , [`disable_${fileType}_uploaded`]: true});
  };
  handleContestUpload(id){
    this.setState({_contestId: id})
  }
  handleSalaryUpload(salary_data){
    //split data into home and away
    this.setState({
      _cpt_salary_dict: salary_data['Captains'],
      _util_salary_dict: salary_data['Utility']
    })
  }
  render() {
    let tempCptDict = {
      "values" : [
          {
            "player_id":201, "player_name": "Lebron cpt", "salary": 1000, "roster_position": "CPT"
          },
          {
            "player_id":889, "player_name": "Giannis cpt", "salary": 2000, "roster_position": "CPT"
          },
          {
            "player_id":9032, "player_name": "Jordan cpt", "salary": 9030, "roster_position": "CPT"
          }
        ]
    };

    let tempUtilDict = {
      "values" : [
        {
          "player_id":333, "player_name": "Lebron", "salary": 1234, "roster_position": "UTIL"
        },
        {
          "player_id":444, "player_name": "Giannis", "salary": 5553, "roster_position": "UTIL"
        },
        {
          "player_id":34233, "player_name": "Jordan", "salary": 2179, "roster_position": "UTIL"
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
            onUploadContestId={this.handleContestUpload}
            onUploadSalary={this.handleSalaryUpload}
            contestId={this.state._contestId}
            isDisabled = {this._disable_salaries_upload}
            ></Splash>}></Route>
            <Route path="/team-builder" element={
            <TeamBuilder
            contestId={this.state._contestId}
            numEntries={this.state._num_entries}
            cptSalaryDict={tempCptDict}
            utilSalaryDict={tempUtilDict}
            isEntriesUploaded={this.state._entries_uploaded}
            isSalariesUploaded={this.state._salaries_uploaded}
            ></TeamBuilder>} />
            <Route path="/charts" element={<Charts></Charts>} />
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

