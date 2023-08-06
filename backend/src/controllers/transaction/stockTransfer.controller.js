import Prisma from "../../../prisma/index.js";
import createHttpError from "http-errors";

export const createStockTransfer = async (req, res, next) => {
  try {
    const {
      user,

      fromLocation,
      toLocation,
      transferNo,
      remarks,
      products,
    } = req.body;

    if (!fromLocation || !toLocation || !transferNo || !remarks) {
      next(createHttpError.BadRequest("Please fill all fields"));
    }

    if (!products || !products.length) {
      next(createHttpError.BadRequest("Products not found"));
    }

    await Prisma.$transaction(async (Prisma) => {
      await Prisma.inv_transfer.create({
        data: {
          company_id: user.company_id,
          sub_company_id: user.sub_company_id,
          from_location: fromLocation,
          to_location: toLocation,
          transfer_dt: new Date(),
          transfer_no: transferNo.toString(),
          remarks: remarks,
          created_on: new Date(),
          created_by: user.username,
        },
      });

      const is_transfer_sequencesExit =
        await Prisma.inv_transfer_sequences.findUnique({
          where: {
            company_id_sub_company_id_from_location_to_location: {
              company_id: user.company_id,
              sub_company_id: user.sub_company_id,
              from_location: fromLocation,
              to_location: toLocation,
            },
          },
        });

      if (!is_transfer_sequencesExit) {
        await Prisma.inv_transfer_sequences.create({
          data: {
            company_id: user.company_id,
            sub_company_id: user.sub_company_id,
            from_location: fromLocation,
            to_location: toLocation,
            sequence_number: transferNo.toString(),
          },
        });
      }

      for (let i = 0; i < products.length; i++) {
        await Prisma.inv_transfer_detail.create({
          data: {
            company_id: user.company_id,
            sub_company_id: user.sub_company_id,
            transfer_no: transferNo.toString(),
            serial_no: parseInt(products[i].srl),
            department_code: products[i].departmentCode,
            product_code: products[i].productCode,
            to_location: toLocation,
            from_location: fromLocation,
            qty_transferred: parseInt(products[i].quantity),
            created_by: user.username,
          },
        });

        const fromLocationStore = await Prisma.inv_stores.findUnique({
          where: {
            company_id_sub_company_id_location_code_department_code_product_code:
              {
                company_id: user.company_id,
                sub_company_id: user.sub_company_id,
                location_code: fromLocation,
                department_code: products[i].departmentCode,
                product_code: products[i].productCode,
              },
          },
        });

        if (fromLocationStore) {
          await Prisma.inv_stores.update({
            where: {
              company_id_sub_company_id_location_code_department_code_product_code:
                {
                  company_id: user.company_id,
                  sub_company_id: user.sub_company_id,
                  location_code: fromLocation,
                  department_code: products[i].departmentCode,
                  product_code: products[i].productCode,
                },
            },
            data: {
              qty_instock:
                fromLocationStore.qty_instock - parseInt(products[i].quantity),
              qty_transfer: -parseInt(products[i].quantity),
            },
          });
        } else {
          await Prisma.inv_stores.create({
            data: {
              company_id: user.company_id,
              sub_company_id: user.sub_company_id,
              department_code: products[i].departmentCode,
              product_code: products[i].productCode,
              location_code: fromLocation,
              qty_instock: parseInt(products[i].quantity),
              qty_transfer: parseInt(products[i].quantity),
            },
          });
        }

        const toLocationStore = await Prisma.inv_stores.findUnique({
          where: {
            company_id_sub_company_id_location_code_department_code_product_code:
              {
                company_id: user.company_id,
                sub_company_id: user.sub_company_id,
                location_code: toLocation,
                department_code: products[i].departmentCode,
                product_code: products[i].productCode,
              },
          },
        });

        if (toLocationStore) {
          await Prisma.inv_stores.update({
            where: {
              company_id_sub_company_id_location_code_department_code_product_code:
                {
                  company_id: user.company_id,
                  sub_company_id: user.sub_company_id,
                  location_code: fromLocation,
                  department_code: products[i].departmentCode,
                  product_code: products[i].productCode,
                },
            },
            data: {
              qty_instock:
                toLocationStore.qty_instock + parseInt(products[i].quantity),
              qty_transfer: parseInt(products[i].quantity),
            },
          });
        } else {
          await Prisma.inv_stores.create({
            data: {
              company_id: user.company_id,
              sub_company_id: user.sub_company_id,
              department_code: products[i].departmentCode,
              product_code: products[i].productCode,
              location_code: toLocation,
              qty_instock: parseInt(products[i].quantity),
              qty_transfer: parseInt(products[i].quantity),
            },
          });
        }

        await Prisma.inv_cardex.create({
          data: {
            company_id: user.company_id,
            sub_company_id: user.sub_company_id,
            from_location: fromLocation,
            to_location: toLocation,
            trans_dt: new Date(),
            trans_no: transferNo,
            trans_type: "13",
            serial_no: parseInt(products[i].srl),
            department_code: products[i].departmentCode,
            product_code: products[i].productCode,
            quantity: parseInt(products[i].quantity),
            username: user.username,
          },
        });

        await Prisma.inv_cardex.create({
          data: {
            company_id: user.company_id,
            sub_company_id: user.sub_company_id,
            from_location: toLocation,
            to_location: fromLocation,
            trans_dt: new Date(),
            trans_no: transferNo,
            trans_type: "4",
            serial_no: parseInt(products[i].srl),
            department_code: products[i].departmentCode,
            product_code: products[i].productCode,
            quantity: parseInt(products[i].quantity),
            username: user.username,
          },
        });
      }

      res.status(200).json({
        message: "Stock Transfer Created Successfully",
      });
    });
  } catch (err) {
    next(err);
  }
};

export const getAllStockTransfer = async (req, res, next) => {
  try {
    const { user } = req.body;

    const { searchText, page } = req.query;

    let where = {
      company_id: user.company_id,
      sub_company_id: user.sub_company_id,
    };

    let locWhere = {
      company_id: user.company_id,
      sub_company_id: user.sub_company_id,
    };

    if (searchText) {
      locWhere.location_name = {
        contains: searchText,
        mode: "insensitive",
      };
    }

    const locations = await Prisma.inv_locations.findMany({
      where: {
        ...locWhere,
      },
    });

    const filterLocationCodes = locations.map((item) => item.location_code);

    if (searchText && searchText.trim() !== "") {
      where.AND = [
        {
          OR: [
            { transfer_no: { contains: searchText, mode: "insensitive" } },
            { from_location: { in: filterLocationCodes } },
            { to_location: { in: filterLocationCodes } },
          ],
        },
      ];
    }

    const take = 10;

    let pageNo = 1;
    if (page > 1) {
      pageNo = page;
    }

    const totalCount = await Prisma.inv_transfer.count({
      where: {
        ...where,
      },
    });

    const originalData = await Prisma.inv_transfer.findMany({
      where,
      orderBy: {
        created_on: "desc",
      },
      skip: (pageNo - 1) * take,
      take: take,
    });

    let locationCodes = originalData.map((item) => {
      return [item.to_location, item.from_location];
    });

    // Flatten the array of arrays to a single array
    const flattenedLocationCodes = locationCodes.flat();

    const locationName = await Prisma.inv_locations.findMany({
      where: {
        company_id: user.company_id,
        sub_company_id: user.sub_company_id,
        location_code: {
          in: flattenedLocationCodes,
        },
      },
    });

    const transfers = originalData.map((item, i) => {
      return {
        transfer_no: item.transfer_no,
        acknowledge_dt: item.acknowledge_dt,
        to_location_code: item.to_location,
        remarks: item.remarks,
        from_location_code: item.from_location,
        to_location: locationName.map((r) => {
          if (r.location_code === item.to_location) return r.location_name;
        }),
        from_location: locationName.map((r) => {
          if (r.location_code === item.from_location) return r.location_name;
        }),
      };
    });

    res.status(200).json({
      res: {
        transfers,
        totalCount,
      },
    });
  } catch (err) {
    console.log(err);
    next(err);
  }
};

export const getSingleStockTransfer = async (req, res, next) => {
  try {
    const { fromLocation, toLocation, transferNo } = req.query;
    const { user } = req.body;

    if (!fromLocation || !toLocation || !transferNo) {
      next(createHttpError.BadRequest("All fields not found"));
    }

    const originalData = await Prisma.inv_transfer.findUnique({
      where: {
        company_id_sub_company_id_from_location_to_location_transfer_no: {
          company_id: user.company_id,
          sub_company_id: user.sub_company_id,
          from_location: fromLocation,
          to_location: toLocation,
          transfer_no: transferNo,
        },
      },
    });

    let locationCodes = [originalData.to_location, originalData.from_location];

    // Flatten the array of arrays to a single array
    const flattenedLocationCodes = locationCodes.flat();

    const locationName = await Prisma.inv_locations.findMany({
      where: {
        company_id: user.company_id,
        sub_company_id: user.sub_company_id,
        location_code: {
          in: flattenedLocationCodes,
        },
      },
    });

    const transfer = {
      transfer_no: originalData.transfer_no,
      acknowledge_dt: originalData.acknowledge_dt,
      to_location_code: originalData.to_location,
      from_location_code: originalData.from_location,
      remarks: originalData.remarks,
      acknowledge_dt: originalData.acknowledge_dt,
      transfer_dt: originalData.transfer_dt,
      to_location: locationName.map((r) => {
        if (r.location_code === originalData.to_location)
          return r.location_name;
      }),
      from_location: locationName.map((r) => {
        if (r.location_code === originalData.from_location)
          return r.location_name;
      }),
    };

    const details = await Prisma.inv_transfer_detail.findMany({
      where: {
        company_id: user.company_id,
        sub_company_id: user.sub_company_id,
        from_location: fromLocation,
        to_location: toLocation,
        transfer_no: transferNo,
      },
    });

    res.status(200).json({
      res: {
        transfer,
        details,
      },
    });
  } catch (err) {
    next(err);
  }
};

export const acknowledgeStockTransfer = async (req, res, next) => {
  try {
    const { user, fromLocation, toLocation, transferNo } = req.body;

    if (!fromLocation || !toLocation || !transferNo) {
      return next(createHttpError.BadRequest("All fields not found"));
    }

    await Prisma.inv_transfer.update({
      where: {
        company_id_sub_company_id_from_location_to_location_transfer_no: {
          company_id: parseInt(user.company_id),
          sub_company_id: user.sub_company_id,
          from_location: fromLocation,
          to_location: toLocation,
          transfer_no: transferNo,
        },
      },
      data: {
        acknowledge_dt: new Date(),
        received_by: user.username,
      },
    });

    res.status(200).json({
      message: "Stock Acknowledge Successfully",
    });
  } catch (err) {
    console.log(err);
    next(err);
  }
};

export const getProductQtyFromStore = async (req, res, next) => {
  try {
    const { locationCode, departmentCode, productCode } = req.query;
    const { user } = req.body;

    const storeQty = await Prisma.inv_stores.findUnique({
      where: {
        company_id_sub_company_id_location_code_department_code_product_code: {
          company_id: user.company_id,
          sub_company_id: user.sub_company_id,
          location_code: locationCode,
          department_code: departmentCode,
          product_code: productCode,
        },
      },
      select: {
        qty_instock: true,
      },
    });

    res.status(200).json({
      res: {
        storeQty,
      },
    });
  } catch (err) {
    next(err);
  }
};
