import client from "@api/client";
import useApiServices from "@api/query";
import { useAuthContext } from "@context/AuthContext";
import { FC, useEffect, useState } from "react";
import Select from "react-select";

interface Props {
  setSelectedVal?: any;
  handleInputChange?: any;
  index?: number;
  w?: any;
  label?: string;
  isAllValue?: boolean;
}

const SelectSupplier: FC<Props> = ({
  setSelectedVal: setSelectedDepartmentCode,
  handleInputChange,
  index,
  w,
  label,
  isAllValue,
}) => {
  const [supplierSeachText, setSupplierSeachText] = useState("");
  const [supplierData, setSupplierData] = useState<any[]>();
  const { useFetchSuppliers } = useApiServices();
  const { data: suppliers } = useFetchSuppliers("", 3);
  const { user } = useAuthContext();

  useEffect(() => {
    async function fetchData() {
      const { data } = await client.get(
        `/master/supplier?searchText=${supplierSeachText}`,
        {
          headers: {
            Authorization: "Bearer " + user.access_token,
          },
        }
      );

      if (data?.res) {
        let values = data.res.suppliers.map((item: any) => {
          if (!item?.closed_flag) {
            return {
              label: item.supplier_name + "-" + item.supplier_code,
              value: item.supplier_code,
            };
          } else {
            return { value: "", label: "" };
          }
        });

        if (isAllValue) {
          values.push({ value: "All", label: "All" });
        }

        setSupplierData(values);
      } else {
        setSupplierData([{ value: "", label: "" }]);
      }
    }

    if (supplierSeachText) {
      fetchData();
    }
  }, [supplierSeachText]);

  useEffect(() => {
    if (suppliers) {
      let values = suppliers.supplier.map((item: any) => {
        if (!item?.closed_flag) {
          return {
            label: item.supplier_name + "-" + item.supplier_code,
            value: item.supplier_code,
          };
        } else {
          return { value: "", label: "" };
        }
      });

      if (isAllValue) {
        values.push({ value: "All", label: "All" });
      }

      setSupplierData(values);
    } else {
      setSupplierData([{ value: "", label: "" }]);
    }
  }, [suppliers]);

  return (
    <>
      <p className="text-[14px] font-medium mb-2 tracking-wider ">{label} </p>

      <Select
        onInputChange={(val) => setSupplierSeachText(val)}
        onChange={(val) => {
          if (!handleInputChange) {
            setSelectedDepartmentCode(val);
          } else {
            const e = {
              target: {
                value: val?.value,
                name: "supplierCode",
              },
            };
            if (val?.label) {
              handleInputChange(e, index);
            }
          }
        }}
        className={`${w ? w : "2xl:w-80"} outline-none`}
        options={
          supplierData && supplierData?.length > 0
            ? supplierData
            : [{ value: "", label: "" }]
        }
      />
    </>
  );
};

export default SelectSupplier;
