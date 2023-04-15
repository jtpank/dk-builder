
import { BrowserRouter, Route, Routes} from 'react-router-dom';
import './styles/styles.css';
import Splash from './routes/Splash';
import TeamBuilder from './routes/TeamBuilder';
import Charts from './routes/Charts';
import Header from './components/Header';
function App() {
  return (
    <BrowserRouter>
    <div className="App">
      <header className="App-header">
        <Header></Header>
      </header>
      <div>
        <Routes>
          <Route path="/" element={<Splash/>}></Route>
          <Route path="/team-builder" element={<TeamBuilder></TeamBuilder>} />
          <Route path="/charts" element={<Charts></Charts>} />
        </Routes>
      </div>
    </div>
    </BrowserRouter>
  );
}

export default App;
