import { Program } from "@@types/system";
import { SectionsState } from "@components/ui/Sidebar";

const masterPrograms = ["Categories", "Suppliers", "Locations", "Products"];

const systemPrograms = [
  "Assign Programs",
  "Create Users",
  "Create Sub Company",
  "Create roles",
];

const transactionPrograms = ["Purchase Order Creation", "Transfer Creation"];

const reportPrograms = [
  "Purchase Document",
  "Stock Balance Report",
  "Transfer Document",
];

const programSectionFilter = (
  programs: Program[],
  setSection: React.Dispatch<React.SetStateAction<SectionsState>>
) => {
  const master = filter(programs, masterPrograms);
  const system = filter(programs, systemPrograms);
  const transactions = filter(programs, transactionPrograms);
  const reports = filter(programs, reportPrograms);

  setSection({
    master,
    system,
    transactions,
    reports,
  });
};

const filter = (programs: Program[], data: string[]): Program[] => {
  const filterProgram = programs.filter((program) => {
    if (program != null) return data.includes(program.program_name);
  });

  return filterProgram;
};

export default programSectionFilter;
