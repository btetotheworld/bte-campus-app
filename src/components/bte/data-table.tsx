import type { ReactNode } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { EmptyState } from "@/components/bte/empty-state";

export type DataTableColumn<T> = {
  key: string;
  header: string;
  cell: (row: T) => ReactNode;
};

export function DataTable<T>({
  columns,
  rows,
  getRowKey,
  state = "populated",
  errorMessage,
  empty,
  caption,
}: {
  columns: DataTableColumn<T>[];
  rows: T[];
  getRowKey: (row: T) => string;
  state?: "loading" | "empty" | "error" | "populated";
  errorMessage?: string;
  empty?: ReactNode;
  caption: string;
}) {
  if (state === "error") {
    return (
      <Alert variant="destructive">
        <AlertTitle>The list could not be loaded</AlertTitle>
        <AlertDescription>
          {errorMessage ??
            "Something went wrong reading this list. Refresh the page. If it happens again, tell the foundation owner."}
        </AlertDescription>
      </Alert>
    );
  }

  if (state === "empty") {
    return empty ?? <EmptyState message="There is nothing in this list yet." />;
  }

  if (state === "loading") {
    return (
      <Table>
        <caption className="sr-only">{caption}</caption>
        <TableHeader>
          <TableRow>
            {columns.map((column) => (
              <TableHead key={column.key}>{column.header}</TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            {columns.map((column) => (
              <TableCell key={column.key}>
                <Skeleton className="h-4 w-24" />
              </TableCell>
            ))}
          </TableRow>
          <TableRow>
            {columns.map((column) => (
              <TableCell key={`second-${column.key}`}>
                <Skeleton className="h-4 w-20" />
              </TableCell>
            ))}
          </TableRow>
          <TableRow>
            {columns.map((column) => (
              <TableCell key={`third-${column.key}`}>
                <Skeleton className="h-4 w-16" />
              </TableCell>
            ))}
          </TableRow>
        </TableBody>
      </Table>
    );
  }

  return (
    <Table>
      <caption className="sr-only">{caption}</caption>
      <TableHeader>
        <TableRow>
          {columns.map((column) => (
            <TableHead key={column.key}>{column.header}</TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {rows.map((row) => (
          <TableRow key={getRowKey(row)}>
            {columns.map((column) => (
              <TableCell key={column.key}>{column.cell(row)}</TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
