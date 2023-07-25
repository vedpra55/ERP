import { FC } from "react";
import Modal from "./Modal";
import AppButton from "../AppButton";

interface Props {
  handleSubmit(): void;
  handleOnChange(name: string): void;
  isOpen: boolean;
  setOpen: any;
  errMsg?: string;
  isLoading?: boolean;
}

const EditSubCompanyModal: FC<Props> = ({
  handleSubmit,
  handleOnChange,
  isOpen,
  setOpen,
  errMsg,
  isLoading,
}) => {
  return (
    <Modal isOpen={isOpen} onClose={() => setOpen(false)}>
      <h1 className="font-medium text-[14px] mb-6">Edit Sub Company Name</h1>
      {errMsg && <p className="text-red-500 text-[14px] mb-1">{errMsg}</p>}
      <div>
        <input
          onChange={(e) => handleOnChange(e.target.value)}
          placeholder="Name"
          className="myInput mb-3"
          type="text"
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

export default EditSubCompanyModal;
