import { BrowserRouter, Routes, Route } from "react-router-dom";

import Header from "./components/Header";
import Home from "./components/Home";
import Collection from "./components/Collection";

const App = () => {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route index element={<Home />} />
        <Route path="/collection" element={<Collection />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
