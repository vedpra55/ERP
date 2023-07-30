import { FC, useState } from "react";
import Modal from "./Modal";
import { Role } from "@@types/system";
import AppButton from "../AppButton";

interface Props {
  handleSubmit(val: string): void;
  handelDelete(): void;
  selectedUser: any;
  roles?: Role[];
  isOpen: boolean;
  setOpen: any;
  isLoadingSubmit?: boolean;
  isLoadingDelete?: boolean;
}

const EditUserModal: FC<Props> = ({
  isOpen,
  setOpen,
  handleSubmit,
  handelDelete,
  roles,
  selectedUser,
  isLoadingDelete,
  isLoadingSubmit,
}) => {
  const [selectedRole, setSelectedRole] = useState(selectedUser.role_name);

  return (
    <Modal isOpen={isOpen} onClose={() => setOpen(false)}>
      <h1 className="font-medium  mb-6">Edit User</h1>
      <div className="mb-5">
        <label className="text-[14px]">Edit Role</label>
        <select
          className="border w-full mt-2 px-5 py-1 rounded-md outline-none"
          value={selectedRole}
          onChange={(e) => setSelectedRole(e.target.value)}
        >
          {roles?.map((item) => (
            <option key={item.role_name}>{item.role_name}</option>
          ))}
        </select>
      </div>
      <AppButton
        isLoading={isLoadingSubmit}
        width="w-full"
        handleOnClick={() => handleSubmit(selectedRole)}
        title="Submit"
      />
      <div className="mt-3">
        <AppButton
          isLoading={isLoadingDelete}
          width="w-full"
          color="bg-red-500"
          handleOnClick={handelDelete}
          title="Delete"
        />
      </div>
    </Modal>
  );
};

export default EditUserModal;
