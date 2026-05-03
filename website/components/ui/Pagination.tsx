interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function getVisiblePages(
  currentPage: number,
  totalPages: number,
): (number | string)[] {
  const pages: (number | string)[] = [];

  if (totalPages <= 7) {
    for (let i = 1; i <= totalPages; i++) {
      pages.push(i);
    }
    return pages;
  }

  // Always include first page
  pages.push(1);

  const leftBound = Math.max(2, currentPage - 3);
  const rightBound = Math.min(totalPages - 1, currentPage + 3);

  // Left ellipsis
  if (leftBound > 2) {
    pages.push("...");
  } else if (leftBound === 2) {
    pages.push(2);
  }

  // Middle pages
  for (let i = leftBound; i <= rightBound; i++) {
    if (i > 2 && i < totalPages - 1) {
      pages.push(i);
    }
  }

  // Right ellipsis
  if (rightBound < totalPages - 2) {
    pages.push("...");
  } else if (rightBound === totalPages - 2) {
    pages.push(totalPages - 1);
  }

  // Always include last page
  if (totalPages > 1) {
    pages.push(totalPages);
  }

  return pages;
}

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  const visiblePages = getVisiblePages(currentPage, totalPages);

  return (
    <div className="mt-12 flex justify-center gap-2 flex-wrap">
      <button
        type="button"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage <= 1}
        className="border-2 border-stone-900 bg-surface w-10 h-10 flex items-center justify-center glossy-finish text-primary-container hover:bg-surface-container-high disabled:opacity-40 disabled:cursor-not-allowed"
      >
        <span className="material-symbols-outlined">chevron_left</span>
      </button>

      {(() => {
        let ellipsisCount = 0;
        return visiblePages.map((page) => {
          if (page === "...") {
            ellipsisCount++;
            return (
              <span
                key={`ellipsis-${ellipsisCount}`}
                className="w-10 h-10 flex items-center justify-center font-body text-on-surface-variant"
              >
                ...
              </span>
            );
          }

          const pageNum = page as number;
          return (
            <button
              key={pageNum}
              type="button"
              onClick={() => onPageChange(pageNum)}
              className={`border-2 border-stone-900 w-10 h-10 flex items-center justify-center glossy-finish font-label text-xs font-medium uppercase ${
                pageNum === currentPage
                  ? "bg-primary-container text-on-primary"
                  : "bg-surface text-on-surface hover:bg-surface-container-high"
              }`}
            >
              {pageNum}
            </button>
          );
        });
      })()}

      <button
        type="button"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage >= totalPages}
        className="border-2 border-stone-900 bg-surface w-10 h-10 flex items-center justify-center glossy-finish text-primary-container hover:bg-surface-container-high disabled:opacity-40 disabled:cursor-not-allowed"
      >
        <span className="material-symbols-outlined">chevron_right</span>
      </button>
    </div>
  );
}
