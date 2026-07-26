import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider } from "./context/ThemeContext";
//venv\Scripts\activate.bat
import App from "./App";
import "./index.css";
//uvicorn app.main:app --reload
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
                gutter={12}
                containerClassName=""
                toastOptions={{
                  duration: 3000,
                  style: {
                    background: "#101827",
                    color: "#fff",
                    border: "1px solid #1E293B",
                    borderRadius: "12px",
                    padding: "14px 18px",
                    fontSize: "14px",
                    backdropFilter: "blur(16px)",
                    WebkitBackdropFilter: "blur(16px)",
                    boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
                  },
                  success: {
                    iconTheme: {
                      primary: "#10B981",
                      secondary: "#fff",
                    },
                    style: {
                      border: "1px solid rgba(16, 185, 129, 0.3)",
                    },
                  },
                  error: {
                    iconTheme: {
                      primary: "#EF4444",
                      secondary: "#fff",
                    },
                    style: {
                      border: "1px solid rgba(239, 68, 68, 0.3)",
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