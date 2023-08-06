import createHttpError from "http-errors";
import Prisma from "../../../prisma/index.js";

export const createDepartment = async (req, res, next) => {
  try {
    const { user, departmentCode, departmentName, closedFlag } = req.body;

    if (!departmentCode || !departmentName) {
      next(createHttpError.BadRequest("Please fill all fields"));
    }

    await Prisma.$transaction(async (Prisma) => {
      const nameExist = await Prisma.inv_department.findUnique({
        where: {
          company_id_sub_company_id_department_code: {
            company_id: user.company_id,
            sub_company_id: user.sub_company_id,
            department_code: departmentCode,
          },
        },
      });

      if (nameExist?.department_name === departmentName) {
        return next(
          createHttpError.BadRequest("Department name already exists")
        );
      }

      if (nameExist?.department_code === departmentCode) {
        return next(
          createHttpError.BadRequest("Department code already exists")
        );
      }

      await Prisma.inv_department.create({
        data: {
          department_name: departmentName,
          department_code: departmentCode,
          company_id: user.company_id,
          sub_company_id: user.sub_company_id,
          closed_flag: closedFlag,
          created_by: user.username,
        },
      });
      res.status(200).json({ message: "department created sucessfully" });
    });
  } catch (err) {
    console.log(err);
    next(err);
  }
};

export const getAllDepartment = async (req, res, next) => {
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
            { department_code: { contains: searchText, mode: "insensitive" } },
            { department_name: { contains: searchText, mode: "insensitive" } },
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

    const totalCount = await Prisma.inv_department.count({
      where: {
        ...where,
      },
    });

    const departments = await Prisma.inv_department.findMany({
      where: {
        ...where,
      },
      orderBy: {
        created_on: "desc",
      },
      skip: (pageNo - 1) * take,
      take: take,
    });

    res.status(200).json({
      res: {
        departments,
        totalCount,
      },
    });
  } catch (err) {
    console.log(err);
    next(err);
  }
};

export const getSingleDepartment = async (req, res, next) => {
  try {
    const { departmentCode } = req.query;
    const { user } = req.body;

    if (!departmentCode) {
      next(
        createHttpError.BadRequest("subcomapny id or department code not found")
      );
    }

    const department = await Prisma.inv_department.findUnique({
      where: {
        company_id_sub_company_id_department_code: {
          company_id: user.company_id,
          sub_company_id: user.sub_company_id,
          department_code: departmentCode,
        },
      },
    });

    res.status(200).json({
      res: department,
    });
  } catch (err) {
    next(err);
  }
};

export const updateDepartment = async (req, res, next) => {
  try {
    const { user, departmentCode, departmentName, closedFlag } = req.body;

    if (!departmentCode || !departmentName) {
      next(createHttpError.BadRequest("All Fields not found"));
    }

    await Prisma.inv_department.update({
      where: {
        company_id_sub_company_id_department_code: {
          company_id: user.company_id,
          sub_company_id: user.sub_company_id,
          department_code: departmentCode,
        },
      },
      data: {
        department_name: departmentName,
        closed_flag: closedFlag,
      },
    });
    res.status(200).json({
      message: "Department Updated Successfully",
    });
  } catch (err) {
    console.log(err);
    next(err);
  }
};
