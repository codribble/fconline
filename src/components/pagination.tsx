// import styled from "styled-components";

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
    <div className="flex flex-wrap items-center justify-center gap-2 mt-8">
      {page > 1 && (
        <button
          className="flex items-center justify-center py-1 px-2 bg-cyan-900 border-0 rounded-md text-sm text-white cursor-pointer"
          onClick={() => setPage(page - 1)}
          disabled={page === 1}
        >
          &lt;
        </button>
      )}

      <button
        className={`flex items-center justify-center py-1 px-2 ${
          page === 1 ? "bg-cyan-600" : "bg-cyan-900"
        } border-0 rounded-md text-sm text-white cursor-pointer`}
        onClick={() => setPage(1)}
      >
        1
      </button>

      {page > 3 && <span className="my-0 mx-1">...</span>}

      {page === numPages && numPages > 3 && (
        <button
          className="flex items-center justify-center py-1 px-2 bg-cyan-900 border-0 rounded-md text-sm text-white cursor-pointer"
          onClick={() => setPage(page - 2)}
        >
          {page - 2}
        </button>
      )}

      {page > 2 && (
        <button
          className="flex items-center justify-center py-1 px-2 bg-cyan-900 border-0 rounded-md text-sm text-white cursor-pointer"
          onClick={() => setPage(page - 1)}
        >
          {page - 1}
        </button>
      )}

      {page !== 1 && page !== numPages && (
        <button
          className="flex items-center justify-center py-1 px-2 bg-cyan-600 border-0 rounded-md text-sm text-white cursor-pointer"
          onClick={() => setPage(page)}
        >
          {page}
        </button>
      )}

      {page < numPages - 1 && (
        <button
          className="flex items-center justify-center py-1 px-2 bg-cyan-900 border-0 rounded-md text-sm text-white cursor-pointer"
          onClick={() => setPage(page + 1)}
        >
          {page + 1}
        </button>
      )}

      {page === 1 && numPages > 3 && (
        <button
          className="flex items-center justify-center py-1 px-2 bg-cyan-900 border-0 rounded-md text-sm text-white cursor-pointer"
          onClick={() => setPage(page + 2)}
        >
          {page + 2}
        </button>
      )}

      {page < numPages - 2 && <span className="my-0 mx-1">...</span>}

      {numPages > 1 && (
        <button
          className={`flex items-center justify-center py-1 px-2 ${
            page === numPages ? "bg-cyan-600" : "bg-cyan-900"
          } border-0 rounded-md text-sm text-white cursor-pointer`}
          onClick={() => setPage(numPages)}
        >
          {numPages}
        </button>
      )}

      {page !== numPages && (
        <button
          className="flex items-center justify-center py-1 px-2 bg-cyan-900 border-0 rounded-md text-sm text-white cursor-pointer"
          onClick={() => setPage(page + 1)}
          disabled={page === numPages}
        >
          &gt;
        </button>
      )}
    </div>
  );
}
