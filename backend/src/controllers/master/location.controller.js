import createHttpError from "http-errors";
import Prisma from "../../../prisma/index.js";

export const createLocation = async (req, res, next) => {
  const { locationCode, locationName, shortName, closedFlag, user } = req.body;

  if (!locationCode || !locationName || !shortName) {
    return next(createHttpError.BadRequest("Please fill all fields"));
  }

  try {
    await Prisma.$transaction(async (Prisma) => {
      const locationCodeExits = await Prisma.inv_locations.findUnique({
        where: {
          company_id_sub_company_id_location_code: {
            company_id: user.company_id,
            sub_company_id: user.sub_company_id,
            location_code: locationCode,
          },
        },
      });

      if (locationCodeExits) {
        return next(createHttpError.BadRequest("Location code already exits"));
      }

      await Prisma.inv_locations.create({
        data: {
          company_id: user.company_id,
          sub_company_id: user.sub_company_id,
          location_code: locationCode,
          location_name: locationName,
          short_name: shortName,
          closed_flag: closedFlag,
        },
      });

      res.status(200).json({
        message: "Location created successfully",
      });
    });
  } catch (err) {
    next(err);
  }
};

export const getAllLocations = async (req, res, next) => {
  try {
    const { user } = req.body;

    const { searchText, count, page } = req.query;

    let where = {
      company_id: user.company_id,
      sub_company_id: user.sub_company_id,
    };

    if (searchText && searchText.trim() !== "") {
      where.AND = [
        {
          OR: [
            { location_code: { contains: searchText, mode: "insensitive" } },
            { location_name: { contains: searchText, mode: "insensitive" } },
          ],
        },
      ];
    }

    let take = 10;
    if (count > 0) {
      take = parseInt(count);
    }

    let pageNo = 1;
    if (page > 1) {
      pageNo = page;
    }

    const totalCount = await Prisma.inv_locations.count({
      where: {
        ...where,
      },
    });

    const locations = await Prisma.inv_locations.findMany({
      where,
      orderBy: {
        location_name: "asc",
      },
      skip: (pageNo - 1) * take,
      take: take,
    });

    res.status(200).json({
      res: {
        locations,
        totalCount,
      },
    });
  } catch (err) {
    console.log(err);
    next(err);
  }
};

export const getSingleLocation = async (req, res, next) => {
  try {
    const { locationCode } = req.query;
    const { user } = req.body;

    if (!locationCode) {
      next(createHttpError.BadRequest("No subcompany or location id found"));
    }

    const location = await Prisma.inv_locations.findUnique({
      where: {
        company_id_sub_company_id_location_code: {
          company_id: user.company_id,
          sub_company_id: user.sub_company_id,
          location_code: locationCode,
        },
      },
    });
    res.status(200).json({
      res: location,
    });
  } catch (err) {
    next(err);
  }
};

export const updateLocation = async (req, res, next) => {
  const { locationCode, locationName, shortName, closedFlag, user } = req.body;

  if (!locationCode || !locationName || !shortName) {
    next(createHttpError.BadRequest("Please fill all fields"));
  }

  try {
    await Prisma.inv_locations.update({
      where: {
        company_id_sub_company_id_location_code: {
          company_id: user.company_id,
          sub_company_id: user.sub_company_id,
          location_code: locationCode,
        },
      },
      data: {
        location_name: locationName,
        short_name: shortName,
        closed_flag: closedFlag,
      },
    });
    res.status(200).json({
      message: "Location updated successfully",
    });
  } catch (err) {
    next(err);
  }
};
