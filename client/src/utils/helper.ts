export const isDublicateItems = (arr: any[]): boolean => {
  const encounteredProductCodes = new Set();

  for (const item of arr) {
    const productCode: string = item.productCode;
    if (encounteredProductCodes.has(productCode)) {
      // If the product_code is already encountered, it's a duplicate
      return true;
    } else {
      encounteredProductCodes.add(productCode);
    }
  }

  return false;
};
