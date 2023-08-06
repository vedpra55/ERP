import { FC, useEffect, useState } from "react";

interface Props {
  data: any[];
  handleSubmit(index: any, check: boolean): void;
}

const AssigneProgramTable: FC<Props> = ({ data, handleSubmit }) => {
  return (
    <div className={` h-[30rem]  overflow-y-scroll`}>
      <Header />
      {data.map((item, i) => {
        return (
          <Row index={i} handleSubmit={handleSubmit} item={item} key={i} />
        );
      })}
    </div>
  );
};

const Row: FC<{
  index: any;
  item: any;
  handleSubmit(index: any, check: boolean): void;
}> = ({ item, handleSubmit }) => {
  const [check, setCheck] = useState(item.access);

  useEffect(() => {
    setCheck(item.access);
  }, [item]);

  return (
    <div className="tableRow overflow-x-auto">
      <div className="col-span-2">{item.role_name}</div>
      <div className="col-span-2">{item.program_name}</div>
      <div className="col-span-2">
        <input
          onChange={(e) => setCheck(e.target.checked)}
          checked={check}
          type="checkbox"
        />
      </div>
      <div className="col-span-2">
        <button
          onClick={() => handleSubmit(item.program_id, check)}
          className="myButton w-20 py-2 text-[14px]"
        >
          Update
        </button>
      </div>
    </div>
  );
};

function Header() {
  return (
    <div className="grid grid-cols-12 gap-x-2 bg-gray-100 py-3 px-10 text-[14px] font-medium rounded-md">
      <div className="col-span-2">Role Name</div>
      <div className="col-span-2">Programe Name</div>
      <div className="col-span-2">Access</div>
      <div className="col-span-2">Action</div>
    </div>
  );
}

export default AssigneProgramTable;
