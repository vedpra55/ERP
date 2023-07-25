import { FC } from "react";

interface Props {}

const NotFoundPage: FC<Props> = ({}) => {
  return (
    <div className="flex items-center justify-center h-96">
      <div>
        <h1 className="text-4xl text-center font-medium ">Page not found</h1>
        <p className="text-center mt-3 tracking-wider">
          or you have not permission to access this page
        </p>
      </div>
    </div>
  );
};

export default NotFoundPage;
