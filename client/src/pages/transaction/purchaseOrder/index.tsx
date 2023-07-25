import { Route, Routes } from "react-router-dom";
import Main from "./main";
import CreatePurchaseOrder from "./createPurchaseOrder";
import EditPurchaseOrder from "./editPurchaseOrder";

const PurchaseOrderPage = () => {
  return (
    <div>
      <h1 className="text-2xl font-semibold mb-10">Purchase Order</h1>
      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/create" element={<CreatePurchaseOrder />} />
        <Route path="/edit/:orderNo" element={<EditPurchaseOrder />} />
      </Routes>
    </div>
  );
};

export default PurchaseOrderPage;
