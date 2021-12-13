import { MemoryRouter as Router, Switch, Route } from 'react-router-dom';
import './App.css';
import ProgressBar from './components/ProgressBar';
// import Test from './components/Test';

export default function App() {
  return (
    <Router>
      <Switch>
        <Route path="/" component={ProgressBar} />
      </Switch>
    </Router>
  );
}
