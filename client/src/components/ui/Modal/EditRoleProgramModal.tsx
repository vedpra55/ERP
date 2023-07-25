import { FC } from "react";
import Modal from "./Modal";
import AppButton from "../AppButton";

interface Props {
  handleSubmit(): void;
  handleOnChange(val?: boolean): void;
  isOpen: boolean;
  setOpen: any;
  check?: boolean;
  isLoading?: boolean;
}

const EditRoleProgramModal: FC<Props> = ({
  handleSubmit,
  handleOnChange,
  isOpen,
  setOpen,
  check,
  isLoading,
}) => {
  return (
    <Modal isOpen={isOpen} onClose={() => setOpen(false)}>
      <h1 className="font-medium text-[14px] mb-3">Edit User Role Program</h1>
      <div>
        <input
          className="w-5 h-5 mb-5"
          type="checkbox"
          onChange={(e) => handleOnChange(e.target.checked)}
          checked={check}
        />
        <AppButton
          isLoading={isLoading}
          width="w-full"
          handleOnClick={handleSubmit}
          title="Submit"
        />
      </div>
    </Modal>
  );
};

export default EditRoleProgramModal;
