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
  const unitPrice = parseFloat(product.cost_fc);
  let qty = parseInt(product.qty_ordered);
  qty = Math.abs(qty);

  const productValue = unitPrice * qty;

  const newTotal = Math.abs(subTotal) + freight;

  let freightValue = 0;
  if (freight) {
    freightValue = (parseFloat(productValue) / Math.abs(subTotal)) * freight;
    freightValue = freightValue / qty;
  }

  let supplierCostValue = 0;
  if (supplierCostRate) {
    supplierCostValue = (supplierCostRate / 100) * newTotal;
  }

  let nonVendorCostWeightage =
    (parseFloat(productValue) / newTotal) * parseFloat(supplierCostValue);

  nonVendorCostWeightage = nonVendorCostWeightage / qty;

  const itemValue =
    unitPrice +
    (parseFloat(nonVendorCostWeightage.toString()) +
      parseFloat(freightValue.toString()));

  const costFc = itemValue;

  const costLocal = costFc * costRate;

  console.log(costRate, costFc, "cost rate", "cost fc");

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

  const qty_stored = existingQty;

  const productTotal = qty_stored * costLocal;

  const newValue = newQty * newCostLocal;

  const totalQty = qty_stored + newQty;

  console.log(totalQty, "total qty");

  let averageCost = (productTotal + newValue) / totalQty;

  if (!averageCost) averageCost = 0;

  return {
    averageCost,
  };
};
