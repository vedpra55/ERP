import { CreatedUser } from "@@types/system";
import useCreateMution from "@api/mutation";
import useApiServices from "@api/query";
import CreateUser from "@components/system/createUser";
import EditUserModal from "@components/ui/Modal/EditUserModal";
import Table, { TableColumn } from "@components/ui/Table/Table";
import { useAuthContext } from "@context/AuthContext";
import { FC, useState } from "react";

interface Props {}

const SystemUser: FC<Props> = ({}) => {
  const { useFetchRoles, useFetchCreateUser } = useApiServices();
  const { data: roles, isLoading } = useFetchRoles();
  const { data: createUser } = useFetchCreateUser();
  const [isOpenModal, setModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>();
  const { deleteUserMutation, editUserMutation } = useCreateMution();

  if (isLoading || !createUser) return;

  const handleOpenModal = (index: number) => {
    setSelectedUser(createUser[index]);
    setModalOpen(true);
  };

  const createdUserColumn: TableColumn[] = [
    {
      header: "User Name",
      accessor: "username",
      colSpan: "2xl:col-span-2 md:col-span-3",
    },
    { header: "Email", accessor: "email", colSpan: "col-span-2" },
    { header: "Role", accessor: "role_name", colSpan: "col-span-2" },
    {
      header: "Sub Company Id",
      accessor: "sub_company_id",
      colSpan: "2xl:col-span-2 md:col-span-3",
    },
    {
      header: "Action",
      field: "user_name",
      accessor: "user_name",
      colSpan: "col-span-2",
      handleClick: handleOpenModal,
    },
  ];

  const { user } = useAuthContext();

  const handleDelete = async () => {
    const item = {
      subCompanyId: selectedUser.sub_company_id,
      username: selectedUser.username,
    };
    await deleteUserMutation.mutateAsync(item);
    setModalOpen(false);
  };

  const handleSubmit = async (val: string) => {
    const item = {
      subCompanyId: selectedUser.sub_company_id,
      username: selectedUser.username,
      updatedRole: val,
    };

    await editUserMutation.mutateAsync(item);

    setModalOpen(false);
  };

  const usersData: CreatedUser[] = [];

  createUser.forEach((item) => {
    if (item.username === user.username) return;
    usersData.push(item);
  });

  return (
    <div>
      <h1 className="text-xl font-semibold mb-5">Create User</h1>
      {roles && <CreateUser roles={roles} />}

      <Table width="w-full" data={usersData} columns={createdUserColumn} />

      {isOpenModal && selectedUser && (
        <EditUserModal
          isLoadingDelete={deleteUserMutation.isLoading}
          isLoadingSubmit={editUserMutation.isLoading}
          selectedUser={selectedUser}
          handelDelete={handleDelete}
          handleSubmit={handleSubmit}
          isOpen={isOpenModal}
          setOpen={setModalOpen}
          roles={roles}
        />
      )}
    </div>
  );
};

export default SystemUser;
