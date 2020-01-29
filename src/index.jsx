// import external modules
import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router } from "react-router-dom";
import { Provider } from "react-redux";

import App from "./containers/app.jsx"
import createAppStore from "./store/store_config.js";

const store = createAppStore()

ReactDOM.render(
   <Provider store={store}>
      <Router>
         <App />
      </Router>
   </Provider>,
   document.getElementById("root")
);
