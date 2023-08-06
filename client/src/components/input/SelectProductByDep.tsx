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
  departmentCode?: any;
  selectedValue?: any;
}

const SelectProductByDep: FC<Props> = ({
  setSelectedDepartmentCode,
  handleInputChange,
  index,
  w,
  departmentCode,
  selectedValue,
}) => {
  if (!departmentCode) return;

  const [productSeachText, setProductSeachText] = useState("");
  const [productData, setProductData] = useState<any[]>();
  const { useFetchProducts } = useApiServices();
  const { data: products } = useFetchProducts("", departmentCode, 3);
  const { user } = useAuthContext();

  useEffect(() => {
    async function fetchData() {
      const { data } = await client.get(
        `/master/product?searchText=${productSeachText}&departmentCode=${departmentCode}`,
        {
          headers: {
            Authorization: "Bearer " + user.access_token,
          },
        }
      );

      if (data?.res) {
        const values = data.res.products.map((item: any) => {
          if (!item?.closed_flag) {
            return { label: item.product_code, value: item.product_code };
          } else {
            return { value: "", label: "" };
          }
        });

        setProductData(values);
      } else {
        setProductData([{ value: "", label: "" }]);
      }
    }

    if (productSeachText) {
      fetchData();
    }
  }, [productSeachText]);

  useEffect(() => {
    if (products) {
      const values = products.product.map((item: any) => {
        if (!item?.closed_flag) {
          return {
            label: item.product_code + "-" + item.product_description,
            value: item.product_code,
          };
        } else {
          return { value: "", label: "" };
        }
      });

      setProductData(values);
    } else {
      setProductData([{ value: "", label: "" }]);
    }
  }, [products]);

  return (
    <>
      {!handleInputChange && (
        <p className="text-[14px] mb-2 tracking-wider ">Product Code</p>
      )}
      <Select
        onInputChange={(val) => setProductSeachText(val)}
        onChange={(val) => {
          if (!handleInputChange) {
            setSelectedDepartmentCode(val);
          } else {
            const e = {
              target: {
                value: val?.value,
                name: "productCode",
              },
            };
            if (val?.label) {
              handleInputChange(e, index);
            }
          }
        }}
        value={selectedValue}
        className={`${w ? w : "2xl:w-80"} outline-none text-[14px]`}
        options={
          productData && productData?.length > 0
            ? productData
            : [{ value: "", label: "" }]
        }
      />
    </>
  );
};

export default SelectProductByDep;
