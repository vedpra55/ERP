import * as yup from "yup";

export const signupSchema = yup.object({
  username: yup
    .string()
    .required("Username is required")
    .matches(/^[a-zA-Z_]+$/, "Not use special character")
    .trim(),
  email: yup
    .string()
    .email("Invalide Email")
    .required("Email is required")
    .trim(),
  password: yup
    .string()
    .required("Passoword is required")
    .min(5, "Min lenght is 5")
    .max(20, "Max length is 20")
    .trim(),
  companyName: yup.string().required("Company name is required").trim(),
});

export const siginSchema = yup.object({
  username: yup
    .string()
    .required("Username is required")
    .matches(/^[a-zA-Z]+$/, "Not use special character")
    .trim(),
  email: yup
    .string()
    .email("Invalide Email")
    .required("Email is required")
    .trim(),
  password: yup
    .string()
    .required("Passoword is required")
    .min(5, "Min lenght is 5")
    .max(20, "Max length is 20")
    .trim(),
});

export const createUserSchema = yup.object({
  username: yup
    .string()
    .required("Username is required")
    .matches(/^[a-zA-Z_]+$/, "Not use special character")
    .trim(),
  email: yup
    .string()
    .email("Invalide Email")
    .required("Email is required")
    .trim(),
  password: yup
    .string()
    .required("Passoword is required")
    .min(5, "Min lenght is 5")
    .max(20, "Max length is 20")
    .trim(),
  roleName: yup.string().required("Role name is required").trim(),
});

export const categorySchema = yup.object({
  departmentCode: yup
    .string()
    .required("Category Code code is required")
    .min(3, "Max length is 3")
    .max(3, "Max length is 3")
    .trim(),
  departmentName: yup.string().required("Category Name  is required").trim(),
});

export const supplierSchema = yup.object({
  supplierCode: yup
    .string()
    .required("Supplier code is required")
    .min(3, "Max length is 3")
    .max(3, "Max length is 3")
    .trim(),
  supplierName: yup.string().required("Supplier Name  is required").trim(),
  address1: yup.string().required("Address 1 is required").trim(),
  address2: yup.string().required("Address 2 is required").trim(),
  country: yup.string().required("country 2 is required").trim(),
  telephoneNo: yup.number().required("Telephone number is required"),
  mobileNo: yup.number().required("Telephone number is required"),
  email: yup.string().email("Invalide Email").required("email is required"),
  fax: yup.string().required("Fax is required"),
});

export const locationSchema = yup.object({
  locationCode: yup
    .string()
    .min(2, "Min length is 2")
    .max(10, "Max length is 10")
    .required("Location code is required"),
  locationName: yup.string().required("Location name is required"),
  shortName: yup.string().required("Short name is required"),
});

export const productSchema = yup.object({
  departmentCode: yup
    .string()
    .min(3, "Min length is 3")
    .max(3, "Max length is 3")
    .required("Department code is required"),
  productCode: yup
    .string()
    .min(3, "Min length is 3")
    .max(10, "Max length is 10")
    .required("Product code is required"),
  productDescription: yup.string().required("Product Description  is required"),
});

export const purchaseOrderSchema = yup.object().shape({
  orderNo: yup.string().required("Order Name is required"),
  locationCode: yup.string().required("Location Code is required"),
  supplierCode: yup.string().required("Supplier Code is required"),
  currency: yup.string().required("Currency  is required"),
  costRate: yup.number().required("Cost Rate is required"),
  supplierInvo: yup.string().required("Supplier Invoice is required"),
  remarks: yup.string().required("Remarks is required"),
  freight: yup.number().required("Freight is required"),
  nonVendorCost: yup.number().required("Non Vendor Cost is required"),
  dueDate: yup.date().required("Due date is required"),
});

export const stockTransferSchema = yup.object().shape({
  toLocation: yup.string().required("To Location is required"),
  fromLocation: yup.string().required("From Location is required"),
  remarks: yup.string().required(" Remarks is required"),
});
