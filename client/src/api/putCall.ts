import { toast } from "react-hot-toast";
import { catchAsyncError } from "./catchError";
import client from "./client";
import { departmentForm } from "@components/form/CategoryForm";
import { locationFormValues } from "@components/form/LocationForm";
import { productFormValues } from "@components/form/ProductForm";
import { supplierFormValue } from "@components/form/SupplierForm";

export const updateSubCompanyName = async (
  name: string,
  subCompanyId: number,
  companyId: number,
  token: string
) => {
  const item = { name, subCompanyId, companyId };

  try {
    const { data } = await client.put(
      "/system/subCompany/",
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

export const updateUserRoleProgram = async (
  value: any,
  subCompanyId: number,
  token: string
) => {
  const item = { ...value, subCompanyId };

  try {
    const { data } = await client.put(
      "/system/role/updateRoleProgramAccess",
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

export const updateCategory = async (values: departmentForm, token: string) => {
  try {
    const { data } = await client.put(
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

export const updateLocation = async (
  values: locationFormValues,
  token: string
) => {
  try {
    const { data } = await client.put(
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

export const updateSupplier = async (
  values: supplierFormValue,
  token: string
) => {
  try {
    const { data } = await client.put(
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

export const updateProduct = async (
  values: productFormValues,
  token: string
) => {
  try {
    const { data } = await client.put(
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

export const fullFillPurchaseOrder = async (values: any, token: string) => {
  try {
    const { data } = await client.put(
      "/transaction/purchaseOrder/fullFill",
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

export const acknowledgeStockTransfer = async (value: any, token: string) => {
  const item = {
    ...value,
  };

  try {
    const { data } = await client.put(
      "/transaction/stockTransfer/acknowledge",
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

export const editUser = async (values: any, token: string) => {
  try {
    const { data } = await client.put(
      "system/auth",
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

export const editPurchaseOrder = async (values : any, token  : string) => {
  try {
    const { data } = await client.put(
      "transaction/purchaseOrder",
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
}