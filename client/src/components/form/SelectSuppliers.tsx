import { Supplier } from "@@types/system";
import SelectTable, {
  SelectTableColumn,
} from "@components/ui/Table/SelectTable";

interface Props {
  suppliers: Supplier[];
  selectedSuppliers: Supplier[];
  setSelectedSuppliers: any;
}

const SelectSuppliers: React.FC<Props> = ({
  suppliers,
  selectedSuppliers,
  setSelectedSuppliers,
}) => {
  const supplierColumn: SelectTableColumn[] = [
    {
      header: "supplier Code",
      accessor: "supplier_code",
      id: true,
      colSpan: "col-span-2",
    },
    {
      header: "Supplier Name",
      accessor: "supplier_name",
      colSpan: "col-span-2",
    },
    { header: "Address 1", accessor: "address_1", colSpan: "col-span-2" },
    { header: "Country", accessor: "country", colSpan: "col-span-1" },
    { header: "Fax", accessor: "fax", colSpan: "col-span-1" },
    { header: "Closed Flag", accessor: "closed_flag", colSpan: "col-span-2" },
  ];

  const supplierColumn2: SelectTableColumn[] = [
    {
      header: "supplier Code",
      accessor: "supplier_code",
      id: true,
      colSpan: "col-span-2",
    },
    {
      header: "Supplier Name",
      accessor: "supplier_name",
      colSpan: "col-span-2",
    },
    { header: "Address 1", accessor: "address_1", colSpan: "col-span-2" },
    { header: "Country", accessor: "country", colSpan: "col-span-1" },
    { header: "Fax", accessor: "fax", colSpan: "col-span-1" },
    { header: "Closed Flag", accessor: "closed_flag", colSpan: "col-span-2" },
    { header: "Action", accessor: "supplier_code", colSpan: "col-span-2" },
  ];

  const handleSelect = (code: string) => {
    if (selectedSuppliers?.length > 0) {
      const item = suppliers.filter((res) => res.supplier_code === code)[0];
      setSelectedSuppliers([...selectedSuppliers, item]);
    } else {
      let newArray = [];

      const item = suppliers.filter((res) => res.supplier_code === code)[0];
      newArray.push(item);
      setSelectedSuppliers(newArray);
    }
  };

  const isSelectedItem = (item: any, accessor: string): boolean => {
    const findItem = selectedSuppliers.filter(
      (res) => res.supplier_code === item[accessor]
    )[0];

    if (findItem) return true;
    else return false;
  };

  function removeSelectedSupplier(code: string) {
    const updatedList = selectedSuppliers?.filter(
      (res) => res.supplier_code !== code
    );
    setSelectedSuppliers(updatedList);
  }

  return (
    <div className="mt-10">
      {selectedSuppliers.length > 0 && (
        <div className="border rounded-md p-5">
          <p className="font-medium">Selected Suppliers</p>
          <SelectTable
            handleRemove={removeSelectedSupplier}
            isSelectedItem={isSelectedItem}
            selectedItems={selectedSuppliers}
            columns={supplierColumn2}
            data={selectedSuppliers}
            from="selected"
          />
        </div>
      )}
      <div className="border rounded-md p-5 mt-5">
        <p className="font-medium">All Suppliers</p>
        <SelectTable
          isSelectedItem={isSelectedItem}
          selectedItems={selectedSuppliers}
          handleSelect={handleSelect}
          columns={supplierColumn}
          data={suppliers}
          from="main"
        />
      </div>
    </div>
  );
};

export default SelectSuppliers;
