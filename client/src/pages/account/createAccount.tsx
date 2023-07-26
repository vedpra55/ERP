import AccountContainer from "@components/account/AccountContainer";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { yupResolver } from "@hookform/resolvers/yup";
import { signupSchema } from "@utils/validator";
import SignUpInput from "@components/account/SingupInput";
import { User, useAuthContext } from "@context/AuthContext";
import { toast } from "react-hot-toast";
import { catchAsyncError } from "@api/catchError";
import client from "@api/client";
import { PulseLoader } from "react-spinners";
import { useState } from "react";

type FormValues = {
  username: string;
  email: string;
  password: string;
  companyName: string;
};

const CreateAccount = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: yupResolver(signupSchema),
  });

  const [isLoading, setLoading] = useState(false);
  const { dispatch } = useAuthContext();

  const singup = async (formData: FormValues) => {
    setLoading(true);
    try {
      const { data } = await client.post(`/system/auth/register`, formData);

      const user: User = data?.res;

      console.log(user);

      toast.success("Account Created. Please Verify The Email & Sign In");

      reset({
        companyName: "",
        username: "",
        email: "",
        password: "",
      });
    } catch (err) {
      dispatch({ type: "LOGOUT" });
      const message = catchAsyncError(err);
      toast.error(message.message);
      console.log(err);
    }

    setLoading(false);
  };

  const onSubmit = async (data: FormValues) => {
    await singup(data);
  };

  return (
    <AccountContainer title="Create Account">
      <form
        onSubmit={handleSubmit((data) => onSubmit(data))}
        className="accountFormContainer"
      >
        <SignUpInput
          errorMsg={errors.username?.message}
          name="username"
          placeholder="Name"
          register={register}
        />
        <SignUpInput
          errorMsg={errors.email?.message}
          name="email"
          placeholder="Email"
          register={register}
        />
        <SignUpInput
          errorMsg={errors.password?.message}
          name="password"
          placeholder="Password"
          register={register}
        />
        <SignUpInput
          errorMsg={errors.companyName?.message}
          name="companyName"
          placeholder="Company"
          register={register}
        />
        <button className="myButton" type="submit">
          {isLoading ? <PulseLoader color="white" /> : "Submit"}
        </button>

        <Link
          className="text-xs mt-5 font-medium font-gray-500"
          to={"/account/signin"}
        >
          Already have account ?
        </Link>
      </form>
    </AccountContainer>
  );
};

export default CreateAccount;
