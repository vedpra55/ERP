import { Role } from "@@types/system";
import useCreateMution from "@api/mutation";
import CreateUserInput from "@components/input/CreateUserInput";
import { yupResolver } from "@hookform/resolvers/yup";
import { createUserSchema } from "@utils/validator";
import { FC, useRef } from "react";
import { useForm } from "react-hook-form";
import { PulseLoader } from "react-spinners";

interface Props {
  roles: Role[];
}

export type CreateUserFormValues = {
  username: string;
  email: string;
  password: string;
  roleName: string;
};

const CreateUser: FC<Props> = ({ roles }) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateUserFormValues>({
    resolver: yupResolver(createUserSchema),
  });

  const ref = useRef<HTMLButtonElement>(null);
  const { createUserMutation } = useCreateMution();

  const onSubmit = async (data: CreateUserFormValues) => {
    await createUserMutation.mutateAsync(data);
    reset({
      username: "",
      email: "",
      password: "",
      roleName: "",
    });
  };

  return (
    <div>
      <form
        className="grid grid-cols-12 gap-5 items-center mt-5 mb-5"
        onSubmit={handleSubmit((data) => onSubmit(data))}
      >
        <CreateUserInput
          errorMsg={errors.username?.message}
          name="username"
          placeholder="Name"
          register={register}
        />
        <CreateUserInput
          errorMsg={errors.email?.message}
          name="email"
          placeholder="Email"
          register={register}
        />
        <CreateUserInput
          errorMsg={errors.password?.message}
          name="password"
          placeholder="Passoword"
          register={register}
        />
        <div className="col-span-6">
          <p className="text-[14px] mb-2">Role Name</p>
          <select
            className="bg-gray-50 w-80 py-2 rounded-md px-5 outline-none focus:scale-105 transition-all"
            {...register("roleName")}
          >
            {roles.map((item) => (
              <option key={item.role_name}>{item.role_name}</option>
            ))}
          </select>
          {errors.roleName && (
            <p className="text-[14px] mt-2">{errors.roleName?.message}</p>
          )}
        </div>
        <button type="submit" ref={ref}></button>
      </form>
      <button className="myButton" onClick={() => ref.current?.click()}>
        {createUserMutation.isLoading ? (
          <PulseLoader size={14} color={"white"} />
        ) : (
          <p>Submit</p>
        )}
      </button>
    </div>
  );
};

export default CreateUser;
