export const fillterSuppliers = (suppliers, suppliers2) => {
  const supplier = suppliers.filter(
    (item1) =>
      !suppliers2.some((item2) => item1.supplier_code === item2.supplier_code)
  );

  return supplier;
};

export const calulatePurhcaseOrderNumbers = (
  product,
  costRate,
  freight,
  supplierCostRate,
  subTotal,
  total
) => {
  console.log(costRate, freight, supplierCostRate, total, product, "service");

  const unitPrice = parseFloat(product.cost_fc);
  const qty = parseInt(product.qty_ordered);

  const productValue = unitPrice * qty;

  let freightValue = 0;
  if (freight) {
    freightValue = (parseFloat(productValue) / subTotal) * freight;
  }

  let supplierCostValue = 0;
  if (supplierCostRate) {
    supplierCostValue = (supplierCostRate / 100) * total;
  }

  const nonVendorCostWeightage =
    (parseFloat(productValue) / total) * parseFloat(supplierCostValue);

  const itemValue = unitPrice * qty + (nonVendorCostWeightage + freightValue);

  const costFc = itemValue / qty;

  const costLocal = costFc * costRate;

  return {
    costFc,
    costLocal,
  };
};

export const calulateAvarageNumber = (
  existingQty,
  costLocal,
  newCostLocal,
  newQty
) => {
  console.log(existingQty, costLocal, newCostLocal, newQty, "avarage");

  const qty_received = existingQty;
  const productTotal = qty_received * costLocal;
  const newValue = newQty * newCostLocal;
  const totalQty = qty_received + newQty;

  let averageCost = (productTotal + newValue) / totalQty;

  if (!averageCost) averageCost = 0;

  return {
    averageCost,
  };
};
