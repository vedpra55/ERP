import { isAxiosError } from "axios";

export function catchAsyncError(error: any) {
  let mesg = error.message;

  if (isAxiosError(error)) {
    const res = error?.response?.data;
    if (res) mesg = res.error;
  }

  return mesg;
}
