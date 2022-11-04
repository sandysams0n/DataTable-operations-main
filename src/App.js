/**File contains all the components and the routing happens here */
import "./App.css";
import DataTableCrudDemo from "./demo/DataTableCrudDemo";
import { Routes, Route } from "react-router-dom";
import SavedData from "./demo/SavedData";
import Playground from "./demo/playground";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<DataTableCrudDemo />} />
        <Route path="saveddata" element={<SavedData />} />
        <Route path="/" element={<Playground />} />
       </Routes>
   
    </>
  );
}

export default App;
