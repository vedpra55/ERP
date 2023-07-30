import { RolePrograms } from "@@types/system";
import useCreateMution from "@api/mutation";
import useApiServices from "@api/query";
import EditRoleProgramModal from "@components/ui/Modal/EditRoleProgramModal";
import Table, { TableColumn } from "@components/ui/Table/Table";
import { useEffect, useState } from "react";

const AssignPrograms = ({}) => {
  const { useFetchRolePrograms, useFetchRoles } = useApiServices();
  const { data } = useFetchRolePrograms();
  const { data: roles } = useFetchRoles();

  const [isOpenModal, setModalOpen] = useState(false);
  const [check, setCheck] = useState(false);
  const [selectedRow, setSelectedRow] = useState<any>(null);
  const { updateUserRoleProgramAccess } = useCreateMution();
  const [filterRolePrograms, setFilterRolePrograms] =
    useState<RolePrograms[]>();
  const [selectedRole, setSelectedRole] = useState("");

  const handleOpenModal = (index: number) => {
    setSelectedRow(data.rolePrograms[index]);
    setModalOpen(true);
    setCheck(data.rolePrograms[index].access);
  };

  const handleOnChange = (val: boolean) => {
    setCheck(val);
  };

  const handleSubmit = async () => {
    const item = {
      roleName: selectedRow?.role_name,
      programId: selectedRow?.program_id,
      access: check,
    };

    await updateUserRoleProgramAccess.mutateAsync(item);

    setModalOpen(false);
  };

  useEffect(() => {
    if (data && selectedRole) {
      if (selectedRole === "All") {
        let filterp = data.rolePrograms;
        setFilterRolePrograms(filterp);
        return;
      }

      const filterp = data.rolePrograms.filter(
        (item: any) => item.role_name === selectedRole
      );
      setFilterRolePrograms(filterp);
    }
  }, [selectedRole]);

  if (!data || !roles) return;

  const productColumns: TableColumn[] = [
    {
      header: "Role Name",
      accessor: "role_name",
      colSpan: "2xl:col-span-2 md:col-span-3",
    },
    {
      header: "Program Name",
      accessor: "program_name",
      colSpan: "2xl:col-span-3 md:col-span-3",
    },
    {
      header: "Access",
      accessor: "access",
      colSpan: "2xl:col-span-2 md:col-span-3",
    },
    {
      header: "Action",
      accessor: "role_name",
      colSpan: "2xl:col-span-2 md:col-span-3",
      handleClick: handleOpenModal,
    },
  ];

  return (
    <div>
      <h1 className="text-xl font-semibold mb-10">Assign Programs</h1>
      <div>
        <p className="text-[14px] mb-2 tracking-wider">Filter Role</p>
        <select
          onChange={(e) => setSelectedRole(e.target.value)}
          className="border px-2 py-1 rounded-md mb-5 outline-none"
        >
          <option>Select</option>
          <option>All</option>
          {roles.map(
            (item) =>
              item.role_name != "admin" && (
                <option value={item.role_name} key={item.role_name}>
                  {item.role_name}
                </option>
              )
          )}
        </select>
      </div>

      <Table
        from="accessPrograms"
        noMargin
        width="w-full"
        data={filterRolePrograms ? filterRolePrograms : data.rolePrograms}
        columns={productColumns}
      />

      <EditRoleProgramModal
        check={check}
        isLoading={updateUserRoleProgramAccess.isLoading}
        handleOnChange={handleOnChange}
        handleSubmit={handleSubmit}
        isOpen={isOpenModal}
        setOpen={setModalOpen}
      />
    </div>
  );
};

export default AssignPrograms;
