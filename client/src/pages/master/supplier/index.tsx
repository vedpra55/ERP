import { Route, Routes } from "react-router-dom";
import CreateSupplierPage from "./createSupplier";
import EditSupplierPage from "./editSupplier";
import Main from "./main";

const SupplierPage = () => {
  return (
    <div>
      <h1 className="text-2xl font-semibold mb-10">Suppliers</h1>
      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/create" element={<CreateSupplierPage />} />
        <Route path="/edit/:supplierCode" element={<EditSupplierPage />} />
      </Routes>
    </div>
  );
};

export default SupplierPage;
