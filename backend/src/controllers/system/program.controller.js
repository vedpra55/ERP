import createHttpError from "http-errors";
import Prisma from "../../../prisma/index.js";

export const getCompanyProgram = async (req, res, next) => {
  try {
    const { roleName, selectedSubCompanyId } = req.query;
    const { user } = req.body;

    if (!roleName) {
      next(createHttpError.BadRequest("Please provide all fields"));
    }

    const sys_roleProgram = await Prisma.sys_roleprograms.findMany({
      where: {
        AND: [
          { company_id: user.company_id },
          { sub_company_id: parseInt(selectedSubCompanyId) },
          { role_name: user.role_name },
          { access: true },
        ],
      },
    });

    const forSystem = await Prisma.sys_roleprograms.findMany({
      where: {
        AND: [
          { company_id: user.company_id },
          { sub_company_id: user.sub_company_id },
          { role_name: user.role_name },
          { access: true },
        ],
      },
    });

    let programs = [];

    if (user.sub_company_id != parseInt(selectedSubCompanyId)) {
      for (let i = 0; i < forSystem.length; i++) {
        const item = forSystem[i];
        const program = await Prisma.sys_programs.findUnique({
          where: {
            company_id_sub_company_id_program_id: {
              company_id: item.company_id,
              sub_company_id: item.sub_company_id,
              program_id: item.program_id,
            },
            program_name: {
              in: [
                "Create roles",
                "Create Users",
                "Create Sub Company",
                "Assign Programs",
              ],
            },
          },
        });
        programs.push(program);
      }
    } else {
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
    }

    res.status(200).json({
      res: programs,
    });
  } catch (err) {
    next(err);
  }
};

export const getCompanyRoleProgram = async (req, res, next) => {
  try {
    const { subCompanyId } = req.query;
    const { user } = req.body;

    if (!subCompanyId) {
      return next(createHttpError.BadRequest("No subcompany id found"));
    }

    let originalData = await Prisma.sys_roleprograms.findMany({
      where: {
        company_id: user.company_id,
        sub_company_id: parseInt(subCompanyId),
        role_name: {
          not: {
            equals: "admin",
          },
        },
      },
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
      },
    });
  } catch (err) {
    next(err);
  }
};
