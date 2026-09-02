import { Input } from "@/components/ui/input"
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"

import { Meta } from "@/types/product"

type Props = {
  meta: Meta
  onPageChange: (page: number) => void
}

function getPaginationPages(
  currentPage: number,
  lastPage: number
): (number | "...")[] {
  if (lastPage <= 7) {
    return Array.from({ length: lastPage }, (_, i) => i + 1)
  }

  if (currentPage <= 4) {
    return [1, 2, 3, 4, 5, "...", lastPage]
  }

  if (currentPage >= lastPage - 3) {
    return [1, "...", lastPage - 4, lastPage - 3, lastPage - 2, lastPage - 1, lastPage]
  }

  return [
    1,
    "...",
    currentPage - 1,
    currentPage,
    currentPage + 1,
    "...",
    lastPage,
  ]
}

export function ProductPagination({ meta, onPageChange }: Props) {
  const pages = getPaginationPages(
    meta.current_page,
    meta.last_page
  )

  return (
    <div className="flex items-center gap-2">
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
                {page === "..."
                  ? <PaginationEllipsis />
                  : <PaginationLink
                      isActive={isActive}
                      onClick={() => onPageChange(page)}
                    >
                      {page}
                    </PaginationLink>
                  }
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
      <div className="flex items-center gap-2">
        <span className="text-sm text-muted-foreground whitespace-nowrap">
          Go to
        </span>

        <Input
          type="number"
          min={1}
          max={meta.last_page}
          className="w-16"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              const page = Number(e.currentTarget.value)

              if (page >= 1 && page <= meta.last_page) {
                onPageChange(page)
                e.currentTarget.value = ""
              }
            }
          }}
        />
      </div>
    </div>
  )
}
