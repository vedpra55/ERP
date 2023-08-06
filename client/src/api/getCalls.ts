import client from "./client";
import {
  Category,
  CategoryWithTotalCount,
  Company,
  CreatedUser,
  Location,
  LocationWithTotalCount,
  Product,
  ProductWithSupplier,
  ProductWithTotalCount,
  Program,
  PurchaseOrder,
  PurchaseOrderWithDetails,
  PurchaseOrderWithTotalCount,
  Role,
  StockTransfer,
  StockTransferWithDetails,
  StockTransferWithTotalCount,
  Store,
  SubCompany,
  Supplier,
  SupplierWithTotalCount,
} from "@@types/system";
import { toast } from "react-hot-toast";
import { catchAsyncError } from "./catchError";

export const fethchCompany = async (
  companyId: number
): Promise<Company | undefined> => {
  try {
    const { data } = await client(`/system/company?companyId=${companyId}`);
    const res = data?.res;
    return res;
  } catch (err) {
    const message = catchAsyncError(err);
    toast.error(message.message);
  }
};

export const fethchSubCompany = async (
  companyId: number,
  subCompanyId: number,
  token: string
): Promise<SubCompany | undefined> => {
  try {
    const { data } = await client(
      `/system/subCompany/id?companyId=${companyId}&subCompanyId=${subCompanyId}`,
      {
        headers: {
          Authorization: "Bearer " + token,
        },
      }
    );
    const res = data?.res;
    return res;
  } catch (err) {
    const message = catchAsyncError(err);
    toast.error(message.message);
  }
};

export const fethchProgram = async (
  selectedSubCompanyId: number,
  roleName: string,
  token: string
): Promise<Program[] | undefined> => {
  try {
    const { data } = await client(
      `/system/program?selectedSubCompanyId=${selectedSubCompanyId}&roleName=${roleName}`,
      {
        headers: {
          Authorization: "Bearer " + token,
        },
      }
    );
    const res = data?.res;
    return res;
  } catch (err) {
    //const message = catchAsyncError(err);
    // toast.error(message.message);
  }
};

export const fetchRoles = async (
  subCompanyId: number,
  token: string
): Promise<Role[] | undefined> => {
  try {
    const { data } = await client(`/system/role?subCompanyId=${subCompanyId}`, {
      headers: {
        Authorization: "Bearer " + token,
      },
    });
    const res = data?.res;
    return res;
  } catch (err) {
    const message = catchAsyncError(err);
    toast.error(message.message);
  }
};

export const fetchCreatedUsers = async (
  subCompanyId: number,
  token: string
): Promise<CreatedUser[] | undefined> => {
  try {
    const { data } = await client(
      `/system/auth/subCompanyUsers?subCompanyId=${subCompanyId}`,
      {
        headers: {
          Authorization: "Bearer " + token,
        },
      }
    );
    const res = data?.res;
    return res;
  } catch (err) {
    const message = catchAsyncError(err);
    toast.error(message.message);
  }
};

export const fethchSubCompanies = async (
  token: string
): Promise<SubCompany[] | undefined> => {
  try {
    const { data } = await client(`/system/subCompany/`, {
      headers: {
        Authorization: "Bearer " + token,
      },
    });
    const res = data?.res;
    return res;
  } catch (err) {
    const message = catchAsyncError(err);
    toast.error(message.message);
  }
};

export const fethchRolePrograms = async (
  role: any,
  page: any,
  token: string
): Promise<any | undefined> => {
  try {
    const { data } = await client(
      `/system/program/role?page=${page}&role=${role}`,
      {
        headers: {
          Authorization: "Bearer " + token,
        },
      }
    );
    const res = data?.res;
    return res;
  } catch (err) {
    const message = catchAsyncError(err);
    toast.error(message.message);
  }
};

export const fetchCategories = async (
  searchText: string,
  count: number,
  page: number,
  token: string
): Promise<CategoryWithTotalCount | undefined> => {
  try {
    const { data } = await client(
      `/master/department?searchText=${searchText}&count=${count}&page=${page}`,
      {
        headers: {
          Authorization: "Bearer " + token,
        },
      }
    );
    const res = data?.res;
    const total = res?.totalCount;
    const departments: Category[] = res?.departments;

    const d: CategoryWithTotalCount = {
      category: departments,
      totalCount: {
        totalCount: total,
      },
    };

    return d;
  } catch (err) {
    const message = catchAsyncError(err);
    toast.error(message.message);
  }
};

export const fetchSingleCategory = async (
  departmentCode: string,
  token: string
): Promise<Category | undefined> => {
  try {
    const { data } = await client(
      `/master/department/id?departmentCode=${departmentCode}`,
      {
        headers: {
          Authorization: "Bearer " + token,
        },
      }
    );
    const res = data?.res;
    return res;
  } catch (err) {
    const message = catchAsyncError(err);
    toast.error(message.message);
  }
};

export const fetchSuppliers = async (
  searchText: string,
  count: number,
  page: number,
  token: string
): Promise<SupplierWithTotalCount | undefined> => {
  try {
    const { data } = await client(
      `/master/supplier?searchText=${searchText}&count=${count}&page=${page}`,
      {
        headers: {
          Authorization: "Bearer " + token,
        },
      }
    );
    const res = data?.res;
    const total = res?.totalCount;
    const suppliers: Supplier[] = res?.suppliers;

    const d: SupplierWithTotalCount = {
      supplier: suppliers,
      totalCount: {
        totalCount: total,
      },
    };

    return d;
  } catch (err) {
    const message = catchAsyncError(err);
    toast.error(message.message);
  }
};

export const fetchSingleSupplier = async (
  supplierCode: string,
  token: string
): Promise<Supplier | undefined> => {
  try {
    const { data } = await client(
      `/master/supplier/id?supplierCode=${supplierCode}`,
      {
        headers: {
          Authorization: "Bearer " + token,
        },
      }
    );
    const res = data?.res;
    return res;
  } catch (err) {
    const message = catchAsyncError(err);
    toast.error(message.message);
  }
};

export const fetchLocations = async (
  searchText: string,
  count: number,
  page: number,
  token: string
): Promise<LocationWithTotalCount | undefined> => {
  try {
    const { data } = await client(
      `/master/location?searchText=${searchText}&count=${count}&page=${page}`,
      {
        headers: {
          Authorization: "Bearer " + token,
        },
      }
    );

    const res = data?.res;
    const total = res?.totalCount;
    const locations: Location[] = res?.locations;

    const d: LocationWithTotalCount = {
      location: locations,
      totalCount: {
        totalCount: total,
      },
    };

    return d;
  } catch (err) {
    const message = catchAsyncError(err);
    toast.error(message.message);
  }
};

export const fetchSingleLocation = async (
  locationCode: string,
  token: string
): Promise<Location | undefined> => {
  try {
    const { data } = await client(
      `/master/location/id?locationCode=${locationCode}`,
      {
        headers: {
          Authorization: "Bearer " + token,
        },
      }
    );
    const res = data?.res;
    return res;
  } catch (err) {
    const message = catchAsyncError(err);
    toast.error(message.message);
  }
};

export const fetchProducts = async (
  searchText: string,
  departmentCode: string,
  count: number,
  page: number,
  token: string
): Promise<ProductWithTotalCount | undefined> => {
  try {
    const { data } = await client(
      `/master/product?searchText=${searchText}&count=${count}&departmentCode=${departmentCode}&page=${page}`,
      {
        headers: {
          Authorization: "Bearer " + token,
        },
      }
    );

    const res = data?.res;
    const total = res?.totalCount;
    const products: Product[] = res?.products;

    const d: ProductWithTotalCount = {
      product: products,
      totalCount: {
        totalCount: total,
      },
    };

    return d;
  } catch (err) {
    const message = catchAsyncError(err);
    toast.error(message.message);
    throw message.message;
  }
};

export const fetchSingleProduct = async (
  productCode: string,
  departmentCode: string,
  token: string
): Promise<ProductWithSupplier | undefined> => {
  try {
    const { data } = await client(
      `/master/product/id?productCode=${productCode}&departmentCode=${departmentCode}`,
      {
        headers: {
          Authorization: "Bearer " + token,
        },
      }
    );
    const res = data?.res;
    return res;
  } catch (err) {
    const message = catchAsyncError(err);
    toast.error(message.message);
    throw message.message;
  }
};

export const fetchPurchaseOrders = async (
  filterValue: any,
  page: any,
  token: string
): Promise<PurchaseOrderWithTotalCount | undefined> => {
  try {
    const { searchText, fullFillStatus, paidStatus, fromDate, toDate } =
      filterValue;

    const { data } = await client(
      `/transaction/purchaseOrder?searchText=${searchText}&fullFillStatus=${fullFillStatus}&paidStatus=${paidStatus}&fromDate=${fromDate}&toDate=${toDate}&page=${page}`,
      {
        headers: {
          Authorization: "Bearer " + token,
        },
      }
    );

    const res = data?.res;
    const total = res?.totalCount;
    const purchaseOrders: PurchaseOrder[] = res?.purchaseOrders;

    const d: PurchaseOrderWithTotalCount = {
      purchaseOrder: purchaseOrders,
      totalCount: {
        totalCount: total,
      },
    };

    return d;
  } catch (err) {
    const message = catchAsyncError(err);
    toast.error(message.message);
    throw message.message;
  }
};

export const fetchSinglePurchaseOrder = async (
  orderNo: string,
  token: string
): Promise<PurchaseOrderWithDetails | undefined> => {
  try {
    const { data } = await client(
      `/transaction/purchaseOrder/id?orderNo=${orderNo}`,
      {
        headers: {
          Authorization: "Bearer " + token,
        },
      }
    );
    const res = data?.res;
    return res;
  } catch (err) {
    const message = catchAsyncError(err);
    toast.error(message.message);
    throw message.message;
  }
};

export const fetchStockTransfers = async (
  searchText: string,
  page: any,
  token: string
): Promise<StockTransferWithTotalCount | undefined> => {
  try {
    const { data } = await client(
      `/transaction/stockTransfer?searchText=${searchText}&page=${page}`,
      {
        headers: {
          Authorization: "Bearer " + token,
        },
      }
    );

    const res = data?.res;
    const total = res?.totalCount;
    const stockTransfers: StockTransfer[] = res?.transfers;

    const d: StockTransferWithTotalCount = {
      stockTransfer: stockTransfers,
      totalCount: {
        totalCount: total,
      },
    };

    return d;
  } catch (err) {
    const message = catchAsyncError(err);
    toast.error(message.message);
    throw message.message;
  }
};

export const fetchSingleStockTransfer = async (
  toLocation: string,
  fromLocation: string,
  transferNo: string,
  token: string
): Promise<StockTransferWithDetails | undefined> => {
  try {
    const { data } = await client(
      `/transaction/stockTransfer/id?transferNo=${transferNo}&fromLocation=${fromLocation}&toLocation=${toLocation}`,
      {
        headers: {
          Authorization: "Bearer " + token,
        },
      }
    );
    const res = data?.res;
    return res;
  } catch (err) {
    const message = catchAsyncError(err);
    toast.error(message.message);
    throw message.message;
  }
};

export const fetchProductQtyFromStore = async (
  locationCode: string,
  departmentCode: string,
  productCode: string,
  token: string
): Promise<Store | undefined> => {
  try {
    const { data } = await client(
      `/transaction/stockTransfer/storeQty?locationCode=${locationCode}&departmentCode=${departmentCode}&productCode=${productCode}`,
      {
        headers: {
          Authorization: "Bearer " + token,
        },
      }
    );
    const res = data?.res?.storeQty;
    return res;
  } catch (err) {
    const message = catchAsyncError(err);
    toast.error(message.message);
    throw message.message;
  }
};
