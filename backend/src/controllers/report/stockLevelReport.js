import Prisma from "../../../prisma/index.js";
import { getSummaryData } from "../filterData.js";
import createHttpError from "http-errors";
import puppeteer from "puppeteer";

export const StockLevelReport = async (req, res, next) => {
  try {
    const { departmentCode, locationCode, status, closed, user } = req.body;

    let locStatus = "";
    let deparmentStatus = "";

    const company = await Prisma.gl_companies.findUnique({
      where: {
        company_id: user.company_id,
      },
    });

    let departments;
    let location;
    if (departmentCode[0] === "All") {
      deparmentStatus = "All";
      departments = await Prisma.inv_department.findMany({
        where: {
          company_id: user.company_id,
          sub_company_id: user.sub_company_id,
        },
      });
    } else {
      const depCodes = departmentCode
        .map((item) => item.department_code)
        .join(", ");
      deparmentStatus = depCodes;
      departments = departmentCode;
    }

    if (locationCode === "All") {
      locStatus = "All";
      location = await Prisma.inv_locations.findMany({
        where: {
          company_id: user.company_id,
          sub_company_id: user.sub_company_id,
        },
      });
    } else {
      locStatus = locationCode;
      location = locationCode;
    }

    if (!location || location?.length === 0 || departments?.length === 0) {
      return next(
        createHttpError.BadRequest("There is no data for the filters")
      );
    }

    const filter = {
      departments,
      location,
      closed,
      status,
    };

    const { summaryData, result } = await getSummaryData(filter, user);

    if (summaryData.length === 0) {
      return next(
        createHttpError.BadRequest("There is no data for the filters")
      );
    }

    const productQuantities = {};

    for (const item of result) {
      for (const product of item.products) {
        for (const location of product.locations) {
          if (!productQuantities[product.product_code]) {
            productQuantities[product.product_code] = 0;
          }
          productQuantities[product.product_code] += location.qty_instock;
        }
      }
    }

    const departmentQuantities = [];

    for (const item of result) {
      const { department_code, products } = item;
      let departmentData = departmentQuantities.find(
        (dept) => dept.department_code === department_code
      );

      if (!departmentData) {
        departmentData = { department_code, quantities: [] };
        departmentQuantities.push(departmentData);
      }

      for (const product of products) {
        for (const location of product.locations) {
          const locationData = departmentData.quantities.find(
            (qty) => qty.location_code === location.location_code
          );
          if (!locationData) {
            departmentData.quantities.push({
              location_code: location.location_code,
              qty_instock: location.qty_instock,
            });
          } else {
            locationData.qty_instock += location.qty_instock;
          }
        }
      }
    }

    const mainDepartmentQuantities = [];

    for (const item of result) {
      const { department_code, products } = item;
      let departmentData = mainDepartmentQuantities.find(
        (dept) => dept.department_code === department_code
      );

      if (!departmentData) {
        departmentData = { department_code, total_qty_instock: 0 };
        mainDepartmentQuantities.push(departmentData);
      }

      for (const product of products) {
        for (const location of product.locations) {
          departmentData.total_qty_instock += location.qty_instock;
        }
      }
    }

    const departmentQuantities2 = [];

    const allLocationCodes = [];

    for (const item of result) {
      const { department_code, products } = item;
      let departmentData = departmentQuantities2.find(
        (dept) => dept.department_code === department_code
      );

      if (!departmentData) {
        departmentData = {
          department_code,
          total_qty_instock: 0,
          quantities: [],
        };
        departmentQuantities2.push(departmentData);
      }

      for (const product of products) {
        for (const location of product.locations) {
          departmentData.total_qty_instock += location.qty_instock;

          if (!allLocationCodes.includes(location.location_code)) {
            allLocationCodes.push(location.location_code);
          }

          const locationData = departmentData.quantities.find(
            (qty) => qty.location_code === location.location_code
          );
          if (!locationData) {
            departmentData.quantities.push({
              location_code: location.location_code,
              qty_instock: location.qty_instock,
            });
          } else {
            locationData.qty_instock += location.qty_instock;
          }
        }
      }
    }

    const allDepartments = await getDepartments(user);

    const allLocations = await getLocations(user);

    function getDepartmentName(department_code) {
      const name = allDepartments.filter(
        (res) => res.department_code === department_code
      )[0];

      return name.department_name;
    }

    function getLocationName(location_code) {
      const name = allLocations.filter(
        (res) => res.location_code === location_code
      )[0];

      return name.location_name;
    }

    const productLocationQtyMap = {};

    for (const department of result) {
      for (const product of department.products) {
        for (const location of product.locations) {
          const key = `${product.product_code}_${location.location_code}`;
          productLocationQtyMap[key] = location.qty_instock;
        }
      }
    }

    const qtyofEachLocationDepartment = {};

    for (const department of result) {
      const departmentCode = department.department_code;
      qtyofEachLocationDepartment[departmentCode] = {};
    }

    // Update quantities based on data
    for (const department of result) {
      const departmentCode = department.department_code;

      for (const product of department.products) {
        for (const location of product.locations) {
          const locationCode = location.location_code;
          const qtyInStock = location.qty_instock;

          const key = `${departmentCode}_${locationCode}`;
          qtyofEachLocationDepartment[departmentCode][key] =
            (qtyofEachLocationDepartment[departmentCode][key] || 0) +
            qtyInStock;
        }
      }
    }

    const htmlContent = `
    <!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
    <style>
    html {
      -webkit-print-color-adjust: exact;
    }
    body,
    h1,
    h2,
    h3,
    h4,
    p {
      padding: 0;
      margin: 0;
    }
    .mainContainer {
      margin-left: 25px;
      margin-right: 25px;
      margin-bottom: 50px;
    }
    .infoContainer {
      margin-top: 40px;
      margin-bottom: 20px;
      display: flex;
      justify-content: space-between;
    }
    .queryDataContainer {
      margin-bottom: 10px;
      font-weight: 600;
      width: 300px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    table {
      width: 100%;
      border-collapse: collapse;
    }

    th {
      padding: 8px;
      font-size: 12px;
      text-align: left;
      border: 1px solid black; /* Border for the cells */
    }

    .darkHeading {
      font-weight: bold;
      background-color: rgba(128, 128, 128, 0.4);
    }

    .darkHeading2 {
      font-weight: bold;
      font-size: 12px;
      background-color: rgba(128, 128, 128, 0.2);
    }

    td {
      font-size: 12px;
      padding: 8px;
      text-align: left;
      border: 1px solid black; /* Border for the cells */
    }

    .alignRight {
      text-align: right;
    }

    .hideBorder {
      border: 0px solid black;
    }
    </style>
  </head>
  <body>
    <main class="mainContainer">
      <section style="margin-top: 20px">
        <h2 style="text-align: center">${company.company_name}</h2>
        <h4 style="text-align: center; margin-top: 10px">
          Stock Levels Report
        </h4>
      </section>
      <section class="infoContainer">
        <div>
          <div class="queryDataContainer">
            <p>Location</p>
            <p style="font-weight: 400">${locStatus}</p>
          </div>
          <div class="queryDataContainer">
            <p>Department</p>
            <p style="font-weight: 400">${deparmentStatus}</p>
          </div>
          <div class="queryDataContainer">
            <p>Closed</p>
            <p style="font-weight: 400">All</p>
          </div>
          <div class="queryDataContainer">
            <p>Status</p>
            <p style="font-weight: 400">${status.type} ${status.value}</p>
          </div>
        </div>
        <div style="font-weight: 600">
          <p>Date : <span style="margin-left: 30px;font-weight: 400">28/06/2023</span></p>
        </div>
      </section>


      <table>
          ${result
            .map(
              (mainItem, index) => `
          <thead class="darkHeading">
          <tr>
            <th style="width: 20px" colspan="1">Department</th>
            <th style="width: 100px" colspan="1">${
              mainItem.department_code
            }</th>
            <th style="text-align: center" colspan=${
              allLocationCodes.length
            }>${getDepartmentName(mainItem.department_code)}</th>
            <th class="1"></th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td></td>
            <td></td>
              ${allLocationCodes
                .map(
                  (loc) => `
              <td class="darkHeading2">${getLocationName(loc)}</td>
              `
                )
                .join(" ")}
            <td class="darkHeading2"></td>
          </tr>
          <tr>
            <td></td>
            <td style="font-weight: bold">Products</td>
            ${allLocationCodes
              .map(
                (loc) => `
            <td></td>
            `
              )
              .join(" ")}
            <td style="text-align: right" class="darkHeading2">Total</td>
          </tr>

          ${mainItem.products
            .map(
              (res, i) => `
          <tr>
          <td></td>
          <td>${res.product_code}</td>
       
          ${allLocationCodes
            .map(
              (location, locIndex) => `
              <td class="alignRight">${
                productLocationQtyMap[`${res.product_code}_${location}`] || 0
              }</td>
          `
            )
            .join(" ")}

         
          <td style="text-align: right" class="darkHeading2">${
            productQuantities[res.product_code]
          }</td>
        </tr>
          `
            )
            .join(" ")}


          <tr>
            <td></td>
            <td class="darkHeading2" style="font-weight: bold">Total</td>
            ${allLocationCodes
              .map(
                (loc, locIndex) => `
            <td style="text-align: right" class="darkHeading2">${
              qtyofEachLocationDepartment[mainItem.department_code][
                `${mainItem.department_code}_${loc}`
              ] || 0
            }</td>
            `
              )
              .join(" ")}

            <td style="text-align: right" class="darkHeading2">${
              mainDepartmentQuantities[index].total_qty_instock
            }</td>
          </tr>
        </tbody>
          `
            )
            .join(" ")}
    </table>

    </main>
  </body>
</html>

    `;

    // Launch a headless browser
    const browser = await puppeteer.launch();

    // Open a new page
    const page = await browser.newPage();

    // Set the content of the page
    await page.setContent(htmlContent);

    // Generate the PDF
    const pdf = await page.pdf();

    // Set the response headers for PDF
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", "attachment; filename=custom.pdf");

    // Send the generated PDF to the client
    res.send(pdf);

    // Close the browser
    await browser.close();
  } catch (err) {
    console.log(err);
    next(err);
  }
};

const getDepartments = async (user) => {
  const departments = await Prisma.inv_department.findMany({
    where: {
      company_id: user.company_id,
      sub_company_id: user.sub_company_id,
    },
  });

  return departments;
};

const getLocations = async (user) => {
  const locations = await Prisma.inv_locations.findMany({
    where: {
      company_id: user.company_id,
      sub_company_id: user.sub_company_id,
    },
  });

  return locations;
};
