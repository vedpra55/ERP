import { Route, Routes } from "react-router-dom";
import CreateCategoryPage from "./createProduct";
import EditProductPage from "./editProduct";
import Main from "./main";

const CategoryPage = () => {
  return (
    <div>
      <h1 className="text-2xl font-semibold mb-10">Products</h1>
      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/create" element={<CreateCategoryPage />} />
        <Route
          path="/edit/:productCode/:departmentCode"
          element={<EditProductPage />}
        />
      </Routes>
    </div>
  );
};

export default CategoryPage;
