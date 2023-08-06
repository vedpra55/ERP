import { FC } from "react";
import Modal from "./Modal";
import { SelecteInputNormal } from "@components/input/SelectInput";

interface Props {
  handleSubmit(): void;
  subCompanyList: any[];
  handleOnChange(e: any): void;
  isOpen: boolean;
  setOpen: any;
}

const SelectSubCompanyModal: FC<Props> = ({
  isOpen,
  setOpen,
  handleOnChange,
  subCompanyList,
  handleSubmit,
}) => {
  if (!Array.isArray(subCompanyList)) return;

  return (
    <Modal isOpen={isOpen} onClose={() => setOpen(false)}>
      <h1 className="font-medium text-[14px] mb-6">Select Sub Company</h1>
      <SelecteInputNormal
        extraValAccessor="sub_company_name"
        name="selectedSubCompany"
        label=""
        data={subCompanyList}
        accessor="sub_company_id"
        handleChange={handleOnChange}
      />
      <button
        onClick={() => {
          setOpen(false);
          handleSubmit();
        }}
        className="myButton py-2 w-full mt-5"
      >
        Submit
      </button>
    </Modal>
  );
};

export default SelectSubCompanyModal;
