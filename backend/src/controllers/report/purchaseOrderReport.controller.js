import Prisma from "../../../prisma/index.js";
import puppeteer from "puppeteer";

export const purchaseOrderPdf = async (req, res, next) => {
  const { user } = req.body;
  const { orderNo } = req.query;

  try {
    const { company, purchaseOrder, supplier, purchaseOrderDetails } =
      await purchaseOrderData(user, orderNo);

    let products = [];

    // fetch all product of purchase order
    for (let i = 0; i < purchaseOrderDetails.length; i++) {
      const item = purchaseOrderDetails[i];
      const product = await fethProduct(
        item.product_code,
        item.department_code,
        user
      );
      products.push(product);
    }

    const purchaseOrderDate = new Date(purchaseOrder.order_dt);

    const dateText = `${purchaseOrderDate.getDate()} / ${
      purchaseOrderDate.getMonth() + 1
    } / ${purchaseOrderDate.getFullYear()}`;

    // Launch a headless browser
    const browser = await puppeteer.launch();

    // Open a new page
    const page = await browser.newPage();

    const subTotal = purchaseOrderDetails.reduce(
      (total, item) =>
        total + parseFloat(item.qty_ordered) * parseFloat(item.cost_fc),
      0
    );

    // Set the HTML content to render
    const htmlContent = `
        <!DOCTYPE html>
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
          margin-bottom: 50px;
        }
    
        .infoContainer {
          margin-top: 40px;
          margin-bottom: 20px;
          display: flex;
  
          justify-content: space-between;
        }
        .supplierInfo {
          display: flex;
          flex-direction: column;
          row-gap: 2px;
          margin-top: 10px;
          border: 1px solid black;
          padding: 10px;
        }
        .supplierContact {
          margin-top: 20px;
        }
        .shipToInfo {
          display: flex;
          flex-direction: column;
          row-gap: 2px;
          margin-top: 10px;
          border: 1px solid black;
          padding: 10px;
        }
  
        table {
          width: 100%;
          border-collapse: collapse;
        }
  
        th {
          font-size: 12px;
          padding: 8px;
          text-align: left;
          border: 1px solid black;
          background-color: rgba(128, 128, 128, 0.299);
        }
  
        th,
        td {
          font-size: 12px;
          padding: 8px;
          text-align: left;
          border: 1px solid black;
        }
  
        .hideBorder {
          border: 0px solid black;
        }

        .alignRight {
          text-align: right;
        }

        </style>
      </head>
      <body>
        <main class="mainContainer">
          <section style="margin-top: 20px">
            <h2 style="text-align: center">${company.company_name}</h2>
            <h4 style="text-align: center; margin-top: 10px">Purchase Order</h4>
          </section>
          <section class="infoContainer">
            <section>
              <p>
                Order #
                <span style="padding-left: 100px; font-weight: 600">${orderNo}</span>
              </p>
              <div class="supplierInfo">
                <p>${supplier.supplier_name}</p>
                <p>${supplier.address_1}</p>
                <p>${supplier.address_2}</p>
                <p>${supplier.country}</p>
              </div>
              <div>
                <div class="supplierContact">
                  <p style="font-weight: 600; margin-bottom: 5px">Contact</p>
                  <p>${supplier.telephone_no}</p>
                </div>
                <div class="supplierContact">
                  <p style="font-weight: 600; margin-bottom: 5px">Phone</p>
                  <p>${supplier.mobile_no}</p>
                </div>
                <div class="supplierContact">
                  <p style="font-weight: 600; margin-bottom: 5px">Email</p>
                  <p>${supplier.email}</p>
                </div>
              </div>
            </section>
            <section>
              <p>
                Date:
                <span style="padding-left: 100px; font-weight: 600">${dateText}</span>
              </p>
              <div style="text-align: right" class="shipToInfo">
                <p style="text-align: center; margin-bottom: 10px">
                  Ship To Address
                </p>
                <p>${supplier.supplier_name}</p>
                <p>${supplier.address_1}</p>
                <p>${supplier.address_2}</p>
                <p>${supplier.country}</p>
              </div>
            </section>
          </section>

          <table style="margin-top: 20px">
          <thead>
            <tr>
              <th style="width: 10%">Srl</th>
              <th style="width: 10%">Department</th>
              <th style="width: 20%">Product</th>
              <th style="width: 20%">Description</th>
              <th style="width: 15%">Unit Price</th>
              <th style="width: 10%">Qty</th>
              <th style="width: 15%">Value</th>
            </tr>
          </thead>

          ${purchaseOrderDetails
            .map(
              (item, i) =>
                `
        <tbody>
          <tr>
            <td>${item.serial_no}</td>
            <td>${item.department_code}</td>
            <td>${item.product_code}</td>
            <td>${products[i].product_description}</td>
            <td class="alignRight">${item.cost_fc}</td>
            <td class="alignRight">${item.qty_ordered}</td>
            <td class="alignRight">${
              parseInt(item.cost_fc) * parseInt(item.qty_ordered)
            }</td>
          </tr>
        </tbody>
            `
            )
            .join(" ")}

          <tbody>
            <tr>
              <td class="hideBorder"></td>
              <td class="hideBorder"></td>
              <td class="hideBorder"></td>
              <td class="hideBorder"></td>
              <td class="hideBorder"></td>
              <td style="font-weight :bold">Sub Total</td>
              <td class="alignRight">${subTotal}</td>
            </tr>
          </tbody>
        </table>
        </main>
      </body>
    </html>
    
        `;

    // Set the content of the page
    await page.setContent(htmlContent);

    // Generate the PDF
    const pdf = await page.pdf({
      displayHeaderFooter: true,
      footerTemplate: `
      <div style=" margin-left : 300px; margin-top-10px; padding-top-10px; text-align : center; font-size: 10px;">
          <div ><span style=" text-align : center"  class="pageNumber"></span></div>
      </div>`,
      margin: {
        top: "100px",
        bottom: "20px",
        left: "20px",
        right: "20px",
      },
    });

    // Close the browser
    await browser.close();

    // Set the response headers for PDF
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", "attachment; filename=custom.pdf");

    // Send the generated PDF to the client
    res.send(pdf);
  } catch (err) {
    console.log(err);
    next(err);
  }
};

const purchaseOrderData = async (user, orderNo) => {
  const company = await Prisma.gl_companies.findUnique({
    where: {
      company_id: user.company_id,
    },
    select: {
      company_name: true,
    },
  });

  const purchaseOrder = await Prisma.inv_purchase_order.findUnique({
    where: {
      company_id_sub_company_id_order_no: {
        company_id: user.company_id,
        sub_company_id: user.sub_company_id,
        order_no: orderNo,
      },
    },
  });

  const supplier = await Prisma.inv_suppliers.findUnique({
    where: {
      company_id_sub_company_id_supplier_code: {
        company_id: user.company_id,
        sub_company_id: user.sub_company_id,
        supplier_code: purchaseOrder.supplier_code,
      },
    },
  });

  const purchaseOrderDetails = await Prisma.inv_purchase_order_detail.findMany({
    where: {
      company_id: user.company_id,
      sub_company_id: user.sub_company_id,
      order_no: purchaseOrder.order_no,
    },
  });

  return {
    company,
    purchaseOrder,
    supplier,
    purchaseOrderDetails,
  };
};

const fethProduct = async (productId, departmentCode, user) => {
  const product = await Prisma.inv_products.findUnique({
    where: {
      company_id_sub_company_id_department_code_product_code: {
        company_id: user.company_id,
        sub_company_id: user.sub_company_id,
        product_code: productId,
        department_code: departmentCode,
      },
    },
  });

  return product;
};
