import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "react-hot-toast";

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <AuthProvider>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: "#0D3558",
            color: "#E8F4FD",
            border: "1px solid rgba(123,189,232,0.3)",
            borderRadius: "12px",
            fontSize: "14px",
            fontWeight: "600",
          },
          success: {
            iconTheme: { primary: "#7BBDE8", secondary: "#021F38" },
            duration: 3000,
          },
          error: {
            iconTheme: { primary: "#f06292", secondary: "#021F38" },
            duration: 3000,
          },
        }}
      />
      <App />
    </AuthProvider>
  </BrowserRouter>
);