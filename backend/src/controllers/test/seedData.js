import Prisma from "../../../prisma/index.js";
import {
  generateDummyDepartments,
  generateDummyLocations,
  generateDummySuppliers,
} from "../../utils/dummyData.js";

export const SeedLocation = async (req, res, next) => {
  try {
    const locations = generateDummyLocations(10);

    await Prisma.$transaction(async (Prisma) => {
      await Prisma.inv_locations.createMany({
        data: locations,
      });

      res.status(200).json({
        message: "okay ",
      });
    });
  } catch (err) {
    console.log(err);
    next(err);
  }
};

export const SeedDeparment = async (req, res, next) => {
  try {
    const departments = generateDummyDepartments(50);

    await Prisma.$transaction(async (Prisma) => {
      await Prisma.inv_department.createMany({
        data: departments,
      });

      res.status(200).json({
        message: "okay ",
      });
    });
  } catch (err) {
    console.log(err);
    next(err);
  }
};

export const SeedSuppliers = async (req, res, next) => {
  try {
    const suppliers = generateDummySuppliers(50);

    await Prisma.$transaction(async (Prisma) => {
      await Prisma.inv_suppliers.createMany({
        data: suppliers,
      });

      res.status(200).json({
        message: "okay sss ",
      });
    });
  } catch (err) {
    console.log(err);
    next(err);
  }
};
