import useCreateMution from "@api/mutation";
import AppButton from "@components/ui/AppButton";
import { FC, useState } from "react";

interface Props {}

const CreatedSubCompany: FC<Props> = ({}) => {
  const [name, setName] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const { createSubCompanyMutation } = useCreateMution();

  const handleCreateSubCompany = async () => {
    if (!name) {
      return setErrorMsg("Name is requires");
    }
    await createSubCompanyMutation.mutateAsync(name);

    setName("");
  };

  return (
    <div>
      <p className="text-[14px] text-red-500 mb-1">{errorMsg}</p>
      <div className="flex gap-x-5 items-center">
        <input
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            setErrorMsg("");
          }}
          placeholder="Name"
          type="text"
          required={true}
          className="myInput"
        />

        <AppButton
          isLoading={createSubCompanyMutation.isLoading}
          handleOnClick={handleCreateSubCompany}
          title="Submit"
        />
      </div>
    </div>
  );
};

export default CreatedSubCompany;
