import "./App.css";
import Nav from "./components/header";

import Middle from "./components/middleComponent";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./components/login";
import Signup from "./components/signup";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Nav />

        <Middle />
        <Routes>
        
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
