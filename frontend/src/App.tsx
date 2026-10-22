import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "./login";
import Signup from "./signup";
import Welcome from "./welcome";
import FlowerPattern from "./FlowerPattern";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route
          path="/welcome"
          element={
            <>
              <Welcome />
              <FlowerPattern />
            </>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
