import client from "./client";
import {
  Category,
  Company,
  CreatedUser,
  Location,
  Product,
  ProductWithSupplier,
  Program,
  PurchaseOrder,
  PurchaseOrderWithDetails,
  Role,
  StockTransfer,
  StockTransferWithDetails,
  Store,
  SubCompany,
  Supplier,
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
  subCompanyId: number,
  token: string
): Promise<any | undefined> => {
  try {
    const { data } = await client(
      `/system/program/role?subCompanyId=${subCompanyId}`,
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
  token: string
): Promise<Category[] | undefined> => {
  try {
    const { data } = await client(`/master/department`, {
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
  token: string
): Promise<Supplier[] | undefined> => {
  try {
    const { data } = await client(`/master/supplier`, {
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
  token: string
): Promise<Location[] | undefined> => {
  try {
    const { data } = await client(`/master/location/`, {
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
  token: string
): Promise<Product[] | undefined> => {
  try {
    const { data } = await client(`/master/product`, {
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
  }
};

export const fetchPurchaseOrders = async (
  token: string
): Promise<PurchaseOrder[] | undefined> => {
  try {
    const { data } = await client(`/transaction/purchaseOrder`, {
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
  }
};

export const fetchStockTransfers = async (
  token: string
): Promise<StockTransfer[] | undefined> => {
  try {
    const { data } = await client(`/transaction/stockTransfer`, {
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
  }
};
