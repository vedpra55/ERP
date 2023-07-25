import { Route, Routes } from "react-router-dom";
import CreateCategoryPage from "./createCategory";
import EditCategoryPage from "./editCategory";
import Main from "./main";

const CategoryPage = () => {
  return (
    <div>
      <h1 className="text-2xl font-semibold mb-10">Categories</h1>
      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/create" element={<CreateCategoryPage />} />
        <Route path="/edit/:departmentCode" element={<EditCategoryPage />} />
      </Routes>
    </div>
  );
};

export default CategoryPage;
