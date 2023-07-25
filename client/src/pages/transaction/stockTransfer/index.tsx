import { Route, Routes } from "react-router-dom";
import MainPage from "./main";
import CreateTransferPage from "./createTransfer";
import EditTransferPage from "./editTransfer";

const StockTransferPage = () => {
  return (
    <div>
      <h1 className="text-2xl font-semibold mb-10">Stock Transfer </h1>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/create" element={<CreateTransferPage />} />
        <Route
          path="/edit/:transferNo/:fromLocation/:toLocation"
          element={<EditTransferPage />}
        />
      </Routes>
    </div>
  );
};

export default StockTransferPage;
