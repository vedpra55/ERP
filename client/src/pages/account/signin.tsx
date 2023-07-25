import AccountContainer from "@components/account/AccountContainer";

import { FC, useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { yupResolver } from "@hookform/resolvers/yup";
import { siginSchema } from "@utils/validator";
import SigninInput from "@components/account/SinginInput";
import { toast } from "react-hot-toast";
import { useAuthContext } from "@context/AuthContext";
import client from "@api/client";
import { catchAsyncError } from "@api/catchError";

import SelectSubCompanyModal from "@components/ui/Modal/SelectSubCompanyModal";
import { PulseLoader } from "react-spinners";

interface Props {}

type FormValues = {
  username: string;
  email: string;
  password: string;
};

const Signin: FC<Props> = ({}) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: yupResolver(siginSchema),
  });

  const [isSubCompanyModalOpen, setSubCompanyModalOpen] = useState(false);
  const [subCompanyList, setSubcompanyList] = useState([]);
  const [selectedSubCompany, setSelectedSubCompany] = useState(0);
  const [isLoading, setLoading] = useState(false);

  const [capturFormData, setFormData] = useState<FormValues>();

  const { dispatch } = useAuthContext();
  const navigate = useNavigate();

  const signin = async (formData: FormValues) => {
    setLoading(true);

    const values = {
      ...formData,
      subCompanyId: selectedSubCompany,
    };

    try {
      const { data } = await client.post(`/system/auth/signin`, values);

      const user = data?.res;

      if (user?.subCompany) {
        setSubcompanyList(user.subCompany);
        setSubCompanyModalOpen(true);
      } else if (user?.verified && user?.subCompany == null) {
        dispatch({ type: "LOADING" });

        localStorage.setItem("user", JSON.stringify(user));
        dispatch({ type: "LOGIN", payload: user });
        toast.success("Loggedin Successfully");
        navigate("/");
        return;
      } else {
        dispatch({ type: "LOGOUT" });
        toast.error("Please verify the email");

        reset({
          username: "",
          email: "",
          password: "",
        });
      }
    } catch (err) {
      dispatch({ type: "LOGOUT" });
      const message = catchAsyncError(err);
      toast.error(message.message);
      console.log(err);
    }

    setLoading(false);
  };

  const onSubmit = async (data: FormValues) => {
    setFormData(data);
    await signin(data);
  };

  const handleOnSelectSubCompany = async () => {
    setSubCompanyModalOpen(false);
    setSubcompanyList([]);

    if (capturFormData) {
      await signin(capturFormData);
    }
  };

  const onChangeInput = (e: any) => {
    const { value } = e.target;
    setSelectedSubCompany(parseInt(value));
  };

  return (
    <AccountContainer title="Welcome Back">
      <form
        onSubmit={handleSubmit((data) => onSubmit(data))}
        className="accountFormContainer"
      >
        <SigninInput
          errorMsg={errors.username?.message}
          name="username"
          placeholder="Name"
          register={register}
        />
        <SigninInput
          errorMsg={errors.email?.message}
          name="email"
          placeholder="Email"
          register={register}
        />
        <SigninInput
          errorMsg={errors.password?.message}
          name="password"
          placeholder="Password"
          register={register}
        />
        <button className="myButton" type="submit">
          {isLoading ? <PulseLoader color="white" /> : "Submit"}
        </button>

        <Link
          className="text-xs mt-5 font-medium font-gray-500"
          to={"/account/create-account"}
        >
          Create New Account
        </Link>
      </form>

      {isSubCompanyModalOpen && (
        <SelectSubCompanyModal
          handleSubmit={handleOnSelectSubCompany}
          handleOnChange={onChangeInput}
          isOpen={isSubCompanyModalOpen}
          setOpen={setSubCompanyModalOpen}
          subCompanyList={subCompanyList}
        />
      )}
    </AccountContainer>
  );
};

export default Signin;
