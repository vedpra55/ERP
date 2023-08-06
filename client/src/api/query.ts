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

  const useFetchRolePrograms = (role?: any, pageNo?: any) => {
    const query = ["role-programs"];

    if (pageNo) {
      query.push(pageNo);
    }

    if (role) query.push(role);

    return useQuery(query, {
      queryFn: () => fethchRolePrograms(role, pageNo, user.access_token),
      onError(err) {
        const message = catchAsyncError(err);
        toast.error(message.message);
      },
    });
  };

  const useFetchCategories = (searchText?: string, count?: any, page?: any) => {
    let key = searchText ? ["categories", searchText] : ["categories"];
    if (count) {
      key.push(count);
    }

    if (page) {
      key.push(page);
    }

    return useQuery(key, {
      queryFn: () =>
        fetchCategories(searchText || "", count, page, user.access_token),
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

  const useFetchLocations = (searchText?: string, count?: any, page?: any) => {
    let key = searchText ? ["locations", searchText] : ["locations"];
    if (count) {
      key.push(count);
    }

    if (page) {
      key.push(page);
    }

    return useQuery(key, {
      queryFn: () =>
        fetchLocations(searchText || "", count, page, user.access_token),
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

  const useFetchSuppliers = (searchText?: string, count?: any, page?: any) => {
    let key = searchText ? ["suppliers", searchText] : ["suppliers"];
    if (count) {
      key.push(count);
    }

    if (page) {
      key.push(page);
    }

    console.log(page);

    return useQuery(key, {
      queryFn: () =>
        fetchSuppliers(searchText || "", count, page, user.access_token),
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

  const useFetchProducts = (
    searchText?: string,
    departmentCode?: string,
    count?: any,
    page?: any
  ) => {
    let key = searchText ? ["products", searchText] : ["products"];
    if (count) {
      key.push(count);
    }
    if (departmentCode) {
      key.push(departmentCode);
    }

    if (page) {
      key.push(page);
    }

    return useQuery(key, {
      queryFn: () =>
        fetchProducts(
          searchText || "",
          departmentCode || "",
          count,
          page,
          user.access_token
        ),
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

  const useFetchPurchaseOrders = (filterValue?: any, page?: any) => {
    let query = ["purchase-orders", filterValue];

    if (page) {
      query.push(page);
    }

    return useQuery(query, {
      queryFn: () => fetchPurchaseOrders(filterValue, page, user.access_token),
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

  const useFetchStockTransfers = (searchText?: string, page?: any) => {
    const query = ["stock-transfers", searchText];

    if (page) {
      query.push(page);
    }

    return useQuery(query, {
      queryFn: () =>
        fetchStockTransfers(searchText || "", page, user.access_token),
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
