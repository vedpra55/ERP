import { Route, Routes } from "react-router-dom";
import CreateLocationPage from "./createLocation";
import Main from "./main";
import EditLocationPage from "./editLocation";

const CategoryPage = () => {
  return (
    <div>
      <h1 className="text-2xl font-semibold mb-10">Locations</h1>
      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/create" element={<CreateLocationPage />} />
        <Route path="/edit/:locationCode" element={<EditLocationPage />} />
      </Routes>
    </div>
  );
};

export default CategoryPage;
