import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./index.css";

// Context Providers
import { CategoryProvider } from "./CategoryContext";
import { AuthProvider } from "./contexts/AuthContext";
import { SearchBarProvider } from "./contexts/SearchBarContext";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <CategoryProvider>
          <SearchBarProvider>
            <App />
          </SearchBarProvider>
        </CategoryProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
