import useApiServices from "@api/query";
import { User } from "@context/AuthContext";
import NotFoundPage from "@pages/NotFoundPage";

import Home from "@pages/home/home";

import MainApp from "@pages/main";
import CategoryPage from "@pages/master/category";
import LocationPage from "@pages/master/location";
import ProductPage from "@pages/master/product";
import SupplierPage from "@pages/master/supplier";
import PurchaseDocument from "@pages/report/purchaseDocument";
import PurchaseOrderSummary from "@pages/report/purchaseOrderSummary";
import StockLevelReport from "@pages/report/stockLevelReport";
import AssignPrograms from "@pages/system/assignPrograms";
import CreateRoles from "@pages/system/roles";
import CreateSubCompany from "@pages/system/subCompany";
import CreateUser from "@pages/system/user";
import PurchaseOrderPage from "@pages/transaction/purchaseOrder";
import StockTransferPage from "@pages/transaction/stockTransfer";
import { FC, useEffect, useState } from "react";
import { Route, Routes } from "react-router-dom";

interface Props {
  user: User;
}

const RoutesManagment: FC<Props> = ({ user }) => {
  const { useFetchProgram } = useApiServices();
  const { data: programs } = useFetchProgram();
  const [actionComplete, setActionComplete] = useState(false);
  const [programAccess, setProgramAccess] = useState({
    isCategories: false,
    isLocations: false,
    isProducts: false,
    isSuppliers: false,
    pod: false,
    tc: false,
    pd: false,
    td: false,
    sbr: false,
  });

  useEffect(() => {
    if (programs) {
      const isCategories = checkIsProgramAccess("Categories");
      const isLocations = checkIsProgramAccess("Locations");
      const isProducts = checkIsProgramAccess("Products");
      const isSuppliers = checkIsProgramAccess("Suppliers");
      const pod = checkIsProgramAccess("Purchase Order Creation");
      const tc = checkIsProgramAccess("Transfer Creation");
      const pd = checkIsProgramAccess("Purchase Document");
      const td = checkIsProgramAccess("Transfer Document");
      const sbr = checkIsProgramAccess("Stock Balance Report");

      setProgramAccess({
        ...programAccess,
        isCategories: isCategories,
        isLocations: isLocations,
        isProducts: isProducts,
        isSuppliers: isSuppliers,
        pod: pod,
        tc: tc,
        pd,
        td,
        sbr,
      });

      setActionComplete(true);
    }
  }, [programs]);

  const checkIsProgramAccess = (val: string) => {
    const isAccess = programs?.filter((res) => {
      if (res != null) return res.program_name === val;
    })[0];
    if (isAccess) return true;
    return false;
  };

  console.log(programs);

  return (
    <Routes>
      {/* Catch-all route for 404 */}
      {programs && actionComplete && (
        <Route path="*" element={<NotFoundPage />} />
      )}
      <Route path="/" element={<Home />} />
      <Route
        path="app"
        element={
          user.access_token != "" ? (
            <MainApp />
          ) : (
            <p className="text-center mt-20">Please Login</p>
          )
        }
      >
        <Route path="system">
          <Route path="create-roles" element={<CreateRoles />} />
          <Route path="create-users" element={<CreateUser />} />
          <Route path="create-sub-company" element={<CreateSubCompany />} />
          <Route path="assign-programs" element={<AssignPrograms />} />
        </Route>
        <Route />

        <Route path="master">
          <Route path="categories/*" element={<CategoryPage />} />

          <Route path="locations/*" element={<LocationPage />} />

          <Route path="suppliers/*" element={<SupplierPage />} />

          <Route path="products/*" element={<ProductPage />} />
        </Route>

        <Route path="transaction">
          <Route
            path="purchase-order-creation/*"
            element={<PurchaseOrderPage />}
          />

          {programAccess.tc && (
            <Route path="transfer-creation/*" element={<StockTransferPage />} />
          )}
        </Route>

        <Route path="report">
          {programAccess.pd && (
            <Route path="purchase-document" element={<PurchaseDocument />} />
          )}

          {programAccess.td && (
            <Route
              path="transfer-document"
              element={<PurchaseOrderSummary />}
            />
          )}

          {programAccess.sbr && (
            <Route path="stock-balance-report" element={<StockLevelReport />} />
          )}
        </Route>
      </Route>
    </Routes>
  );
};

export default RoutesManagment;
