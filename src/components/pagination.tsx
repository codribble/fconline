// import styled from "styled-components";

import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronDoubleLeftIcon,
  ChevronDoubleRightIcon,
} from "@heroicons/react/20/solid";

export interface Pagination {
  setPage(page: number): void;
  total: number;
  limit: number;
  page: number;
}

/* const Wrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  gap: 5px;
  margin-top: 30px;
`;

const Button = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2px 5px;
  background-color: #eee;
  border: 0;
  border-radius: 5px;
  font-size: 14px;
  color: black;
  cursor: pointer;

  &[disabled] {
    background-color: #666;
    cursor: default;
  }

  &.current {
    background-color: yellow;
    color: black;
  }
`;

const Separator = styled.div`
  margin: 0px 4px;
`; */

export default function Pagination({
  setPage,
  total,
  limit,
  page,
}: Pagination) {
  const numPages = Math.ceil(total / limit);

  return (
    <nav
      className="isolate flex flex-wrap items-center justify-center mt-8 -space-x-px rounded-md shadow-sm"
      aria-label="Pagination"
    >
      <button
        className="relative inline-flex items-center rounded-l-md px-2 py-2 bg-white text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-70"
        onClick={() => setPage(page - 3)}
        disabled={page === 1}
      >
        <span className="sr-only">이전 페이지 그룹</span>
        <ChevronDoubleLeftIcon
          className="h-5 w-5"
          aria-hidden="true"
        />
      </button>

      <button
        className="relative inline-flex items-center px-2 py-2 bg-white text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-70"
        onClick={() => setPage(page - 1)}
        disabled={page === 1}
        title="이전"
      >
        <span className="sr-only">이전</span>
        <ChevronLeftIcon
          className="h-5 w-5"
          aria-hidden="true"
        />
      </button>

      <button
        className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold cursor-pointer ${
          page === 1
            ? "z-10 bg-indigo-600 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            : "bg-white text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:outline-offset-0"
        }`}
        onClick={() => setPage(1)}
        title="1 페이지"
      >
        1
      </button>

      {page > 3 && (
        <span className="relative inline-flex items-center px-4 py-2 bg-white text-sm font-semibold text-gray-700 ring-1 ring-inset ring-gray-300 focus:outline-offset-0">
          ...
        </span>
      )}

      {page === numPages && numPages > 3 && (
        <button
          className="relative inline-flex items-center px-4 py-2 bg-white text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
          onClick={() => setPage(page - 2)}
          title={`${page - 2} 페이지`}
        >
          {page - 2}
        </button>
      )}

      {page > 2 && (
        <button
          className="relative inline-flex items-center px-4 py-2 bg-white text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
          onClick={() => setPage(page - 1)}
          title={`${page - 1} 페이지`}
        >
          {page - 1}
        </button>
      )}

      {page !== 1 && page !== numPages && (
        <button
          className="relative z-10 inline-flex items-center bg-indigo-600 px-4 py-2 text-sm font-semibold text-white focus:z-20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          aria-current="page"
          onClick={() => setPage(page)}
          title={`${page} 페이지`}
        >
          {page}
        </button>
      )}

      {page < numPages - 1 && (
        <button
          className="relative inline-flex items-center px-4 py-2 bg-white text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
          onClick={() => setPage(page + 1)}
          title={`${page + 1} 페이지`}
        >
          {page + 1}
        </button>
      )}

      {page === 1 && numPages > 3 && (
        <button
          className="relative inline-flex items-center px-4 py-2 bg-white text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
          onClick={() => setPage(page + 2)}
          title={`${page + 2} 페이지`}
        >
          {page + 2}
        </button>
      )}

      {page < numPages - 2 && (
        <span className="relative inline-flex items-center px-4 py-2 bg-white text-sm font-semibold text-gray-700 ring-1 ring-inset ring-gray-300 focus:outline-offset-0">
          ...
        </span>
      )}

      {numPages > 1 && (
        <button
          className={`relative inline-flex items-center px-4 py-2 bg-white text-sm font-semibold cursor-pointer ${
            page === numPages
              ? "z-10 bg-indigo-600 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              : "text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:outline-offset-0"
          }`}
          onClick={() => setPage(numPages)}
          title={`${numPages} 페이지`}
        >
          {numPages}
        </button>
      )}

      <button
        className="relative inline-flex items-center px-2 py-2 bg-white text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-70"
        onClick={() => setPage(page + 1)}
        disabled={page === numPages}
        title="다음"
      >
        <span className="sr-only">다음</span>
        <ChevronRightIcon
          className="h-5 w-5"
          aria-hidden="true"
        />
      </button>

      <button
        className="relative inline-flex items-center rounded-r-md px-2 py-2 bg-white text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-70"
        onClick={() => setPage(page + 3)}
        disabled={page === numPages}
        title="다음 페이지 그룹"
      >
        <span className="sr-only">다음 페이지 그룹</span>
        <ChevronDoubleRightIcon
          className="h-5 w-5"
          aria-hidden="true"
        />
      </button>
    </nav>
  );
}
