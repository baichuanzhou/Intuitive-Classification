import ReactDOM from "react-dom/client"
import React from "react";
import App from "./Component/App.js";
import { StyledEngineProvider } from '@mui/material/styles';



ReactDOM.createRoot(document.querySelector("#root")).render(
  <React.StrictMode>
    <StyledEngineProvider injectFirst>
      <App />
    </StyledEngineProvider>
  </React.StrictMode>
);
