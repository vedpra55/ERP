import { toast } from "react-hot-toast";
import { catchAsyncError } from "./catchError";
import client from "./client";
import { departmentForm } from "@components/form/CategoryForm";
import { locationFormValues } from "@components/form/LocationForm";
import { productFormValues } from "@components/form/ProductForm";
import { supplierFormValue } from "@components/form/SupplierForm";

export const createRole = async (
  roleName: string,
  subCompanyId: number,
  token: string
) => {
  const item = {
    roleName,
    subCompanyId: subCompanyId,
  };

  try {
    const { data } = await client.post(
      "/system/role",
      {
        ...item,
      },
      {
        headers: {
          Authorization: "Bearer " + token,
        },
      }
    );
    return data.message;
  } catch (err) {
    const message = catchAsyncError(err);
    toast.error(message.message);
  }
};

export const createUser = async (
  email: string,
  password: string,
  username: string,
  companyId: number,
  roleName: string,
  subCompanyId: number,
  token: string
) => {
  const item = {
    email,
    password,
    companyId,
    roleName,
    username,
    subCompanyId,
  };

  try {
    const { data } = await client.post(
      "/system/auth/createUser",
      {
        ...item,
      },
      {
        headers: {
          Authorization: "Bearer " + token,
        },
      }
    );
    return data.message;
  } catch (err) {
    const message = catchAsyncError(err);
    toast.error(message.message);
  }
};

export const createSubCompany = async (
  subCompanyName: string,
  token: string
) => {
  const item = {
    name: subCompanyName,
  };

  try {
    const { data } = await client.post(
      "/system/subCompany",
      {
        ...item,
      },
      {
        headers: {
          Authorization: "Bearer " + token,
        },
      }
    );
    return data.message;
  } catch (err) {
    const message = catchAsyncError(err);
    toast.error(message.message);
  }
};

export const createCategory = async (values: departmentForm, token: string) => {
  try {
    const { data } = await client.post(
      "/master/department",
      {
        ...values,
      },
      {
        headers: {
          Authorization: "Bearer " + token,
        },
      }
    );
    return data.message;
  } catch (err) {
    const message = catchAsyncError(err);
    toast.error(message.message);
  }
};

export const createSupplier = async (
  values: supplierFormValue,
  token: string
) => {
  try {
    const { data } = await client.post(
      "/master/supplier",
      {
        ...values,
      },
      {
        headers: {
          Authorization: "Bearer " + token,
        },
      }
    );
    return data.message;
  } catch (err) {
    const message = catchAsyncError(err);
    toast.error(message.message);
  }
};

export const createLocation = async (
  values: locationFormValues,
  token: string
) => {
  try {
    const { data } = await client.post(
      "/master/location",
      {
        ...values,
      },
      {
        headers: {
          Authorization: "Bearer " + token,
        },
      }
    );
    return data.message;
  } catch (err) {
    const message = catchAsyncError(err);
    toast.error(message.message);
  }
};

export const createProduct = async (
  values: productFormValues,
  token: string
) => {
  try {
    const { data } = await client.post(
      "/master/product",
      {
        ...values,
      },
      {
        headers: {
          Authorization: "Bearer " + token,
        },
      }
    );
    return data.message;
  } catch (err) {
    const message = catchAsyncError(err);
    toast.error(message.message);
  }
};

export const createPurchaseOrder = async (values: any, token: string) => {
  try {
    const { data } = await client.post(
      "/transaction/purchaseOrder",
      {
        ...values,
      },
      {
        headers: {
          Authorization: "Bearer " + token,
        },
      }
    );
    return data.message;
  } catch (err) {
    const message = catchAsyncError(err);
    toast.error(message.message);
  }
};

export const addPuchaseOrderPayment = async (values: any, token: string) => {
  try {
    const { data } = await client.post(
      "/transaction/purchaseOrder/payment",
      {
        ...values,
      },
      {
        headers: {
          Authorization: "Bearer " + token,
        },
      }
    );
    return data.message;
  } catch (err) {
    const message = catchAsyncError(err);
    toast.error(message.message);
  }
};

export const createStockTransfer = async (values: any, token: string) => {
  try {
    const { data } = await client.post(
      "/transaction/stockTransfer",
      {
        ...values,
      },
      {
        headers: {
          Authorization: "Bearer " + token,
        },
      }
    );
    return data.message;
  } catch (err) {
    const message = catchAsyncError(err);
    toast.error(message.message);
  }
};
