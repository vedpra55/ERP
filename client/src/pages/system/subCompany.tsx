import useCreateMution from "@api/mutation";
import useApiServices from "@api/query";
import CreatedSubCompany from "@components/system/createSubCompany";
import EditSubCompanyModal from "@components/ui/Modal/EditSubCompanyModal";
import Table, { TableColumn } from "@components/ui/Table/Table";
import { FC, useState } from "react";

interface Props {}

const SubCompany: FC<Props> = ({}) => {
  const { useFetchSubCompanies } = useApiServices();
  const { data } = useFetchSubCompanies();
  const { updateSubCompanyMutation } = useCreateMution();
  const [isOpenModal, setModalOpen] = useState(false);
  const [nameText, setNameText] = useState("");
  const [errMsg, setErrMsg] = useState("");

  const handleSubmit = async () => {
    if (!nameText) {
      return setErrMsg("Name is required");
    }

    await updateSubCompanyMutation.mutateAsync(nameText);
    setNameText("");
    setErrMsg("");
    setModalOpen(false);
  };

  const handleOnChange = (name: string) => {
    setNameText(name);
    setErrMsg("");
  };

  const subCompanyColumn: TableColumn[] = [
    {
      header: "Sub Company Name",
      accessor: "sub_company_name",
      colSpan: "col-span-2",
    },
    {
      header: "Sub Company Id",
      accessor: "sub_company_id",
      colSpan: "col-span-2",
    },
    {
      header: "Action",
      accessor: "sub_company_id",
      colSpan: "col-span-2",
      handleClick: () => {
        setModalOpen(true);
      },
    },
  ];

  return (
    <div>
      <h1 className="text-xl font-semibold mb-5">Create Sub Company</h1>
      <CreatedSubCompany />

      {data && <Table data={data} columns={subCompanyColumn} />}

      <EditSubCompanyModal
        isLoading={updateSubCompanyMutation.isLoading}
        isOpen={isOpenModal}
        setOpen={setModalOpen}
        handleOnChange={handleOnChange}
        handleSubmit={handleSubmit}
        errMsg={errMsg}
      />
    </div>
  );
};

export default SubCompany;
