import './App.css';
import Register from './components/Register';
import Login from './components/Login';
import StartSession from './components/StartSession';
import ActiveSession from './components/ActiveSession';
import EndSession from './components/EndSession';
import Payments from './components/Payments';

function App() {
  return (
    <div className="App">
      <h1>Gym App</h1>
      <Register />
      <hr />
      <Login />
      <hr />
      <StartSession />
      <ActiveSession />
      <EndSession />
      <Payments />
    </div>
  );
}

export default App;
