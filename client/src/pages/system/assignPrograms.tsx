import useCreateMution from "@api/mutation";
import useApiServices from "@api/query";

import Pagination from "@components/ui/Pagination";

import { useState } from "react";
import AssigneProgramTable from "./assignProgramTable";

const AssignPrograms = ({}) => {
  const { useFetchRolePrograms, useFetchRoles } = useApiServices();

  const [pageNo, setPageNo] = useState(1);
  const [selectedRole, setSelectedRole] = useState("");

  const { data } = useFetchRolePrograms(selectedRole, pageNo);

  const { data: roles } = useFetchRoles();

  const { updateUserRoleProgramAccess } = useCreateMution();

  const handleSubmit = async (program_id: number, check: boolean) => {
    const selectedRow = data.rolePrograms.filter(
      (item: any) => item.program_id === program_id
    )[0];

    const item = {
      roleName: selectedRow?.role_name,
      programId: selectedRow?.program_id,
      access: check,
    };

    await updateUserRoleProgramAccess.mutateAsync(item);
  };

  return (
    <div>
      <h1 className="text-xl font-semibold mb-10">Assign Programs</h1>
      <div>
        <p className="text-[14px] mb-2 tracking-wider font-medium">
          Filter Role
        </p>
        <select
          onChange={(e) => {
            setPageNo(1);
            setSelectedRole(e.target.value);
          }}
          className="border px-2 py-1 rounded-md mb-5 text-[14px] outline-none"
        >
          <option>Select</option>
          <option>All</option>
          {roles?.map(
            (item) =>
              item.role_name != "admin" && (
                <option value={item.role_name} key={item.role_name}>
                  {item.role_name}
                </option>
              )
          )}
        </select>
      </div>

      {data && (
        <AssigneProgramTable
          handleSubmit={handleSubmit}
          data={data.rolePrograms}
        />
      )}

      <Pagination setPageNo={setPageNo} totalItem={data?.totalCount} />
    </div>
  );
};

export default AssignPrograms;
