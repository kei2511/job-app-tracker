import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button, ButtonProps } from "@/components/ui/button"

const Pagination = ({ className, ...props }: React.ComponentProps<"nav">) => (
  <nav
    role="navigation"
    aria-label="pagination"
    className={cn("mx-auto flex w-full justify-center", className)}
    {...props}
  />
)
Pagination.displayName = "Pagination"

const PaginationContent = React.forwardRef<
  HTMLUListElement,
  React.ComponentProps<"ul">
>(({ className, ...props }, ref) => (
  <ul
    ref={ref}
    className={cn("flex flex-row items-center gap-1", className)}
    {...props}
  />
))
PaginationContent.displayName = "PaginationContent"

const PaginationItem = React.forwardRef<
  HTMLLIElement,
  React.ComponentProps<"li">
>(({ className, ...props }, ref) => (
  <li ref={ref} className={cn("", className)} {...props} />
))
PaginationItem.displayName = "PaginationItem"

type PaginationLinkProps = {
  isActive?: boolean
  asChild?: boolean
} & Pick<ButtonProps, "size"> &
  React.ComponentProps<"a">

const PaginationLink = ({
  className,
  isActive,
  size = "icon",
  asChild = false,
  ...props
}: PaginationLinkProps) => {
  const Component = asChild ? Slot : "a";

  return (
    <Component
      aria-current={isActive ? "page" : undefined}
      className={cn(
        "relative h-10 w-10 rounded-md p-0 text-sm font-medium",
        isActive ? "z-10 bg-primary text-primary-foreground" : "text-foreground hover:bg-accent",
        "justify-center",
        size === "default" && "h-10 w-10 rounded-md px-4 py-2",
        size === "sm" && "h-9 w-9 rounded-md px-2",
        size === "lg" && "h-12 w-12 rounded-md px-4",
        className
      )}
      {...props}
    />
  );
}
PaginationLink.displayName = "PaginationLink"

interface PaginationArrowProps {
  className?: string;
  size?: "default" | "sm" | "lg";
  onClick?: () => void;
  disabled?: boolean;
}

const PaginationPrevious = ({
  className,
  size = "default",
  onClick,
  disabled,
  ...props
}: PaginationArrowProps) => (
  <a
    aria-label="Go to previous page"
    onClick={disabled ? undefined : onClick}
    className={cn(
      "relative h-10 w-10 rounded-md p-0 text-sm font-medium flex items-center justify-center",
      "text-foreground hover:bg-accent",
      size === "default" && "h-10 w-10 rounded-md px-4 py-2",
      size === "sm" && "h-9 w-9 rounded-md px-2",
      size === "lg" && "h-12 w-12 rounded-md px-4",
      disabled ? "pointer-events-none opacity-50" : "cursor-pointer",
      "gap-1 pl-2.5",
      className
    )}
    {...props}
  >
    <ChevronLeft className="h-4 w-4" />
    <span>Previous</span>
  </a>
)
PaginationPrevious.displayName = "PaginationPrevious"

const PaginationNext = ({
  className,
  size = "default",
  onClick,
  disabled,
  ...props
}: PaginationArrowProps) => (
  <a
    aria-label="Go to next page"
    onClick={disabled ? undefined : onClick}
    className={cn(
      "relative h-10 w-10 rounded-md p-0 text-sm font-medium flex items-center justify-center",
      "text-foreground hover:bg-accent",
      size === "default" && "h-10 w-10 rounded-md px-4 py-2",
      size === "sm" && "h-9 w-9 rounded-md px-2",
      size === "lg" && "h-12 w-12 rounded-md px-4",
      disabled ? "pointer-events-none opacity-50" : "cursor-pointer",
      "gap-1 pr-2.5",
      className
    )}
    {...props}
  >
    <span>Next</span>
    <ChevronRight className="h-4 w-4" />
  </a>
)
PaginationNext.displayName = "PaginationNext"

const PaginationEllipsis = ({
  className,
  ...props
}: React.ComponentProps<"span">) => (
  <span
    aria-hidden
    className={cn("flex h-9 w-9 items-center justify-center", className)}
    {...props}
  >
    <MoreHorizontal className="h-4 w-4" />
    <span className="sr-only">More pages</span>
  </span>
)
PaginationEllipsis.displayName = "PaginationEllipsis"

export {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
}