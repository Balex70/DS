import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"

import { Meta } from "@/types/product"

interface Props {
  meta: Meta
  onPageChange: (page: number) => void
}

export function ProductVariantPagination({ meta, onPageChange }: Props) {
  const pages = Array.from(
    { length: meta.last_page },
    (_, i) => i + 1
  )

  return (
    <Pagination>
      <PaginationContent>

        <PaginationItem>
          <PaginationPrevious
            onClick={() => onPageChange(meta.current_page - 1)}
            aria-disabled={meta.current_page === 1}
          />
        </PaginationItem>

        {pages.map((page) => {
          const isActive = page === meta.current_page

          return (
            <PaginationItem key={page}>
              <PaginationLink
                isActive={isActive}
                onClick={() => onPageChange(page)}
              >
                {page}
              </PaginationLink>
            </PaginationItem>
          )
        })}

        <PaginationItem>
          <PaginationNext
            onClick={() => onPageChange(meta.current_page + 1)}
            aria-disabled={meta.current_page === meta.last_page}
          />
        </PaginationItem>

      </PaginationContent>
    </Pagination>
  )
}
