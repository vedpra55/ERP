import useCreateMution from "@api/mutation";
import useApiServices from "@api/query";
import AppButton from "@components/ui/AppButton";

import { FC, useState } from "react";

interface Props {}

const CreateRoles: FC<Props> = ({}) => {
  const [roleName, setRoleName] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const { createRoleMutation } = useCreateMution();
  const { useFetchRoles } = useApiServices();
  const { data } = useFetchRoles();

  console.log(data);

  const handleCreateRoles = async () => {
    if (!roleName) {
      setErrorMsg("Name is requires");
    }
    await createRoleMutation.mutateAsync(roleName);
    setRoleName("");
  };

  return (
    <div>
      <h1 className="text-xl font-semibold mb-5">Create Roles</h1>
      <p className="text-[14px] text-red-500 mb-1">{errorMsg}</p>
      <div className="flex gap-x-5 items-center">
        <input
          value={roleName}
          onChange={(e) => {
            setRoleName(e.target.value);
            setErrorMsg("");
          }}
          placeholder="Name"
          type="text"
          required={true}
          className="myInput"
        />

        <AppButton
          isLoading={createRoleMutation.isLoading}
          handleOnClick={handleCreateRoles}
          title="Submit"
        />
      </div>
      <div className="flex flex-col gap-y-3">
        <h4 className="text-xl font-semibold mt-10 ">Roles </h4>
        {data &&
          data.map((item) => <li key={item.role_name}>{item.role_name}</li>)}
      </div>
    </div>
  );
};

export default CreateRoles;
