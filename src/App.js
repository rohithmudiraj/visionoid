import NavBar from './components/common-components/NavBar';
import HomePage from './components/pages/HomePage';
import '../src/styles/main.css';
import { GraphConfiguration } from './contexts/GraphContext';
function App() {
  return (
    <div className="App">
      <GraphConfiguration>
    <NavBar/>
    <HomePage/>
    </GraphConfiguration>
    </div>
  );
}

export default App;
