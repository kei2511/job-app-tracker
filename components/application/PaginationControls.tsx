'use client';

import React from 'react';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';

interface PaginationControlsProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const PaginationControls: React.FC<PaginationControlsProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  // Generate page numbers to show
  const getPageNumbers = () => {
    const pages = [];
    const delta = 2; // How many pages to show around current page
    
    // Always show first page
    if (totalPages <= 7) {
      // If total pages is small, show all
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Show first page, current page with delta, and last page
      const range = [];
      const rangeWithDots = [];
      
      for (let i = Math.max(1, currentPage - delta); i <= Math.min(totalPages, currentPage + delta); i++) {
        range.push(i);
      }
      
      // Add first page if not in range
      if (range[0] > 1) {
        rangeWithDots.push(1);
        if (range[0] > 2) {
          rangeWithDots.push('...');
        }
      }
      
      range.forEach(page => rangeWithDots.push(page));
      
      // Add last page if not in range
      if (rangeWithDots[rangeWithDots.length - 1] !== totalPages) {
        if (rangeWithDots[rangeWithDots.length - 1] !== totalPages - 1) {
          rangeWithDots.push('...');
        }
        rangeWithDots.push(totalPages);
      }
      
      for (const page of rangeWithDots) {
        pages.push(page);
      }
    }
    
    return pages;
  };

  const handlePageChange = (page: number | string) => {
    if (typeof page === 'number' && page !== currentPage) {
      onPageChange(page);
    }
  };

  const pages = getPageNumbers();

  if (totalPages <= 1) return null;

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            onClick={() => currentPage > 1 && onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
          />
        </PaginationItem>
        
        {pages.map((page, index) => (
          <PaginationItem key={index}>
            {page === '...' ? (
              <PaginationEllipsis />
            ) : (
              <PaginationLink
                isActive={currentPage === page}
                onClick={() => handlePageChange(page)}
              >
                {page}
              </PaginationLink>
            )}
          </PaginationItem>
        ))}
        
        <PaginationItem>
          <PaginationNext
            onClick={() => currentPage < totalPages && onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
};

export default PaginationControls;