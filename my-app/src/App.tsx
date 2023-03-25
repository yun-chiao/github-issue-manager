import "react-toastify/dist/ReactToastify.css";

import React from "react";
import { ErrorBoundary } from "react-error-boundary";
import { Provider } from "react-redux";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { toast,ToastContainer } from "react-toastify";

import ErrorFallback from "./pages/ErrorFallback";
import Issues from "./pages/Issues";
import Login from "./pages/Login";
import NotFound from "./pages/notFound";
import SelectRepo from "./pages/SelectRepo";
import SingleIssues from "./pages/SingleIssue";
import store from "./store";

function App(): JSX.Element {

  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <ToastContainer autoClose={2000} position={toast.POSITION.BOTTOM_RIGHT} />
      <Provider store={store}>
        <Router>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/issues" element={<Issues />} />
            <Route path="/create" element={<SingleIssues />} />
            <Route path="/edit/:id" element={<SingleIssues />} />
            <Route path="/select" element={<SelectRepo />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Router>
      </Provider>
    </ErrorBoundary>

  );
}

export default App;