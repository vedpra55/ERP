export type Company = {
  company_id: number;
  company_name: string;
};

export type SubCompany = {
  sub_company_id: number;
  sub_company_name: string;
};

export type Program = {
  sub_company_id: number;
  program_id: number;
  program_name: string;
};

export type Role = {
  role_name: string;
};

export type RolePrograms = {
  access: boolean;
  program_id: number;
  role_name: string;
  program_name: string;
};

export type CreatedUser = {
  email: string;
  password: string;
  username: string;
  company_id: number;
  role_name: string;
  sub_company_id: number;
  token: string;
};

export interface TotalCount {
  totalCount: number;
}

export type Category = {
  department_code: string;
  department_name: string;
  closed_flag: boolean;
  created_on: Date;
  created_by: string;
};

export type CategoryWithTotalCount = {
  category: Category[];
  totalCount: TotalCount;
};

export type Location = {
  location_code: string;
  location_name: string;
  short_name: string;
  closed_flag: boolean;
};

export type LocationWithTotalCount = {
  location: Location[];
  totalCount: TotalCount;
};

export type Product = {
  department_name: string;
  department_code: string;
  product_code: string;
  product_description: string;
  qty_instock: number;
  qty_purchase: number;
  qty_backorder: number;
  cost_price: number;
  closed_flag: boolean;
  created_on: Date;
  created_by: string;
  selling_price: number;
};

export type ProductWithTotalCount = {
  product: Product[];
  totalCount: TotalCount;
};

export type Supplier = {
  supplier_code: string;
  supplier_name: string;
  address_1: string;
  address_2: string;
  country: string;
  telephone_no: number;
  mobile_no: number;
  email: string;
  fax: string;
  closed_flag: boolean | null | undefined;
  created_on: Date;
};

export type SupplierWithTotalCount = {
  supplier: Supplier[];
  totalCount: TotalCount;
};

export type ProductWithSupplier = {
  product: Product;
  suppliers: Supplier[];
};

export type PurchaseOrder = {
  order_no: string;
  location_code: string;
  order_dt: Date;
  supplier_code: string;
  supplier: string;
  location: string;
  eta: Date;
  currency: string;
  cost_rate: string;
  supplier_invno: string;
  remarks: string;
  freight: number;
  order_amount: number;
  amount_paid: number;
  non_vendor_cost: number;
  closed_flag: boolean;
  fulfilled_flag: boolean;
  paid_flag: boolean;
};

export type PurchaseOrderWithTotalCount = {
  purchaseOrder: PurchaseOrder[];
  totalCount: TotalCount;
};

export type PurchaseOrderDetails = {
  order_no: string;
  serial_no: number;
  department_code: string;
  product_code: string;
  qty_ordered: number;
  qty_received: number;
  cost_local: number;
  cost_fc: number;
};

export type PaymentDetails = {
  order_no: string;
  payment_no: number;
  payment_dt: Date;
  remarks: string;
  amount: number;
};

export type PurchaseOrderWithDetails = {
  purchaseOrder: PurchaseOrder;
  purchaseOrderDetails: PurchaseOrderDetails[];
  paymentDetails: PaymentDetails[];
};

export type StockTransfer = {
  from_location: string;
  to_location: string;
  from_location_code: string;
  to_location_code: string;
  transfer_no: string;
  transfer_dt: Date;
  acknowledge_dt: Date;
  received_by: string;
  remarks: string;
};

export type StockTransferWithTotalCount = {
  stockTransfer: StockTransfer[];
  totalCount: TotalCount;
};

export type StockTransferDetails = {
  transfer_no: string;
  serial_no: number;
  department_code: string;
  product_code: string;
  qty_transferred: number;
  from_location: string;
  to_location: string;
};

export type StockTransferWithDetails = {
  transfer: StockTransfer;
  details: StockTransferDetails[];
};

export type Store = {
  qty_instock: number;
};
