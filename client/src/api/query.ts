import { useQuery } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { catchAsyncError } from "./catchError";
import {
  fetchCategories,
  fetchCreatedUsers,
  fetchLocations,
  fetchProductQtyFromStore,
  fetchProducts,
  fetchPurchaseOrders,
  fetchRoles,
  fetchSingleCategory,
  fetchSingleLocation,
  fetchSingleProduct,
  fetchSinglePurchaseOrder,
  fetchSingleStockTransfer,
  fetchSingleSupplier,
  fetchStockTransfers,
  fetchSuppliers,
  fethchCompany,
  fethchProgram,
  fethchRolePrograms,
  fethchSubCompanies,
  fethchSubCompany,
} from "./getCalls";
import { useAuthContext } from "@context/AuthContext";

const useApiServices = () => {
  const { user } = useAuthContext();

  const useFetchCompany = () => {
    return useQuery(["company"], {
      queryFn: () => fethchCompany(user.companyId),
      onError(err) {
        const message = catchAsyncError(err);
        toast.error(message.message);
      },
    });
  };

  const useFetchSubCompany = () => {
    return useQuery(["subCompany"], {
      queryFn: () =>
        fethchSubCompany(
          user.companyId,
          user.selectedSubCompany,
          user.access_token
        ),
      onError(err) {
        const message = catchAsyncError(err);
        toast.error(message.message);
      },
    });
  };

  const useFetchProgram = () => {
    return useQuery(["program", user], {
      queryFn: () =>
        fethchProgram(
          user.selectedSubCompany,
          user.roleName,
          user.access_token
        ),
      onError(err) {
        const message = catchAsyncError(err);
        console.log(message);
        //toast.error(message.message);
      },
    });
  };

  const useFetchRoles = () => {
    return useQuery(["roles"], {
      queryFn: () => fetchRoles(user.subCompanyId, user.access_token),
      onError(err) {
        const message = catchAsyncError(err);
        toast.error(message.message);
      },
    });
  };

  const useFetchCreateUser = () => {
    return useQuery(["created-users"], {
      queryFn: () =>
        fetchCreatedUsers(user.selectedSubCompany, user.access_token),
      onError(err) {
        const message = catchAsyncError(err);
        toast.error(message.message);
      },
    });
  };

  const useFetchSubCompanies = () => {
    return useQuery(["sub-companies"], {
      queryFn: () => fethchSubCompanies(user.access_token),
      onError(err) {
        const message = catchAsyncError(err);
        toast.error(message.message);
      },
    });
  };

  const useFetchRolePrograms = () => {
    return useQuery(["role-programs"], {
      queryFn: () => fethchRolePrograms(user.subCompanyId, user.access_token),
      onError(err) {
        const message = catchAsyncError(err);
        toast.error(message.message);
      },
    });
  };

  const useFetchCategories = () => {
    return useQuery(["categories"], {
      queryFn: () => fetchCategories(user.access_token),
      onError(err) {
        const message = catchAsyncError(err);
        toast.error(message.message);
      },
    });
  };

  const useFetchSingleCategory = (departmentCode: string) => {
    return useQuery(["category", departmentCode], {
      queryFn: () => fetchSingleCategory(departmentCode, user.access_token),
      onError(err) {
        const message = catchAsyncError(err);
        toast.error(message.message);
      },
    });
  };

  const useFetchLocations = () => {
    return useQuery(["locations"], {
      queryFn: () => fetchLocations(user.access_token),
      onError(err) {
        const message = catchAsyncError(err);
        toast.error(message.message);
      },
    });
  };

  const useFetchSingleLocation = (locationCode: string) => {
    return useQuery(["location"], {
      queryFn: () => fetchSingleLocation(locationCode, user.access_token),
      onError(err) {
        const message = catchAsyncError(err);
        toast.error(message.message);
      },
    });
  };

  const useFetchSuppliers = () => {
    return useQuery(["suppliers"], {
      queryFn: () => fetchSuppliers(user.access_token),
      onError(err) {
        const message = catchAsyncError(err);
        toast.error(message.message);
      },
    });
  };

  const useFetchSingleSupplier = (supplierCode: string) => {
    return useQuery(["supplier"], {
      queryFn: () => fetchSingleSupplier(supplierCode, user.access_token),
      onError(err) {
        const message = catchAsyncError(err);
        toast.error(message.message);
      },
    });
  };

  const useFetchProducts = () => {
    return useQuery(["products"], {
      queryFn: () => fetchProducts(user.access_token),
      onError(err) {
        const message = catchAsyncError(err);
        toast.error(message.message);
      },
    });
  };

  const useFetchSingleProduct = (
    departmentCode: string,
    productCode: string
  ) => {
    return useQuery(["product"], {
      queryFn: () =>
        fetchSingleProduct(productCode, departmentCode, user.access_token),
      onError(err) {
        const message = catchAsyncError(err);
        toast.error(message.message);
      },
    });
  };

  const useFetchPurchaseOrders = () => {
    return useQuery(["purchase-orders"], {
      queryFn: () => fetchPurchaseOrders(user.access_token),
      onError(err) {
        const message = catchAsyncError(err);
        toast.error(message.message);
      },
    });
  };

  const useFetchSinglePurchaseOrder = (orderNo: string) => {
    return useQuery(["purchase-order"], {
      queryFn: () => fetchSinglePurchaseOrder(orderNo, user.access_token),
      onError(err) {
        const message = catchAsyncError(err);
        toast.error(message.message);
      },
    });
  };

  const useFetchStockTransfers = () => {
    return useQuery(["stock-transfers"], {
      queryFn: () => fetchStockTransfers(user.access_token),
      onError(err) {
        const message = catchAsyncError(err);
        toast.error(message.message);
      },
    });
  };

  const useFetchSingleStockTransfer = (
    transferNo: string,
    toLocation: string,
    fromLocation: string
  ) => {
    return useQuery(["stock-transfer"], {
      queryFn: () =>
        fetchSingleStockTransfer(
          toLocation,
          fromLocation,
          transferNo,
          user.access_token
        ),
      onError(err) {
        const message = catchAsyncError(err);
        toast.error(message.message);
      },
    });
  };

  const useFetchProductQtyFromStore = (
    locationCode: string,
    departmentCode: string,
    productCode: string
  ) => {
    return useQuery(["store"], {
      queryFn: () =>
        fetchProductQtyFromStore(
          locationCode,
          departmentCode,
          productCode,
          user.access_token
        ),
      onError(err) {
        const message = catchAsyncError(err);
        toast.error(message.message);
      },
    });
  };

  return {
    useFetchCompany,
    useFetchSubCompany,
    useFetchProgram,
    useFetchRoles,
    useFetchCreateUser,
    useFetchSubCompanies,
    useFetchRolePrograms,
    useFetchCategories,
    useFetchSingleCategory,
    useFetchLocations,
    useFetchSingleLocation,
    useFetchSuppliers,
    useFetchSingleSupplier,
    useFetchProducts,
    useFetchSingleProduct,
    useFetchPurchaseOrders,
    useFetchSinglePurchaseOrder,
    useFetchStockTransfers,
    useFetchSingleStockTransfer,
    useFetchProductQtyFromStore,
  };
};

export default useApiServices;
