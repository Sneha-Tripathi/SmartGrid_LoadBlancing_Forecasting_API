import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider } from "./context/ThemeContext";

import App from "./App";
import "./index.css";

import { Toaster } from "react-hot-toast";

import { ApiProvider } from "./context/ApiContext";
import { AuthProvider } from "./context/AuthContext";
import { WebSocketProvider } from "./context/WebSocketContext";

import ErrorBoundary from "./components/error/ErrorBoundary";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <ThemeProvider>
        <ApiProvider>
          <AuthProvider>
            <WebSocketProvider>
              <ErrorBoundary>
                <App />
                <Toaster
                position="top-right"
                reverseOrder={false}
                toastOptions={{
                  duration: 3000,
                  style: {
                    background: "#101827",
                    color: "#fff",
                    border: "1px solid #1E293B",
                  },
                  success: {
                    iconTheme: {
                      primary: "#10B981",
                      secondary: "#fff",
                    },
                  },
                  error: {
                    iconTheme: {
                      primary: "#EF4444",
                      secondary: "#fff",
                    },
                  },
                }}
                />
              
              </ErrorBoundary>
            </WebSocketProvider>
          </AuthProvider>
        </ApiProvider>

      </ThemeProvider>
      
    </BrowserRouter>
  </React.StrictMode>
);