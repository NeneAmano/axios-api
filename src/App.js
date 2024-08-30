import "./App.css"
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Home,Login, Sample } from "./pages";
import { CssBaseline } from '@mui/material';


function App() {
  return (
    <CssBaseline>
    <Router>
      <div>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/Login" element={<Login />} />
          <Route path="/Sample" element={<Sample />} />

        </Routes>
      </div>
    </Router>
    </CssBaseline>
  );
}
export default App;
