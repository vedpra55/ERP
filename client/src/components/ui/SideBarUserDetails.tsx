import { useAuthContext } from "@context/AuthContext";

const SideBarUserDetials = () => {
  const { user } = useAuthContext();

  return (
    <div className="flex   w-full  items-end h-full">
      <div className="bg-gray-100 flex flex-col gap-y-1 text-[14px] w-full p-5">
        <p>Name - {user.username}</p>
        <p>Email - {user.email}</p>
        <p>Role - {user.roleName}</p>
      </div>
    </div>
  );
};

export default SideBarUserDetials;
