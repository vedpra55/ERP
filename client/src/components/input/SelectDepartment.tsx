import client from "@api/client";
import useApiServices from "@api/query";
import { useAuthContext } from "@context/AuthContext";
import { FC, useEffect, useState } from "react";
import Select from "react-select";

interface Props {
  setSelectedDepartmentCode?: any;
  handleInputChange?: any;
  index?: number;
  w?: any;
  isAllValue?: boolean;
  isShowLable?: boolean;
}

const SelectDepartment: FC<Props> = ({
  setSelectedDepartmentCode,
  handleInputChange,
  index,
  w,
  isAllValue,
  isShowLable,
}) => {
  const [departmentSeachText, setDepartmentSeachText] = useState("");
  const [departmentData, setDepartmentData] = useState<any[]>();
  const { useFetchCategories } = useApiServices();

  const seach = "";
  const { data: departments } = useFetchCategories(seach, 3);

  const { user } = useAuthContext();

  useEffect(() => {
    async function fetchData() {
      const { data } = await client.get(
        `/master/department?searchText=${departmentSeachText}`,
        {
          headers: {
            Authorization: "Bearer " + user.access_token,
          },
        }
      );

      if (data?.res) {
        let values = data.res.departments
          .filter((dep: any) => !dep.closed_flag)
          .map((item: any) => {
            return { label: item.department_name, value: item.department_code };
          });

        if (isAllValue) {
          values.push({ value: "All", label: "All" });
        }

        setDepartmentData(values);
      } else {
        setDepartmentData([{ value: "", label: "" }]);
      }
    }

    if (departmentSeachText) {
      fetchData();
    }
  }, [departmentSeachText]);

  useEffect(() => {
    if (departments) {
      let values = departments.category
        .filter((dep) => !dep.closed_flag)
        .map((item) => {
          return {
            label: item.department_name + "-" + item.department_code,
            value: item.department_code,
          };
        });

      if (isAllValue) {
        values.push({ value: "All", label: "All" });
      }

      setDepartmentData(values);
    } else {
      setDepartmentData([{ value: "", label: "" }]);
    }
  }, [departments]);

  return (
    <>
      {!handleInputChange && (
        <p className="text-[14px] mb-2 font-medium tracking-wider ">
          Department Code
        </p>
      )}

      {isShowLable && (
        <p className="text-[14px] mb-2 font-medium tracking-wider ">
          Department Code
        </p>
      )}
      <Select
        onInputChange={(val) => setDepartmentSeachText(val)}
        onChange={(val) => {
          if (!handleInputChange) {
            setSelectedDepartmentCode(val);
          } else {
            const e = {
              target: {
                value: val?.value,
                name: "departmentCode",
              },
            };
            if (val?.label) {
              handleInputChange(e, index);
            }
          }
        }}
        className={`${w ? w : "2xl:w-80"} text-[14px] outline-none`}
        options={
          departmentData && departmentData?.length > 0
            ? departmentData
            : [{ value: "", label: "" }]
        }
      />
    </>
  );
};

export default SelectDepartment;
