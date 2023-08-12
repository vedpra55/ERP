import Prisma from "../../../prisma/index.js";
import puppeteer from "puppeteer";
import createHttpError from "http-errors";

export const PurchaseOrderSummaryPdf = async (req, res, next) => {
  try {
    const { supplierCode, poDate, poToDate, status, user } = req.body;

    let summary;

    const company = await Prisma.gl_companies.findUnique({
      where: {
        company_id: user.company_id,
      },
      select: {
        company_name: true,
      },
    });

    const supplier = await Prisma.inv_suppliers.findUnique({
      where: {
        company_id_sub_company_id_supplier_code: {
          company_id: user.company_id,
          sub_company_id: user.sub_company_id,
          supplier_code: supplierCode,
        },
      },
    });

    const { purchaseOrder, purchaseOrderDetails } = await getPdfData(
      supplierCode,
      poDate,
      poToDate,
      status,
      user.company_id,
      user.sub_company_id
    );

    if (!purchaseOrder.length || !purchaseOrderDetails.length) {
      return next(
        createHttpError.BadRequest("There is no data for the filters")
      );
    }

    summary = purchaseOrder.map((order) => {
      const purchaseOrderDetails2 = purchaseOrderDetails.find(
        (details) => details[0].order_no === order.order_no
      );
      return {
        purchaseOrder: order,
        purchaseOrderDetails: purchaseOrderDetails2 || [],
      };
    });

    let reportTotal = 0;

    summary.map((item) => {
      item.purchaseOrderDetails.map((po) => {
        reportTotal += po.cost_fc * po.qty_ordered;
      });
    });

    const subtotalByOrder = {};

    // Calculate subtotal for each purchase order
    summary.forEach((item) => {
      const orderNumber = item.purchaseOrder.order_no;
      const orderAmount = parseFloat(item.purchaseOrder.order_amount);

      if (subtotalByOrder[orderNumber]) {
        subtotalByOrder[orderNumber] +=
          orderAmount - item.purchaseOrder.freight;
      } else {
        subtotalByOrder[orderNumber] = orderAmount - item.purchaseOrder.freight;
      }
    });

    // Launch a headless browser
    const browser = await puppeteer.launch();

    // Open a new page
    const page = await browser.newPage();

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
        .infoItem {
          margin-bottom: 20px;
          display: flex;
          flex-wrap: wrap;
          width: 300px;
          row-gap: 10px;
          justify-content: space-between;
          font-weight: 600;
          font-size: 14px;
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
              Purchase Order Details
            </h4>
          </section>
          <section class="infoContainer">
            <section>
              <div class="infoItem">
                <p>Supplier: <span style="margin-left: 10px;font-weight: 400">${
                  supplier.supplier_code
                }</span></p>
                <p>
                  <span style="font-weight: 400">${
                    supplier.supplier_name
                  }</span>
                </p>
              </div>
              <div class="infoItem">
                <p>PO Date: <span style="margin-left: 10px; font-weight: 400">${poDate}</span></p>
                <p>
                  PO To Date: <span style="margin-left: 10px; font-weight: 400">${poToDate}</span>
                </p>
              </div>
              <div class="infoItem">
                <p>Status: <span style="margin-left: 10px;font-weight: 400">${status}</span></p>
              </div>
            </section>
            <section>
              <p style="font-weight: 600">Date : <span style="font-weight: 400">${new Date(
                summary[0].purchaseOrder.order_dt
              ).getDate()} / ${
      new Date(summary[0].purchaseOrder.order_dt).getMonth() + 1
    } / ${new Date(summary[0].purchaseOrder.order_dt).getFullYear()}</span></p>
            </section>
          </section>

          <table>
           ${summary
             .map(
               (item, index) => `
     

             <tr class="darkHeading">
               <th>Supplier</th>
               <th colspan="2">Name</th>
               <th>Order#</th>
               <th>Date</th>
               <th>Amount</th>
               <th>Paid</th>
               <th colspan="2">Balance</th>
             </tr>

           <tbody>
             <tr>
               <td>${supplier.supplier_code}</td>
               <td colspan="2">${supplier.supplier_name}</td>
               <td>${item.purchaseOrder.order_no}</td>
               <td>${new Date(item.purchaseOrder.order_dt).getDate()} / 
              ${new Date(item.purchaseOrder.order_dt).getMonth() + 1} / 
              ${new Date(item.purchaseOrder.order_dt).getFullYear()}</td>
               <td class="alignRight">${item.purchaseOrder.order_amount}</td>
               <td class="alignRight">${item.purchaseOrder.amount_paid}</td>
               <td class="alignRight" colspan="2">${
                 item.purchaseOrder.order_amount -
                 item.purchaseOrder.amount_paid
               }</td>
             </tr>
             <tr class="darkHeading2">
               <td></td>
               <td>Serial</td>
               <td>Department</td>
               <td>Product</td>
               <td>Description</td>
               <td>Unit Price</td>
               <td>Qty</td>
               <td>Value</td>
             </tr>
               ${item.purchaseOrderDetails
                 .map(
                   (item2, i) => `
               <tr>
               <td></td>
               <td>${item2.serial_no}</td>
               <td>${item2.department_code}</td>
               <td>${item2.product_code}</td>
               <td>${item2.inv_products.product_description}</td>
               <td class="alignRight">${item2.cost_fc}</td>
               <td class="alignRight">${item2.qty_ordered}</td>
               <td class="alignRight">${item2.cost_fc * item2.qty_ordered}</td>
             </tr>
               `
                 )
                 .join(" ")}
           </tbody>
           <tr>
           <td class="darkHeading2" style="text-align: center" colspan="7">
             Total
           </td>
           <td class="alignRight">${
             subtotalByOrder[item.purchaseOrder.order_no]
           }</td>
         </tr>
           `
             )
             .join(" ")}   

             <tr>
             <td class="darkHeading" style="text-align: center" colspan="7">
               Report Total
             </td>
             <td class="alignRight">${reportTotal}</td>
           </tr>
             </table>    

              
    
        </main>
      </body>
    </html>
    
        `;

    // Set the content of the page
    await page.setContent(htmlContent);

    // Generate the PDF
    const pdf = await page.pdf({
      margin: {
        top: "20px",
        bottom: "20px",
        left: "20px",
        right: "20px",
      },
    });

    // Set the response headers for PDF
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", "attachment; filename=custom.pdf");

    // Send the generated PDF to the client
    res.send(pdf);

    // Close the browser
    await browser.close();
  } catch (err) {
    next(err);
    console.log(err);
  }
};

async function getPdfData(
  supplierCode,
  poDate,
  poToDate,
  status,
  companyId,
  subCompanyId
) {
  let purchaseOrder = null;
  let purchaseOrderDetails = [];
  let query = null;

  if (status === "All") {
    query = {
      company_id: parseInt(companyId),
      sub_company_id: parseInt(subCompanyId),
      supplier_code: supplierCode,
      order_dt: {
        gt: new Date(poDate).toISOString(),
        lt: new Date(poToDate).toISOString(),
      },
    };
  }
  if (status === "Paid") {
    query = {
      company_id: parseInt(companyId),
      sub_company_id: parseInt(subCompanyId),
      supplier_code: supplierCode,
      paid_flag: true,
      order_dt: {
        gt: new Date(poDate).toISOString(),
        lt: new Date(poToDate).toISOString(),
      },
    };
  }
  if (status === "FullFilled") {
    query = {
      company_id: parseInt(companyId),
      sub_company_id: parseInt(subCompanyId),
      supplier_code: supplierCode,
      fulfilled_flag: true,
      order_dt: {
        gt: new Date(poDate).toISOString(),
        lt: new Date(poToDate).toISOString(),
      },
    };
  }
  if (status === "Started") {
    query = {
      company_id: parseInt(companyId),
      sub_company_id: parseInt(subCompanyId),
      supplier_code: supplierCode,
      fulfilled_flag: false,
      order_dt: {
        gt: new Date(poDate).toISOString(),
        lt: new Date(poToDate).toISOString(),
      },
    };
  }

  purchaseOrder = await Prisma.inv_purchase_order.findMany({
    where: query,
  });

  for (let i = 0; i < purchaseOrder.length; i++) {
    const d = await Prisma.inv_purchase_order_detail.findMany({
      where: {
        company_id: parseInt(companyId),
        sub_company_id: parseInt(subCompanyId),
        order_no: purchaseOrder[i].order_no,
      },
      include: {
        inv_products: true,
      },
    });
    purchaseOrderDetails.push(d);
  }

  return {
    purchaseOrder,
    purchaseOrderDetails,
  };
}
