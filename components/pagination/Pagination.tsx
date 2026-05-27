import { getPagination } from "lib/pagination.helper";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/solid";
import { isNil, noop } from "lodash";
import { useMemo, useCallback } from "react";
import React from "react";
import styled from "styled-components";

export type PaginationProps = {
  currentPage: number;
  limit: number;
  total: number;
  setPage: (page: number) => void;
};

const Container = styled.div.attrs({
  className: `
    my-2
    lg:mb-4
    2xl:mt-8
    flex
    justify-end
    z-0
    -space-x-px
    gap-1
`,
})``;

const StyledSpan = styled.span.attrs({
  className: `
    sr-only
`,
})``;

const StyledButtonEnabled = `
    cursor-pointer
`;

const StyledButtonDisabled = `
    cursor-default
    opacity-5
    pointer-events-none
`;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const StyledButton = styled.button.attrs<any>(({ $enabled }: any) => ({
  className: `
    relative
    inline-flex
    items-center
    px-2
    py-2
    border
    rounded-md
    bg-primary
    text-sm
    font-medium
    text-secondary-disable
    hover:text-secondary-hover   
    ${$enabled ? StyledButtonEnabled : StyledButtonDisabled}
`,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
}))<any>``;

const PageActive = `
    border
    bg-yellow
    border-yellow
    rounded-[4px]
    cursor-default
    pointer-events-none
`;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const PageContainer = styled.div.attrs<any>(({ $active }: any) => ({
  className: `
    z-10
    relative
    inline-flex
    items-center
    text-black
    px-4
    py-2
    h-full
    f-16
    font-medium
    cursor-pointer
    ${$active ? PageActive : ""}
`,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
}))<any>``;

const Pagination = React.memo(({
  currentPage,
  total,
  limit,
  setPage,
}: PaginationProps) => {
  const { prevPage, pages, nextPage } = useMemo(
    () => getPagination(currentPage, total, limit),
    [currentPage, total, limit]
  );

  const goToPrev = useCallback(() => {
    if (!isNil(prevPage)) setPage(prevPage);
  }, [prevPage, setPage]);

  const goToNext = useCallback(() => {
    if (!isNil(nextPage)) setPage(nextPage);
  }, [nextPage, setPage]);

  return (
    <Container>
      <StyledButton
        $enabled={isNil(prevPage) ? undefined : "true"}
        onClick={goToPrev}
      >
        <StyledSpan>Previous</StyledSpan>
        <ChevronLeftIcon className="h-5 w-5 text-white" aria-hidden="true" />
      </StyledButton>
      {pages.map((page) => {
        return (
          <PageContainer
            key={`page-item-${page}`}
            onClick={() => setPage(page)}
            $active={page === currentPage ? "true" : undefined}
          >
            {page}
          </PageContainer>
        );
      })}
      <StyledButton
        $enabled={isNil(nextPage) ? undefined : "true"}
        onClick={goToNext}
      >
        <StyledSpan>Next</StyledSpan>
        <ChevronRightIcon className="h-5 w-5 text-white" aria-hidden="true" />
      </StyledButton>
    </Container>
  );
});

export default Pagination;
