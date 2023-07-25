import useApiServices from "@api/query";
import CreateUser from "@components/system/createUser";
import Table, { TableColumn } from "@components/ui/Table/Table";
import { FC } from "react";

interface Props {}

const SystemUser: FC<Props> = ({}) => {
  const { useFetchRoles, useFetchCreateUser } = useApiServices();
  const { data: roles, isLoading } = useFetchRoles();
  const { data: createUser } = useFetchCreateUser();

  if (isLoading || !createUser) return;

  const createdUserColumn: TableColumn[] = [
    { header: "User Name", accessor: "username", colSpan: "col-span-2" },
    { header: "Email", accessor: "email", colSpan: "col-span-2" },
    { header: "Role", accessor: "role_name", colSpan: "col-span-2" },
    {
      header: "Sub Company Id",
      accessor: "sub_company_id",
      colSpan: "col-span-2",
    },
    { header: "Action", accessor: "action", colSpan: "col-span-2" },
  ];

  return (
    <div>
      <h1 className="text-xl font-semibold mb-5">Create User</h1>
      {roles && <CreateUser roles={roles} />}

      <Table width="w-full" data={createUser} columns={createdUserColumn} />
    </div>
  );
};

export default SystemUser;
