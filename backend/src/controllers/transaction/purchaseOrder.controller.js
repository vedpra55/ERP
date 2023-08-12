import Prisma from "../../../prisma/index.js";
import createHttpError from "http-errors";
import {
  calulateAvarageNumber,
  calulatePurhcaseOrderNumbers,
} from "../../services/product.service.js";

export const createPurchaseOrder = async (req, res, next) => {
  try {
    const {
      user,

      orderNo,
      orderDate,
      supplierCode,
      remarks,
      currency,
      locationCode,
      supplierInvo,
      dueDate,
      costRate,
      freight,
      nonVendorCost,
      paidAmount,
      products,
      total,
    } = req.body;

    if (products?.length === 0 || !products) {
      return next(createHttpError.BadRequest("Order Details not found "));
    }

    if (
      !orderNo ||
      !orderDate ||
      !supplierCode ||
      !remarks ||
      !currency ||
      !locationCode ||
      !supplierInvo ||
      !dueDate ||
      !total
    ) {
      return next(createHttpError.BadRequest("Please fill all fields"));
    }

    Prisma.$transaction(async (Prisma) => {
      const isOrderNoExist = await Prisma.inv_purchase_order.findUnique({
        where: {
          company_id_sub_company_id_order_no: {
            company_id: user.company_id,
            sub_company_id: user.sub_company_id,
            order_no: orderNo,
          },
        },
      });

      if (isOrderNoExist) {
        return next(createHttpError.BadRequest("Order no already exists"));
      }

      await Prisma.inv_purchase_order.create({
        data: {
          company_id: user.company_id,
          sub_company_id: user.sub_company_id,
          order_no: orderNo,
          location_code: locationCode,
          order_dt: new Date(orderDate),
          supplier_code: supplierCode,
          supplier_invno: supplierInvo,
          currency: currency,
          remarks: remarks,
          eta: new Date(dueDate),
          order_amount: parseFloat(total),
          freight: freight ? parseFloat(freight) : 0,
          non_vendor_cost: nonVendorCost ? parseFloat(nonVendorCost) : 0,
          cost_rate: parseFloat(costRate),
          amount_paid: parseFloat(paidAmount),
          fulfilled_flag: false,
          closed_flag: false,
          paid_flag: false,
          created_by: user.username,
        },
      });
      for (let i = 0; i < products.length; i++) {
        let costLocal = 0;

        if (costRate) {
          costLocal = parseFloat(products[i].unitPrice) * parseFloat(costRate);
        } else {
          costLocal = parseFloat(products[i].unitPrice);
        }

        await Prisma.inv_purchase_order_detail.create({
          data: {
            company_id: parseInt(user.company_id),
            sub_company_id: user.sub_company_id,
            order_no: orderNo,
            serial_no: parseInt(products[i].srl),
            department_code: products[i].departmentCode,
            product_code: products[i].productCode,
            qty_ordered: parseInt(products[i].qtyBackorder),
            qty_received: 0,
            cost_local: costLocal,
            cost_fc: parseFloat(products[i].unitPrice),
          },
        });

        const product = await Prisma.inv_products.findUnique({
          where: {
            company_id_sub_company_id_department_code_product_code: {
              company_id: user.company_id,
              sub_company_id: user.sub_company_id,
              department_code: products[i].departmentCode,
              product_code: products[i].productCode,
            },
          },
        });

        const qty_backorder = product.qty_backorder;

        await Prisma.inv_products.update({
          where: {
            company_id_sub_company_id_department_code_product_code: {
              company_id: user.company_id,
              sub_company_id: user.sub_company_id,
              department_code: products[i].departmentCode,
              product_code: products[i].productCode,
            },
          },
          data: {
            qty_backorder: qty_backorder + parseInt(products[i].qtyBackorder),
          },
        });

        const isStorExit = await Prisma.inv_stores.findUnique({
          where: {
            company_id_sub_company_id_location_code_department_code_product_code:
              {
                company_id: user.company_id,
                sub_company_id: user.sub_company_id,
                department_code: products[i].departmentCode,
                location_code: locationCode,
                product_code: products[i].productCode,
              },
          },
        });

        if (isStorExit) {
          await Prisma.inv_stores.update({
            where: {
              company_id_sub_company_id_location_code_department_code_product_code:
                {
                  company_id: user.company_id,
                  sub_company_id: user.sub_company_id,
                  department_code: products[i].departmentCode,
                  location_code: locationCode,
                  product_code: products[i].productCode,
                },
            },
            data: {
              qty_backorder: qty_backorder + parseInt(products[i].qtyBackorder),
            },
          });
        } else {
          await Prisma.inv_stores.create({
            data: {
              company_id: user.company_id,
              sub_company_id: user.sub_company_id,
              department_code: products[i].departmentCode,
              location_code: locationCode,
              qty_backorder: parseInt(products[i].qtyBackorder),
              qty_instock: parseInt(product.qty_instock),
              product_code: products[i].productCode,
            },
          });
        }
      }

      res.status(200).json({
        message: "Purchase Order Created Successfully",
      });
    });
  } catch (err) {
    next(err);
  }
};

export const handleOrderFullFill = async (req, res, next) => {
  try {
    const {
      user,

      orderNo,
      orderDate,
      locationCode,
      costRate,
      freight,
      nonSupplierCost,
      products,
      subTotal,
      total,
    } = req.body;

    if (
      !orderNo ||
      !orderDate ||
      !locationCode ||
      !costRate ||
      !freight ||
      !nonSupplierCost ||
      !subTotal ||
      !total
    ) {
      return next(createHttpError.BadRequest("Please fill all fields"));
    }

    if (products?.length <= 0) {
      return next(createHttpError.BadRequest("No Products found"));
    }

    let costFc = 0;
    let costLocal = 0;

    await Prisma.$transaction(async (Prisma) => {
      for (let i = 0; i < products.length; i++) {
        const product = products[i];

        /// Fething product by product code
        const myProduct = await Prisma.inv_products.findUnique({
          where: {
            company_id_sub_company_id_department_code_product_code: {
              company_id: user.company_id,
              sub_company_id: user.sub_company_id,
              department_code: product.department_code,
              product_code: product.product_code,
            },
          },
        });

        // Total Instock qty in store
        const storeQtyInStock = await Prisma.inv_stores.aggregate({
          where: {
            company_id: user.company_id,
            sub_company_id: user.sub_company_id,
            location_code: locationCode,
            department_code: product.department_code,
            product_code: product.product_code,
          },
          _sum: {
            qty_instock: true,
          },
        });

        // Normal Calulation
        const { costFc: costFcT, costLocal: costLocalT } =
          calulatePurhcaseOrderNumbers(
            product,
            parseFloat(costRate),
            parseFloat(freight),
            parseFloat(nonSupplierCost),
            parseFloat(subTotal),
            parseFloat(total)
          );

        if (!costFcT || !costLocalT) {
          return next(createHttpError.BadRequest("No cost price"));
        }

        costFc = costFcT;
        costLocal = costLocalT;

        console.log(costLocal, "cost local");

        // Caluclating Avarage Cost if qty > 0 in pod
        if (storeQtyInStock._sum.qty_instock > 0) {
          const { averageCost } = calulateAvarageNumber(
            storeQtyInStock._sum.qty_instock,
            parseFloat(myProduct.cost_price),
            costLocal,
            parseFloat(product.qty_ordered)
          );

          console.log(averageCost, "costpricesdsads");

          if (averageCost === 0) costFc = 0;
          else {
            costLocal = averageCost;
          }
        }

        /// Update costfc and costLocal in pod
        await Prisma.inv_purchase_order_detail.update({
          where: {
            company_id_sub_company_id_order_no_serial_no: {
              company_id: user.company_id,
              sub_company_id: user.sub_company_id,
              order_no: orderNo,

              serial_no: parseInt(product.serial_no),
            },
          },
          data: {
            qty_received: product.qty_ordered,
            cost_fc: costFc,
            cost_local: costLocal,
          },
        });

        const qty_backorder = myProduct.qty_backorder;
        const qty_instock = myProduct.qty_instock;
        const qty_purchase = myProduct.qty_purchase;

        /// Update product const and qty
        await Prisma.inv_products.update({
          where: {
            company_id_sub_company_id_department_code_product_code: {
              company_id: user.company_id,
              sub_company_id: user.sub_company_id,
              department_code: products[i].department_code,
              product_code: products[i].product_code,
            },
          },
          data: {
            cost_price: costLocal,
            qty_backorder: qty_backorder - parseInt(products[i].qty_ordered),
            qty_instock: qty_instock + parseInt(products[i].qty_ordered),
            qty_purchase: qty_purchase + parseInt(products[i].qty_ordered),
          },
        });

        /// Update store qty
        await Prisma.inv_stores.update({
          where: {
            company_id_sub_company_id_location_code_department_code_product_code:
              {
                company_id: user.company_id,
                sub_company_id: user.sub_company_id,
                department_code: products[i].department_code,
                product_code: products[i].product_code,
                location_code: locationCode,
              },
          },
          data: {
            qty_backorder: qty_backorder - parseInt(products[i].qty_ordered),
            qty_instock: qty_instock + parseInt(products[i].qty_ordered),
            qty_purchase: qty_purchase + parseInt(products[i].qty_ordered),
          },
        });

        /// Create cardex
        await Prisma.inv_cardex.create({
          data: {
            company_id: user.company_id,
            sub_company_id: user.sub_company_id,
            from_location: locationCode,
            trans_dt: orderDate,
            trans_no: orderNo,
            trans_type: "2",
            serial_no: parseInt(products[i].serial_no),
            department_code: products[i].department_code,
            product_code: products[i].product_code,
            quantity: products[i].qty_ordered,
            username: user.username,
            cost_price: costLocal,
          },
        });
      }

      await Prisma.inv_purchase_order.update({
        where: {
          company_id_sub_company_id_order_no: {
            company_id: user.company_id,
            sub_company_id: user.sub_company_id,
            order_no: orderNo,
          },
        },
        data: {
          fulfilled_flag: true,
        },
      });

      res.status(200).json({
        message: "Purchase Order Fullfiled Successfully",
      });
    });
  } catch (err) {
    next(err);
    console.log(err);
  }
};

export const handlePayment = async (req, res, next) => {
  try {
    const { user, orderNo, payments, subTotal, totalOrderValue } = req.body;

    if (!orderNo || !subTotal || !totalOrderValue) {
      next(createHttpError.BadRequest("Please fill all fields"));
    }

    if (payments?.length <= 0 || !payments) {
      next(createHttpError.BadRequest("Payments not found"));
    }

    await Prisma.$transaction(async (Prisma) => {
      for (let i = 0; i < payments.length; i++) {
        const payment = payments[i];

        const poPayment = await Prisma.inv_purchase_payment.findUnique({
          where: {
            company_id_sub_company_id_order_no_payment_no: {
              company_id: user.company_id,
              sub_company_id: user.sub_company_id,
              order_no: orderNo,
              payment_no: parseInt(payment.srl),
            },
          },
        });

        const paymentNo = poPayment
          ? poPayment.payment_no + parseInt(payment.srl)
          : parseInt(payment.srl);

        await Prisma.inv_purchase_payment.create({
          data: {
            company_id: user.company_id,
            sub_company_id: user.sub_company_id,
            order_no: orderNo,
            payment_no: paymentNo,
            payment_dt: new Date(payment.date).toISOString(),
            remarks: payment.remarks,
            amount: parseFloat(payment.amount),
            created_by: user.username,
          },
        });

        const sumOfAmount = await Prisma.inv_purchase_payment.aggregate({
          where: {
            company_id: user.company_id,
            sub_company_id: user.sub_company_id,
            order_no: orderNo,
          },
          _sum: {
            amount: true,
          },
        });

        await Prisma.inv_purchase_order.update({
          where: {
            company_id_sub_company_id_order_no: {
              company_id: user.company_id,
              sub_company_id: user.sub_company_id,
              order_no: orderNo,
            },
          },
          data: {
            amount_paid: sumOfAmount._sum.amount,
          },
        });
      }

      const purchasePayment = await Prisma.inv_purchase_payment.aggregate({
        where: {
          company_id: user.company_id,
          sub_company_id: user.sub_company_id,
          order_no: orderNo,
        },
        _sum: {
          amount: true,
        },
      });

      if (
        parseFloat(totalOrderValue) == parseFloat(purchasePayment._sum.amount)
      ) {
        await Prisma.inv_purchase_order.update({
          where: {
            company_id_sub_company_id_order_no: {
              company_id: user.company_id,
              sub_company_id: user.sub_company_id,
              order_no: orderNo,
            },
          },
          data: {
            paid_flag: true,
          },
        });
      } else {
        await Prisma.inv_purchase_order.update({
          where: {
            company_id_sub_company_id_order_no: {
              company_id: user.company_id,
              sub_company_id: user.sub_company_id,
              order_no: orderNo,
            },
          },
          data: {
            paid_flag: false,
          },
        });
      }

      res.status(200).json({
        message: "Payment Created Successfully",
      });
    });
  } catch (err) {
    next(err);
  }
};

export const getAllPurhcaseOrder = async (req, res, next) => {
  try {
    const { user } = req.body;

    const { searchText, fullFillStatus, paidStatus, toDate, fromDate, page } =
      req.query;

    let where = {
      company_id: user.company_id,
      sub_company_id: user.sub_company_id,
    };

    const take = 10;

    let pageNo = 1;
    if (page > 1) {
      pageNo = page;
    }

    if (fullFillStatus) {
      where.fulfilled_flag = fullFillStatus === "FullFill" ? true : false;
    }

    if (paidStatus) {
      where.paid_flag = paidStatus === "Paid" ? true : false;
    }

    let locWhere = {
      company_id: user.company_id,
      sub_company_id: user.sub_company_id,
    };

    let supplierWhere = {
      company_id: user.company_id,
      sub_company_id: user.sub_company_id,
    };

    if (searchText) {
      locWhere.location_name = {
        contains: searchText,
        mode: "insensitive",
      };

      supplierWhere.supplier_name = {
        contains: searchText,
        mode: "insensitive",
      };
    }

    // Add date range filtering
    if (fromDate && toDate) {
      where.created_on = {
        gte: new Date(fromDate).toISOString(),
        lte: new Date(toDate).toISOString(),
      };
    }

    const locations = await Prisma.inv_locations.findMany({
      where: {
        ...locWhere,
      },
    });

    const supplier = await Prisma.inv_suppliers.findMany({
      where: {
        ...supplierWhere,
      },
    });

    const locationCodes = locations.map((item) => item.location_code);

    const supplierCodes = supplier.map((item) => item.supplier_code);

    if (searchText && searchText.trim() !== "") {
      where.AND = [
        {
          OR: [
            { order_no: { contains: searchText, mode: "insensitive" } },
            { supplier_code: { contains: searchText, mode: "insensitive" } },
            { location_code: { in: locationCodes } },
            { supplier_code: { in: supplierCodes } },
          ],
        },
      ];
    }

    const totalCount = await Prisma.inv_purchase_order.count({
      where: {
        ...where,
      },
    });

    const originalData = await Prisma.inv_purchase_order.findMany({
      where,
      orderBy: {
        created_on: "desc",
      },
      skip: (pageNo - 1) * take,
      take: take,
      include: {
        inv_locations: true,
        inv_suppliers: true,
      },
    });

    const purchaseOrders = originalData.map((item) => ({
      order_no: item.order_no,
      location: item.inv_locations.location_name,
      supplier: item.inv_suppliers.supplier_name,
      fulfilled_flag: item.fulfilled_flag,
      paid_flag: item.paid_flag,
      order_dt: item.order_dt,
      order_amount: item.order_amount,
      amount_paid: item.amount_paid,
    }));

    return res.status(200).json({
      res: {
        purchaseOrders,
        totalCount,
      },
    });
  } catch (err) {
    next(err);
  }
};

export const getSinglePurchaseOrder = async (req, res, next) => {
  try {
    const { orderNo } = req.query;
    const { user } = req.body;

    const purchaseOrder = await Prisma.inv_purchase_order.findUnique({
      where: {
        company_id_sub_company_id_order_no: {
          company_id: user.company_id,
          sub_company_id: user.sub_company_id,
          order_no: orderNo,
        },
      },
    });

    const purchaseOrderDetails =
      await Prisma.inv_purchase_order_detail.findMany({
        where: {
          company_id: user.company_id,
          sub_company_id: user.sub_company_id,
          order_no: orderNo,
        },
      });

    const paymentDetails = await Prisma.inv_purchase_payment.findMany({
      where: {
        company_id: user.company_id,
        sub_company_id: user.sub_company_id,
        order_no: orderNo,
      },
    });

    res.status(200).json({
      res: {
        purchaseOrder,
        purchaseOrderDetails,
        paymentDetails,
      },
    });
  } catch (err) {
    next(err);
  }
};

export const editPurchaseOrder = async (req, res, next) => {
  try {
    const {
      products,
      remarks,
      costRate,
      nonVendorCost,
      freight,
      user,
      order_no,
      orderAmount,
    } = req.body;

    await Prisma.$transaction(async (Prisma) => {
      await Prisma.inv_purchase_order.update({
        where: {
          company_id_sub_company_id_order_no: {
            order_no: order_no,
            company_id: user.company_id,
            sub_company_id: user.sub_company_id,
          },
        },
        data: {
          freight: parseFloat(freight),
          remarks: remarks,
          cost_rate: parseFloat(costRate),
          non_vendor_cost: parseFloat(nonVendorCost),
          order_amount: parseFloat(orderAmount),
        },
      });

      for (let i = 0; i < products.length; i++) {
        const product = products[i];

        await Prisma.inv_purchase_order_detail.update({
          where: {
            company_id_sub_company_id_order_no_serial_no: {
              order_no: order_no,
              company_id: user.company_id,
              sub_company_id: user.sub_company_id,
              serial_no: parseInt(product.serial_no),
            },
          },
          data: {
            cost_fc: parseFloat(product.cost_fc),
            qty_ordered: parseInt(product.qty_ordered),
          },
        });

        await Prisma.inv_products.update({
          where: {
            company_id_sub_company_id_department_code_product_code: {
              company_id: user.company_id,
              sub_company_id: user.sub_company_id,
              department_code: product.department_code,
              product_code: product.product_code,
            },
          },
          data: {
            qty_backorder: parseInt(product.qty_ordered),
          },
        });
      }

      res.status(200).json({
        message: "Purchase order updated successfully",
      });
    });
  } catch (err) {
    next(err);
  }
};

export const deletePurchaseOrderProduct = async (req, res, next) => {
  try {
    const { srl, orderNo, amount, user, product, locationCode } = req.body;

    await Prisma.$transaction(async (Prisma) => {
      await Prisma.inv_purchase_order.update({
        where: {
          company_id_sub_company_id_order_no: {
            company_id: user.company_id,
            sub_company_id: user.sub_company_id,
            order_no: orderNo,
          },
        },
        data: {
          order_amount: amount,
        },
      });

      await Prisma.inv_purchase_order_detail.delete({
        where: {
          company_id_sub_company_id_order_no_serial_no: {
            company_id: user.company_id,
            sub_company_id: user.sub_company_id,
            order_no: orderNo,
            serial_no: parseInt(srl),
          },
        },
      });

      const pr = await Prisma.inv_products.findUnique({
        where: {
          company_id_sub_company_id_department_code_product_code: {
            company_id: user.company_id,
            sub_company_id: user.sub_company_id,
            department_code: product.department_code,
            product_code: product.product_code,
          },
        },
      });

      await Prisma.inv_products.update({
        where: {
          company_id_sub_company_id_department_code_product_code: {
            company_id: user.company_id,
            sub_company_id: user.sub_company_id,
            department_code: product.department_code,
            product_code: product.product_code,
          },
        },
        data: {
          qty_backorder: pr.qty_backorder - parseInt(product.qty_ordered),
        },
      });

      const store = await Prisma.inv_stores.findUnique({
        where: {
          company_id_sub_company_id_location_code_department_code_product_code:
            {
              company_id: user.company_id,
              sub_company_id: user.sub_company_id,
              department_code: product.department_code,
              product_code: product.product_code,
              location_code: locationCode,
            },
        },
      });

      await Prisma.inv_stores.update({
        where: {
          company_id_sub_company_id_location_code_department_code_product_code:
            {
              company_id: user.company_id,
              sub_company_id: user.sub_company_id,
              department_code: product.department_code,
              product_code: product.product_code,
              location_code: locationCode,
            },
        },
        data: {
          qty_backorder: store.qty_backorder - parseInt(product.qty_ordered),
        },
      });

      res.status(200).json({
        message: "Purchase order product deleted",
      });
    });
  } catch (err) {
    next(err);
    console.log(err);
  }
};
