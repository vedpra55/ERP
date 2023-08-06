function generateRandomString(length) {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}

// Function to generate dummy location data
export function generateDummyLocations(numRecords) {
  const dummyLocations = [];
  const companyId = 10;
  const subCompanyId = 4;

  for (let i = 0; i < numRecords; i++) {
    const locationCode = generateRandomString(3); // Assuming location_code is 3 characters long
    const locationName = `${locationCode} House`; // Example pattern: Bux House
    const shortName = `${locationCode} House Poo`; // Example pattern: Bux House Poo

    const location = {
      company_id: companyId,
      sub_company_id: subCompanyId,
      location_code: locationCode,
      location_name: locationName,
      short_name: shortName,
      closed_flag: false,
    };

    dummyLocations.push(location);
  }

  return dummyLocations;
}

export function generateDummyDepartments(numRecords) {
  const dummyDepartments = [];
  const companyId = 10;
  const subCompanyId = 4;

  for (let i = 0; i < numRecords; i++) {
    const departmentCode = generateRandomString(3); // Assuming department_code is 3 characters long
    const departmentName = `Department-${i + 1}`; // Example pattern: Department-1, Department-2, ...

    const department = {
      company_id: companyId,
      sub_company_id: subCompanyId,
      department_code: departmentCode,
      department_name: departmentName,
      closed_flag: false,
    };

    dummyDepartments.push(department);
  }

  return dummyDepartments;
}

export function generateDummySuppliers(numRecords) {
  const dummySuppliers = [];
  const companyId = 10;
  const subCompanyId = 4;

  for (let i = 0; i < numRecords; i++) {
    const supplierCode = generateRandomString(3); // Assuming supplier_code is 3 characters long
    const supplierName = `Supplier-${i + 1}`; // Example pattern: Supplier-1, Supplier-2, ...
    const createdOn = new Date(
      Date.now() - Math.floor(Math.random() * 1000 * 3600 * 24 * 30)
    ); // Random date within the last 30 days

    const supplier = {
      company_id: companyId,
      sub_company_id: subCompanyId,
      supplier_code: supplierCode,
      supplier_name: supplierName,
      address_1: "Address line 1",
      address_2: "Address line 2",
      country: "Ukraine",
      telephone_no: "1234566",
      mobile_no: "1234566",
      email: `supplier${i + 1}@g.com`, // Example email: supplier1@g.com, supplier2@g.com, ...
      fax: "1234566",
      closed_flag: false,
      created_on: createdOn.toISOString(), // Convert date to ISO string format
      created_by: "testa",
    };

    dummySuppliers.push(supplier);
  }

  return dummySuppliers;
}
