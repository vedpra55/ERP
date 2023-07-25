import useCreateMution from "@api/mutation";
import useApiServices from "@api/query";
import EditRoleProgramModal from "@components/ui/Modal/EditRoleProgramModal";
import Table, { TableColumn } from "@components/ui/Table/Table";
import { useState } from "react";

const AssignPrograms = ({}) => {
  const { useFetchRolePrograms } = useApiServices();
  const { data } = useFetchRolePrograms();

  const [isOpenModal, setModalOpen] = useState(false);
  const [check, setCheck] = useState(false);
  const [selectedRow, setSelectedRow] = useState<any>(null);

  const { updateUserRoleProgramAccess } = useCreateMution();

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

  if (!data) return;

  const productColumns: TableColumn[] = [
    { header: "Role Name", accessor: "role_name", colSpan: "col-span-2" },
    { header: "Program Name", accessor: "program_id", colSpan: "col-span-2" },
    { header: "Access", accessor: "access", colSpan: "col-span-2" },
    {
      header: "Action",
      accessor: "role_name",
      colSpan: "col-span-2",
      handleClick: handleOpenModal,
    },
  ];

  return (
    <div>
      <h1 className="text-xl font-semibold mb-5">Assign Programs</h1>
      <Table
        from="accessPrograms"
        width="w-full"
        data={data.rolePrograms}
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
