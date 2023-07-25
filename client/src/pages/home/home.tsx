import useApiServices from "@api/query";
import { useAuthContext } from "@context/AuthContext";
import { Link } from "react-router-dom";

const Home = () => {
  const { useFetchCompany } = useApiServices();
  const { logout } = useAuthContext();
  const { data } = useFetchCompany();

  return (
    <div className="mt-20 flex flex-col gap-y-10 justify-center items-center">
      <h1 className="text-3xl font-bold">{data?.company_name} Company</h1>
      <Link
        to={"/app"}
        className="bg-black w-36 py-2  text-center text-white text-[14px] rounded-lg"
      >
        Main App
      </Link>
      <button className="myButton w-20 py-2" onClick={logout}>
        Logout
      </button>
    </div>
  );
};

export default Home;
