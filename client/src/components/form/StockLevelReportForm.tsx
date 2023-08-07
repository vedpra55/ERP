import { Location } from "@@types/system";
import { fetchSingleCategory, fetchSingleLocation } from "@api/getCalls";
import SelectDepartment from "@components/input/SelectDepartment";
import { SelecteInputNormal } from "@components/input/SelectInput";
import SelectLocation from "@components/input/SelectLocaton";
import AppButton from "@components/ui/AppButton";
import { useAuthContext } from "@context/AuthContext";
import { StockLevelReportParameter } from "@pages/report/stockLevelReport";
import { FC, useEffect, useState } from "react";
import { GrFormClose } from "react-icons/gr";

interface Props {
  parameters: StockLevelReportParameter;
  setParameters: any;
  handleDownload(): void;
  isLoading: boolean;
}

const StockLevelReportForm: FC<Props> = ({
  parameters,
  setParameters,
  handleDownload,
  isLoading,
}) => {
  const [selectedDepartmet, setSelectedDepartmet] = useState<any[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<Location[]>();
  const [change, setChange] = useState(false);

  function handleOnInputChange(e: any) {
    const { name, value } = e.target;
    let list = parameters;

    if (name === "departmentCode") {
      if (value === "Select") {
        return;
      }
      if (value === "All") {
        setSelectedDepartmet(["All"]);
        return;
      }

      const allValIndex = selectedDepartmet.indexOf("All");

      if (allValIndex != -1) {
        let list = selectedDepartmet;
        list.splice(allValIndex, 1);
        setSelectedDepartmet(list);
      }

      const isExit = selectedDepartmet.filter(
        (res) => res.department_code === value
      )[0];

      if (isExit) return;

      fetchSingleCategory(value, user.access_token).then((item) => {
        if (item) {
          const selectedIndex = selectedDepartmet.indexOf(value);

          if (selectedIndex !== -1) {
            const updatedSelectedItems = [...selectedDepartmet];
            updatedSelectedItems.splice(selectedIndex, 1);
            setSelectedDepartmet(updatedSelectedItems);
          } else {
            setSelectedDepartmet((prevSelected) => [...prevSelected, item]);
          }
        }
      });

      setChange(!change);
    }

    if (name === "locationCode") {
      list["locationCode"] = value;
      setParameters(list);
      setChange(!change);
    }

    if (name === "closed") {
      list["closed"] = value;
      setParameters(list);
    }

    if (name === "status") {
      if (
        value === "Greater Than" ||
        value === "Less Than" ||
        value === "Equal To"
      ) {
        list["status"]["type"] = value;
        setParameters(list);
      } else {
        list["status"]["value"] = value;
        setParameters(list);
      }
    }
  }

  function removeDepartment(departmentCode: string) {
    const items = selectedDepartmet.filter(
      (res) => res.department_code != departmentCode
    );

    setSelectedDepartmet(items);
  }

  const { user } = useAuthContext();

  useEffect(() => {
    if (parameters.locationCode != "All") {
      fetchSingleLocation(parameters.locationCode, user.access_token).then(
        (item) => {
          if (item) {
            setSelectedLocation([item]);
          }
        }
      );
    }
  }, [change]);

  useEffect(() => {
    setParameters({
      ...parameters,
      departmentCode: selectedDepartmet,
    });
  }, [selectedDepartmet]);

  return (
    <>
      <div className="grid grid-cols-12 gap-5 mb-5 items-end mt-10">
        <div className="col-span-4">
          <SelectDepartment
            isAllValue
            isShowLable
            handleInputChange={handleOnInputChange}
          />
        </div>
        {selectedDepartmet?.length > 0 && (
          <div className="col-span-8 flex flex-wrap gap-x-5 items-center border rounded-md px-5 py-1">
            {selectedDepartmet?.map((item) =>
              item?.department_name ? (
                <div
                  className="bg-gray-100 rounded-md flex items-center gap-x-2 px-3 py-1"
                  key={item?.department_code}
                >
                  {item?.department_name}
                  <div
                    className="cursor-pointer"
                    onClick={() => removeDepartment(item?.department_code)}
                  >
                    <GrFormClose />
                  </div>
                </div>
              ) : (
                <div>All</div>
              )
            )}
          </div>
        )}
        <div className="col-span-4">
          <SelectLocation
            isAllValue
            label="Location Code"
            handleInputChange={handleOnInputChange}
          />
        </div>
        {selectedLocation != undefined &&
          selectedLocation.length > 0 &&
          parameters.locationCode != "All" && (
            <div className="col-span-8 flex flex-wrap gap-x-5 items-center border rounded-md px-5 py-1">
              {selectedLocation?.map((item) => (
                <div
                  className="bg-gray-100 rounded-md flex items-center gap-x-2 px-3 py-1"
                  key={item.location_code}
                >
                  {item.location_name}
                </div>
              ))}
            </div>
          )}
        <SelecteInputNormal
          data={[{ name: "Yes" }, { name: "No" }, { name: "All" }]}
          accessor="name"
          handleChange={handleOnInputChange}
          name="closed"
          label="Closed"
        />
        <StatusSelection handleOnInputChange={handleOnInputChange} />
      </div>
      <AppButton
        isLoading={isLoading}
        handleOnClick={handleDownload}
        title="Download"
      />
    </>
  );
};

export default StockLevelReportForm;

const StatusSelection: FC<{ handleOnInputChange: any }> = ({
  handleOnInputChange,
}) => {
  return (
    <div className="col-span-4 ">
      <p className="text-[14px] tracking-wider font-medium">Status</p>
      <div className="flex items-center gap-x-2">
        <select
          className="border outline-none  rounded-md py-2 px-5"
          onChange={handleOnInputChange}
          name="status"
        >
          <option>Greater Than</option>
          <option>Less Than</option>
          <option>Equal To</option>
        </select>
        <input
          className=" rounded-md border outline-none py-2 px-2 w-24"
          name="status"
          type="number"
          onChange={handleOnInputChange}
        />
      </div>
    </div>
  );
};
