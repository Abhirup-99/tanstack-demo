import { useState, useMemo, useRef, useCallback, useEffect } from "react";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
  type SortingState,
  type ColumnFiltersState,
  type VisibilityState,
  type ColumnOrderState,
  type ColumnSizingState,
} from "@tanstack/react-table";
import { useVirtualizer } from "@tanstack/react-virtual";

// Types and utilities
import type { Employee, ColumnPinning } from "./types/Employee";
import { generateLargeDataset } from "./utils/dataGenerator";
import { useTableColumns } from "./hooks/useTableColumns";
import {
  useOrganizedColumns,
  useColumnPinning,
} from "./hooks/useColumnOrganization";

// Components
import { HeaderCell } from "./components/HeaderCell";
import { ColumnReorderModal } from "./components/ColumnReorderModal";
import { TableControls } from "./components/TableControls";
import "./tanstack-table.d.ts";
import "./semantic-table.css";

export default function VirtualizedTable() {
  // Generate 10,000 rows for demonstration
  const [data, setData] = useState<Employee[]>(() => generateLargeDataset(10000));
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [columnOrder, setColumnOrder] = useState<ColumnOrderState>([]);
  const [columnPinning, setColumnPinning] = useState<ColumnPinning>({
    left: [],
    right: [],
  });
  const [columnSizing, setColumnSizing] = useState<ColumnSizingState>({});
  const [isColumnModalOpen, setIsColumnModalOpen] = useState(false);

  // Get columns from hook
  const columns = useTableColumns();

  // Handle column reordering (now used by modal)
  const handleColumnOrderChange = useCallback((newOrder: string[]) => {
    setColumnOrder(newOrder);
  }, []);

  // Column pinning handlers
  const { handlePinColumn, handleUnpinColumn } =
    useColumnPinning(setColumnPinning);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    enableColumnResizing: true,
    columnResizeMode: "onChange",
    columnResizeDirection: "ltr",
    state: {
      sorting,
      columnFilters,
      globalFilter,
      columnVisibility,
      columnOrder,
      columnPinning,
      columnSizing,
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    onColumnVisibilityChange: setColumnVisibility,
    onColumnOrderChange: setColumnOrder,
    onColumnPinningChange: setColumnPinning,
    onColumnSizingChange: setColumnSizing,
    defaultColumn: {
      minSize: 40,
      maxSize: 400,
      size: 150,
    },
    meta: {
      updateData: (rowIndex, columnId, value) => {
        setData((old) =>
          old.map((row, index) => {
            if (index === rowIndex) {
              return {
                ...old[rowIndex]!,
                [columnId]: value,
              };
            }
            return row;
          })
        );
      },
    },
  });

  // Initialize column order if empty
  useMemo(() => {
    if (columnOrder.length === 0) {
      setColumnOrder(columns.map((col) => col.id!));
    }
  }, [columns, columnOrder.length, setColumnOrder]);

  // Get organized columns (pinned left, center, pinned right)
  const organizedColumns = useOrganizedColumns(
    table.getVisibleLeafColumns(),
    columnPinning,
    columnOrder
  );

  // Get the table rows
  const { rows } = table.getRowModel();

  // Refs for virtualizers
  const tableContainerRef = useRef<HTMLDivElement>(null);

  // Row virtualizer
  const rowVirtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: () => tableContainerRef.current,
    estimateSize: () => 35,
    overscan: 10,
  });

  // Column virtualizer for center columns only
  const columnVirtualizer = useVirtualizer({
    horizontal: true,
    count: organizedColumns.center.length,
    getScrollElement: () => tableContainerRef.current,
    estimateSize: useCallback(
      (index: number) => {
        const column = organizedColumns.center[index];
        const size = column?.getSize() || 150;
        return size;
      },
      [organizedColumns.center]
    ),
    overscan: 5,
  });

  // Get virtual items
  const virtualRows = rowVirtualizer.getVirtualItems();
  const virtualColumns = columnVirtualizer.getVirtualItems();

  // Force column virtualizer to remeasure when column sizing changes
  useEffect(() => {
    columnVirtualizer.measure();
  }, [columnSizing, columnVirtualizer]);

  // Calculate widths for pinned columns
  const leftPinnedWidth = organizedColumns.left.reduce(
    (sum, col) => sum + (col.getSize() || 150),
    0
  );
  const rightPinnedWidth = organizedColumns.right.reduce(
    (sum, col) => sum + (col.getSize() || 150),
    0
  );

  // Get total size
  const totalSize = rowVirtualizer.getTotalSize();
  const totalWidth =
    columnVirtualizer.getTotalSize() + leftPinnedWidth + rightPinnedWidth;

  return (
    <div className="virtualized-table-container">
      <TableControls
        data={data}
        columns={columns.map((col) => ({
          id: col.id!,
          header: col.header as string,
        }))}
        globalFilter={globalFilter}
        onGlobalFilterChange={setGlobalFilter}
        table={table}
        onOpenColumnModal={() => setIsColumnModalOpen(true)}
        organizedColumns={organizedColumns}
      />

      {/* Column Reorder Modal */}
      <ColumnReorderModal
        isOpen={isColumnModalOpen}
        onClose={() => setIsColumnModalOpen(false)}
        columns={columns.map((col) => ({
          id: col.id!,
          header: col.header as string,
        }))}
        columnOrder={columnOrder}
        onColumnOrderChange={handleColumnOrderChange}
        columnPinning={columnPinning}
        onPin={handlePinColumn}
        onUnpin={handleUnpinColumn}
      />

      <div
        ref={tableContainerRef}
        className="table-container"
        style={{
          height: "600px",
          width: "100%",
          overflow: "auto",
        }}
      >
        <table
          style={{
            height: `${totalSize}px`,
            width: `${totalWidth}px`,
            position: "relative",
            display: "block", // Override default table display
            borderCollapse: "separate",
            borderSpacing: 0,
          }}
        >
          {/* Header */}
          <thead
            className="header"
            style={{
              position: "sticky",
              top: 0,
              zIndex: 10,
              background: "#f8f9fa",
              borderBottom: "2px solid #dee2e6",
              height: "40px",
              width: `${totalWidth}px`,
              minWidth: "100%",
              display: "block", // Override default thead display
            }}
          >
            <tr
              style={{
                display: "flex", // Override default tr display
                height: "40px",
                width: `${totalWidth}px`,
                position: "relative",
              }}
            >
            {/* Left Pinned Headers */}
            {organizedColumns.left.map((column, index) => {
              const header = table
                .getHeaderGroups()[0]
                ?.headers.find((h) => h.column.id === column.id);
              const leftOffset = organizedColumns.left
                .slice(0, index)
                .reduce((sum, col) => sum + (col.getSize() || 150), 0);

              return (
                <HeaderCell
                  key={column.id}
                  header={header!}
                  column={column}
                  style={{
                    position: "absolute",
                    top: 0,
                    left: `${leftOffset}px`,
                    width: `${column.getSize()}px`,
                    height: "40px",
                    borderRight: "1px solid #dee2e6",
                    padding: "8px",
                    fontSize: "14px",
                    fontWeight: "bold",
                    display: "flex",
                    alignItems: "center",
                    background: "#f8f9fa",
                    zIndex: 12,
                    borderLeft:
                      leftPinnedWidth > 0 && index === organizedColumns.left.length - 1
                        ? "2px solid #adb5bd"
                        : "none",
                  }}
                  isPinned="left"
                  onPin={handlePinColumn}
                  onUnpin={handleUnpinColumn}
                />
              );
            })}

            {/* Center Scrollable Headers */}
            {virtualColumns.map((virtualColumn) => {
              const column = organizedColumns.center[virtualColumn.index];
              const header = table
                .getHeaderGroups()[0]
                ?.headers.find((h) => h.column.id === column?.id);

              if (!column) return null;

              return (
                <HeaderCell
                  key={column.id}
                  header={header!}
                  column={column}
                  style={{
                    position: "absolute",
                    top: 0,
                    left: `${leftPinnedWidth + virtualColumn.start}px`,
                    width: `${virtualColumn.size}px`,
                    height: "40px",
                    borderRight: "1px solid #dee2e6",
                    padding: "8px",
                    fontSize: "14px",
                    fontWeight: "bold",
                    display: "flex",
                    alignItems: "center",
                    background: "#f8f9fa",
                  }}
                  isPinned={false}
                  onPin={handlePinColumn}
                  onUnpin={handleUnpinColumn}
                />
              );
            })}

            {/* Right Pinned Headers */}
            {organizedColumns.right.map((column, index) => {
              const header = table
                .getHeaderGroups()[0]
                ?.headers.find((h) => h.column.id === column.id);
              const rightOffset = organizedColumns.right
                .slice(index + 1)
                .reduce((sum, col) => sum + (col.getSize() || 150), 0);

              return (
                <HeaderCell
                  key={column.id}
                  header={header!}
                  column={column}
                  style={{
                    position: "absolute",
                    top: 0,
                    right: `${rightOffset}px`,
                    width: `${column.getSize()}px`,
                    height: "40px",
                    borderLeft: "1px solid #dee2e6",
                    padding: "8px",
                    fontSize: "14px",
                    fontWeight: "bold",
                    display: "flex",
                    alignItems: "center",
                    background: "#f8f9fa",
                    zIndex: 12,
                    borderRight:
                      rightPinnedWidth > 0 && index === 0
                        ? "2px solid #adb5bd"
                        : "none",
                  }}
                  isPinned="right"
                  onPin={handlePinColumn}
                  onUnpin={handleUnpinColumn}
                />
              );
            })}
            </tr>
          </thead>

          {/* Body */}
          <tbody style={{ display: "block" }}>{/* Override default tbody display */}
            {virtualRows.map((virtualRow) => {
              const row = rows[virtualRow.index];

              return (
              <tr
                key={row.id}
                className="row"
                style={{
                  position: "absolute",
                  top: `${virtualRow.start + 40}px`, // +40 for header height
                  left: 0,
                  width: "100%",
                  height: `${virtualRow.size}px`,
                  borderBottom: "1px solid #eee",
                  display: "flex", // Override default tr display
                }}
              >
                {/* Left Pinned Cells */}
                {organizedColumns.left.map((column, index) => {
                  const cell = row
                    .getVisibleCells()
                    .find((c) => c.column.id === column.id);
                  const leftOffset = organizedColumns.left
                    .slice(0, index)
                    .reduce((sum, col) => sum + (col.getSize() || 150), 0);

                  if (!cell) return null;

                  return (
                    <td
                      key={cell.id}
                      className="cell"
                      style={{
                        position: "absolute",
                        top: 0,
                        left: `${leftOffset}px`,
                        width: `${column.getSize()}px`,
                        height: "100%",
                        borderRight: "1px solid #eee",
                        padding: "6px 8px",
                        fontSize: "13px",
                        display: "flex", // Override default td display
                        alignItems: "center",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                        background: "#fff",
                        zIndex: 9,
                        borderLeft:
                          leftPinnedWidth > 0 && index === organizedColumns.left.length - 1
                            ? "2px solid #adb5bd"
                            : "none",
                      }}
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </td>
                  );
                })}

                {/* Center Scrollable Cells */}
                {virtualColumns.map((virtualColumn) => {
                  const column = organizedColumns.center[virtualColumn.index];
                  const cell = row
                    .getVisibleCells()
                    .find((c) => c.column.id === column?.id);

                  if (!cell || !column) return null;

                  return (
                    <td
                      key={cell.id}
                      className="cell"
                      style={{
                        position: "absolute",
                        top: 0,
                        left: `${leftPinnedWidth + virtualColumn.start}px`,
                        width: `${virtualColumn.size}px`,
                        height: "100%",
                        borderRight: "1px solid #eee",
                        padding: "6px 8px",
                        fontSize: "13px",
                        display: "flex", // Override default td display
                        alignItems: "center",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </td>
                  );
                })}

                {/* Right Pinned Cells */}
                {organizedColumns.right.map((column, index) => {
                  const cell = row
                    .getVisibleCells()
                    .find((c) => c.column.id === column.id);
                  const rightOffset = organizedColumns.right
                    .slice(index + 1)
                    .reduce((sum, col) => sum + (col.getSize() || 150), 0);

                  if (!cell) return null;

                  return (
                    <td
                      key={cell.id}
                      className="cell"
                      style={{
                        position: "absolute",
                        top: 0,
                        right: `${rightOffset}px`,
                        width: `${column.getSize()}px`,
                        height: "100%",
                        borderLeft: "1px solid #eee",
                        padding: "6px 8px",
                        fontSize: "13px",
                        display: "flex", // Override default td display
                        alignItems: "center",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                        background: "#fff",
                        zIndex: 9,
                        borderRight:
                          rightPinnedWidth > 0 && index === 0
                            ? "2px solid #adb5bd"
                            : "none",
                      }}
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </td>
                  );
                })}
              </tr>
            );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
