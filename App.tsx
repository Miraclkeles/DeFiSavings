import React from 'react';
import {
  BrowserRouter as Router,
  Route,
  Link,
  Switch
} from 'react-router-dom';
import Deposit from './Deposit';
import Savings from './Savings';

const App: React.FC = () => {
  return (
    <Router>
      <div>
        <header>
          <h1>DeFiSavings</h1>
          <nav>
            <ul>
              <li>
                <Link to="/">Home</Link>
              </li>
              <li>
                <Link to="/deposit">Deposit</Link>
              </li>
              <li>
                <Link to="/savings">Savings</Link>
              </li>
            </ul>
          </nav>
        </header>
        <Switch>
          <Route path="/deposit">
            <Deposit />
          </Route>
          <Route path="/savings">
            <Savings />
          </Route>
          <Route path="/">
            <Home />
          </Route>
        </Switch>
      </div>
    </Router>
  );
}

const Home: React.FC = () => <div>Welcome to DeFiSavings</div>;

export default App;