import { useAuthContext } from "@context/AuthContext";
import { useEffect, useState } from "react";
import { FadeLoader } from "react-spinners";

import { Route, Routes } from "react-router-dom";
import CreateAccount from "@pages/account/createAccount";
import Signin from "@pages/account/signin";
import UnAuthHome from "@pages/home/unAuthHome";
import RoutesManagment from "./routesManagement";

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

  return (
    <main className=" font-roboto container max-w-screen-2xl mx-auto">
      {user.email ? (
        <RoutesManagment user={user} />
      ) : (
        <Routes>
          <Route path="/" element={<UnAuthHome />} />
          <Route path="/account/create-account" element={<CreateAccount />} />
          <Route path="/account/signin" element={<Signin />} />
        </Routes>
      )}
    </main>
  );
}

export default App;
