import createHttpError from "http-errors";
import Prisma from "../../../prisma/index.js";

export const getCompanyProgram = async (req, res, next) => {
  try {
    const { roleName, selectedSubCompanyId } = req.query;
    const { user } = req.body;

    if (!roleName) {
      return next(createHttpError.BadRequest("Please provide all fields"));
    }

    let where = {
      AND: [
        { company_id: user.company_id },
        { sub_company_id: user.sub_company_id },
        { role_name: user.role_name },
        { access: true },
      ],
    };

    const sys_roleProgram = await Prisma.sys_roleprograms.findMany({
      where,
    });

    let programs = [];

    for (let i = 0; i < sys_roleProgram.length; i++) {
      const item = sys_roleProgram[i];
      const program = await Prisma.sys_programs.findUnique({
        where: {
          company_id_sub_company_id_program_id: {
            company_id: item.company_id,
            sub_company_id: item.sub_company_id,
            program_id: item.program_id,
          },
        },
      });
      programs.push(program);
    }

    res.status(200).json({
      res: programs,
    });
  } catch (err) {
    console.log(err);
    next(err);
  }
};

export const getCompanyRoleProgram = async (req, res, next) => {
  try {
    const { page, role } = req.query;
    const { user } = req.body;

    let pageNo = 1;
    let take = 12;

    if (page > 1) {
      pageNo = page;
    }

    let where = {
      company_id: user.company_id,
      sub_company_id: user.sub_company_id,
    };

    if (role != "" && role != "All") {
      where.role_name = role;
    } else {
      where.role_name = {
        not: {
          equals: "admin",
        },
      };
    }

    let totalCount = await Prisma.sys_roleprograms.count({
      where,
    });

    let originalData = await Prisma.sys_roleprograms.findMany({
      where,
      skip: (pageNo - 1) * take,
      take: take,
      include: { sys_programs: true },
    });

    const rolePrograms = originalData.map((item) => ({
      company_id: item.company_id,
      sub_company_id: item.sub_company_id,
      role_name: item.role_name,
      program_id: item.program_id,
      access: item.access,
      program_name: item.sys_programs.program_name,
    }));

    res.status(200).json({
      res: {
        rolePrograms,
        totalCount,
      },
    });
  } catch (err) {
    next(err);
  }
};
