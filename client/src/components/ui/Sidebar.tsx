import { FC, useEffect, useState } from "react";

import { Company, Program, SubCompany } from "@@types/system";
import programSectionFilter from "@utils/programSectionFilter";
import SidebarHeader from "./SidebarHeader";
import SideBarItem from "./SidebarItem";
import SideBarUserDetials from "./SideBarUserDetails";

export interface SectionsState {
  system: Program[];
  master: Program[];
  transactions: Program[];
  reports: Program[];
}

interface Props {
  programs: Program[];
  company: Company;
  subCompany: SubCompany;
}

const SideBar: FC<Props> = ({ programs, company, subCompany }) => {
  const [sections, setSections] = useState<SectionsState>({
    system: [],
    master: [],
    transactions: [],
    reports: [],
  });

  useEffect(() => {
    programSectionFilter(programs, setSections);
  }, [programs]);

  return (
    <div className="sideBarContainer">
      <SidebarHeader
        companyName={company.company_name}
        subCompanyName={subCompany.sub_company_name}
      />
      <SideBarItem section="system" title="System" data={sections.system} />
      <SideBarItem section="master" title="Master" data={sections.master} />
      <SideBarItem
        section="transaction"
        title="Transactions"
        data={sections.transactions}
      />
      <SideBarItem section="report" title="Report" data={sections.reports} />

      <SideBarUserDetials />
    </div>
  );
};

export default SideBar;
