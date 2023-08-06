import { FC, useEffect, useState } from "react";
import ReactPaginate from "react-paginate";
import { BsChevronLeft, BsChevronRight } from "react-icons/bs";

interface Props {
  setPageNo: any;
  totalItem: any;
}

const Pagination: FC<Props> = ({ setPageNo, totalItem }) => {
  const [pageCount, setPageCount] = useState(0);

  const itemCountPerPage = 10;

  useEffect(() => {
    const pageCount = totalItem / itemCountPerPage;
    setPageCount(Math.ceil(pageCount));
  }, [totalItem]);

  function handlePageClick(event: any) {
    const newOffset = (event.selected * itemCountPerPage) % totalItem;
    setPageNo(newOffset / itemCountPerPage + 1);
  }

  return (
    <ReactPaginate
      previousLabel={
        <div className="flex items-center  hover:underline  gap-x-1 hover:underline-offset-5  active:underline">
          <BsChevronLeft className="text-[10px] md:text-[12px]" />
          <p className="text-[13px] md:text-[15px]">Previous</p>
        </div>
      }
      nextLabel={
        <div className="flex items-center hover:underline  gap-x-1 active:underline">
          <p className="text-[13x] md:text-[15px]">Next</p>
          <BsChevronRight className="text-[10px]" />
        </div>
      }
      breakLabel="..."
      initialPage={0}
      onPageChange={handlePageClick}
      pageRangeDisplayed={3}
      pageCount={pageCount}
      renderOnZeroPageCount={null}
      containerClassName="paginationContainer"
      pageClassName="page-item"
      activeClassName="selected-page"
      previousClassName="toggle-item"
      nextClassName="toggle-item"
    />
  );
};

export default Pagination;
