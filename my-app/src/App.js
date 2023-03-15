import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { ErrorBoundary } from "react-error-boundary";
import ErrorFallback from "./pages/ErrorFallback";

import Login from './pages/Login';
import Issues from "./pages/Issues";
import SingleIssues from "./pages/SingleIssue";
import SelectRepo from "./pages/SelectRepo";
import NotFound from "./pages/notFound";
import { Provider } from 'react-redux';
import store from './store';

function App() {

  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <Provider store={store}>
        <Router>
          <Routes>
            <Route path="/" element={<Login/>}/>
            <Route path="/issues" element={<Issues/>}/>
            <Route path="/create" element={<SingleIssues/>}/>
            <Route path="/edit/:id" element={<SingleIssues/>}/>
            <Route path="/select" element={<SelectRepo/>}/>
            <Route path="*" element={<NotFound/>} />
          </Routes>
        </Router>
      </Provider>
    </ErrorBoundary>
    
  );
}

export default App;
