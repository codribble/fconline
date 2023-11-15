import styled from "styled-components";

export interface Pagination {
  setPage(page: number): void;
  total: number;
  limit: number;
  page: number;
}

const Wrapper = styled.div`
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
`;

export default function Pagination({
  setPage,
  total,
  limit,
  page,
}: Pagination) {
  const numPages = Math.ceil(total / limit);

  return (
    <Wrapper>
      <Button
        onClick={() => setPage(page - 1)}
        disabled={page === 1}
      >
        &lt;
      </Button>

      <Button
        onClick={() => setPage(1)}
        className={page === 1 ? "current" : ""}
      >
        1
      </Button>

      {page > 3 && <Separator>...</Separator>}

      {page === numPages && numPages > 3 && (
        <Button onClick={() => setPage(page - 2)}>{page - 2}</Button>
      )}

      {page > 2 && (
        <Button onClick={() => setPage(page - 1)}>{page - 1}</Button>
      )}

      {page !== 1 && page !== numPages && (
        <Button
          onClick={() => setPage(page)}
          className="current"
        >
          {page}
        </Button>
      )}

      {page < numPages - 1 && (
        <Button onClick={() => setPage(page + 1)}>{page + 1}</Button>
      )}

      {page === 1 && numPages > 3 && (
        <Button onClick={() => setPage(page + 2)}>{page + 2}</Button>
      )}

      {page < numPages - 2 && <Separator>...</Separator>}

      <Button
        onClick={() => setPage(numPages)}
        className={page === numPages ? "current" : ""}
      >
        {numPages}
      </Button>

      <Button
        onClick={() => setPage(page + 1)}
        disabled={page === numPages}
      >
        &gt;
      </Button>
    </Wrapper>
  );
}
