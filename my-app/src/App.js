import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from './pages/Login';
import Issues from "./pages/Issues";
import { Provider } from 'react-redux';
import store from './store';

function App() {

  return (
    <Provider store={store}>
      <Router>
        <Routes>
          <Route path="/" element={<Login/>}/>
          <Route path="/issues" element={<Issues/>}/>
        </Routes>
      </Router>
    </Provider>
  );
}

export default App;
