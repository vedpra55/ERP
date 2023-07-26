import { useAuthContext } from "@context/AuthContext";
import { useEffect, useState } from "react";
import { FadeLoader } from "react-spinners";

import { Route, Routes } from "react-router-dom";
import CreateAccount from "@pages/account/createAccount";
import Signin from "@pages/account/signin";
import UnAuthHome from "@pages/home/unAuthHome";

function App() {
  const { isLoading, user } = useAuthContext();
  const [isAuthReady, setAuthReady] = useState(false);

  useEffect(() => {
    if (!isLoading) {
      setAuthReady(true);
    }
  }, [isLoading]);

  if (isLoading || !isAuthReady) {
    return (
      <div className=" h-screen w-full flex justify-center items-center">
        <FadeLoader className="text-gray-500" />
      </div>
    );
  }

  console.log(user);

  return (
    <>
      <Routes>
        <Route path="/" element={<UnAuthHome />} />
        <Route path="/account/create-account" element={<CreateAccount />} />
        <Route path="/account/signin" element={<Signin />} />
      </Routes>
    </>
  );
}

export default App;
