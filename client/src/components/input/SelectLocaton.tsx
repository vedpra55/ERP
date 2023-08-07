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

const SelectLocation: FC<Props> = ({
  setSelectedVal: setSelectedDepartmentCode,
  handleInputChange,
  index,
  w,
  label,
  isAllValue,
}) => {
  const [locationSeachText, setLocationSeachText] = useState("");
  const [locationData, setLocationData] = useState<any[]>();
  const { useFetchLocations } = useApiServices();
  const { data: locations } = useFetchLocations("", 3);
  const { user } = useAuthContext();

  useEffect(() => {
    async function fetchData() {
      const { data } = await client.get(
        `/master/location?searchText=${locationSeachText}`,
        {
          headers: {
            Authorization: "Bearer " + user.access_token,
          },
        }
      );

      if (data?.res) {
        let values = data.res.locations
          .filter((loc: any) => !loc.closed_flag)
          .map((item: any) => {
            return {
              label: item.short_name + "-" + item.location_code,
              value: item.location_code,
            };
          });

        if (isAllValue) {
          values.push({ value: "All", label: "All" });
        }

        setLocationData(values);
      } else {
        setLocationData([{ value: "", label: "" }]);
      }
    }

    if (locationSeachText) {
      fetchData();
    }
  }, [locationSeachText]);

  useEffect(() => {
    if (locations) {
      let values = locations.location
        .filter((loc) => !loc.closed_flag)
        .map((item) => {
          return {
            label: item.short_name + "-" + item.location_code,
            value: item.location_code,
          };
        });

      if (isAllValue) {
        values.push({ value: "All", label: "All" });
      }

      setLocationData(values);
    } else {
      setLocationData([{ value: "", label: "" }]);
    }
  }, [locations]);

  return (
    <>
      <p className="text-[14px] font-medium mb-2 tracking-wider ">{label} </p>

      <Select
        onInputChange={(val) => setLocationSeachText(val)}
        onChange={(val) => {
          if (!handleInputChange) {
            setSelectedDepartmentCode(val);
          } else {
            const e = {
              target: {
                value: val?.value,
                name: "locationCode",
              },
            };
            if (val?.label) {
              handleInputChange(e, index);
            }
          }
        }}
        className={`${w ? w : "2xl:w-80"} outline-none`}
        options={
          locationData && locationData?.length > 0
            ? locationData
            : [{ value: "", label: "" }]
        }
      />
    </>
  );
};

export default SelectLocation;
