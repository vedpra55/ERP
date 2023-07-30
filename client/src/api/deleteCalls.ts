import { toast } from "react-hot-toast";
import client from "./client";
import { catchAsyncError } from "./catchError";

export const deleteUser = async (val: any, token: string) => {
  const item = {
    ...val,
  };

  try {
    const { data } = await client.put(
      "/system/auth/delete",
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
export const deletePurchaseOrderProduct = async (val: any, token: string) => {
  const item = {
    ...val,
  };

  try {
    const { data } = await client.put(
      "/transaction/purchaseOrder/delete",
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
