
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
     _home_salary_dict: {},
     _away_salary_dict: {},
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
      _home_salary_dict: salary_data['Home'],
      _away_salary_dict: salary_data['Away']
    })
  }
  render() {
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
            homeSalaryDict={this.state._home_salary_dict}
            awaySalaryDict={this.state._away_salary_dict}
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

