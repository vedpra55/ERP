import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import {
  addPuchaseOrderPayment,
  createCategory,
  createLocation,
  createProduct,
  createPurchaseOrder,
  createRole,
  createStockTransfer,
  createSubCompany,
  createSupplier,
  createUser,
} from "./postCalls";
import { useAuthContext } from "@context/AuthContext";
import { CreateUserFormValues } from "@components/system/createUser";
import {
  acknowledgeStockTransfer,
  fullFillPurchaseOrder,
  updateCategory,
  updateLocation,
  updateProduct,
  updateSubCompanyName,
  updateSupplier,
  updateUserRoleProgram,
} from "./putCall";
import { departmentForm } from "@components/form/CategoryForm";

import { supplierFormValue } from "@components/form/SupplierForm";
import { locationFormValues } from "@components/form/LocationForm";
import { productFormValues } from "@components/form/ProductForm";

const useCreateMution = () => {
  const { user } = useAuthContext();
  const queryClient = useQueryClient();

  const createRoleMutation = useMutation(
    (roleName: string) =>
      createRole(roleName, user.subCompanyId, user.access_token),
    {
      onError: (error) => {
        console.log(error);
      },
      onSuccess: (data: string) => {
        queryClient.invalidateQueries({ queryKey: ["roles"] });
        toast.success(data);
      },
    }
  );

  const createUserMutation = useMutation(
    (data: CreateUserFormValues) =>
      createUser(
        data.email,
        data.password,
        data.username,
        user.companyId,
        data.roleName,
        user.selectedSubCompany,
        user.access_token
      ),
    {
      onError: (error) => {
        console.log(error);
      },
      onSuccess: (data: string) => {
        queryClient.invalidateQueries({ queryKey: ["created-users"] });
        toast.success(data);
      },
    }
  );

  const createSubCompanyMutation = useMutation(
    (subCompanyName: string) =>
      createSubCompany(subCompanyName, user.access_token),
    {
      onError: (error) => {
        console.log(error);
      },
      onSuccess: (data: string) => {
        queryClient.invalidateQueries({ queryKey: ["sub-companies"] });
        toast.success(data);
      },
    }
  );

  const updateSubCompanyMutation = useMutation(
    (name: string) =>
      updateSubCompanyName(
        name,
        user.subCompanyId,
        user.companyId,
        user.access_token
      ),
    {
      onError: (error) => {
        console.log(error);
      },
      onSuccess: (data: string) => {
        queryClient.invalidateQueries({ queryKey: ["sub-companies"] });
        toast.success(data);
      },
    }
  );

  const updateUserRoleProgramAccess = useMutation(
    (value: any) =>
      updateUserRoleProgram(value, user.subCompanyId, user.access_token),
    {
      onError: (error) => {
        console.log(error);
      },
      onSuccess: (data: string) => {
        queryClient.invalidateQueries({ queryKey: ["role-programs"] });
        toast.success(data);
      },
    }
  );

  const createCategoryMutation = useMutation(
    (values: departmentForm) => createCategory(values, user.access_token),
    {
      onError: (error) => {
        console.log(error);
      },
      onSuccess: (data: string) => {
        queryClient.invalidateQueries({ queryKey: ["categories"] });
        toast.success(data);
      },
    }
  );

  const updateCategoryMutation = useMutation(
    (values: departmentForm) => updateCategory(values, user.access_token),
    {
      onError: (error) => {
        console.log(error);
      },
      onSuccess: (data: string) => {
        queryClient.invalidateQueries({ queryKey: ["categories"] });
        toast.success(data);
      },
    }
  );

  const createSupplierMutation = useMutation(
    (values: supplierFormValue) => createSupplier(values, user.access_token),
    {
      onError: (error) => {
        console.log(error);
      },
      onSuccess: (data: string) => {
        queryClient.invalidateQueries({ queryKey: ["suppliers"] });
        toast.success(data);
      },
    }
  );

  const updateSupplierMutation = useMutation(
    (values: supplierFormValue) => updateSupplier(values, user.access_token),
    {
      onError: (error) => {
        console.log(error);
      },
      onSuccess: (data: string) => {
        queryClient.invalidateQueries({ queryKey: ["suppliers"] });
        toast.success(data);
      },
    }
  );

  const createLocationMutation = useMutation(
    (values: locationFormValues) => createLocation(values, user.access_token),
    {
      onError: (error) => {
        console.log(error);
      },
      onSuccess: (data: string) => {
        queryClient.invalidateQueries({ queryKey: ["locations"] });
        toast.success(data);
      },
    }
  );

  const updateLocationMutation = useMutation(
    (values: locationFormValues) => updateLocation(values, user.access_token),
    {
      onError: (error) => {
        console.log(error);
      },
      onSuccess: (data: string) => {
        queryClient.invalidateQueries({ queryKey: ["locations"] });
        toast.success(data);
      },
    }
  );

  const createProductMutation = useMutation(
    (values: productFormValues) => createProduct(values, user.access_token),
    {
      onError: (error) => {
        console.log(error);
      },
      onSuccess: (data: string) => {
        queryClient.invalidateQueries({ queryKey: ["products"] });
        toast.success(data);
      },
    }
  );

  const updateProductMutation = useMutation(
    (values: productFormValues) => updateProduct(values, user.access_token),
    {
      onError: (error) => {
        console.log(error);
      },
      onSuccess: (data: string) => {
        queryClient.invalidateQueries({ queryKey: ["products"] });
        toast.success(data);
      },
    }
  );

  const createPurchaseOrderMutation = useMutation(
    (values: any) => createPurchaseOrder(values, user.access_token),
    {
      onError: (error) => {
        console.log(error);
      },
      onSuccess: (data: string) => {
        queryClient.invalidateQueries({ queryKey: ["purchase-orders"] });
        toast.success(data);
      },
    }
  );

  const addPurchaseOrderPaymentMutation = useMutation(
    (values: any) => addPuchaseOrderPayment(values, user.access_token),
    {
      onError: (error) => {
        console.log(error);
      },
      onSuccess: (data: string) => {
        queryClient.invalidateQueries({ queryKey: ["purchase-order"] });
        toast.success(data);
      },
    }
  );

  const fullFillPurchaseOrderMutation = useMutation(
    (values: any) => fullFillPurchaseOrder(values, user.access_token),
    {
      onError: (error) => {
        console.log(error);
      },
      onSuccess: (data: string) => {
        queryClient.invalidateQueries({ queryKey: ["purchase-order"] });
        toast.success(data);
      },
    }
  );

  const createStockTransferMutation = useMutation(
    (values: any) => createStockTransfer(values, user.access_token),
    {
      onError: (error) => {
        console.log(error);
      },
      onSuccess: (data: string) => {
        queryClient.invalidateQueries({ queryKey: ["stock-transfers"] });
        toast.success(data);
      },
    }
  );

  const acknowledgeStockTransferMutation = useMutation(
    (value: any) => acknowledgeStockTransfer(value, user.access_token),
    {
      onError: (error) => {
        console.log(error);
      },
      onSuccess: (data: string) => {
        queryClient.invalidateQueries({ queryKey: ["stock-transfers"] });
        toast.success(data);
      },
    }
  );

  return {
    createRoleMutation,
    createUserMutation,
    createSubCompanyMutation,
    updateSubCompanyMutation,
    updateUserRoleProgramAccess,
    createCategoryMutation,
    updateCategoryMutation,
    createSupplierMutation,
    createLocationMutation,
    updateLocationMutation,
    createProductMutation,
    updateProductMutation,
    createPurchaseOrderMutation,
    addPurchaseOrderPaymentMutation,
    fullFillPurchaseOrderMutation,
    updateSupplierMutation,
    createStockTransferMutation,
    acknowledgeStockTransferMutation,
  };
};

export default useCreateMution;
