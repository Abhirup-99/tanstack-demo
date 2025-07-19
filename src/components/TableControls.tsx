import type { Table, Column } from "@tanstack/react-table";
import type { Employee } from "../types/Employee";

// Table Controls Component
export function TableControls({
  data,
  columns,
  globalFilter,
  onGlobalFilterChange,
  table,
  onOpenColumnModal,
  organizedColumns,
}: {
  data: Employee[];
  columns: { id: string; header: string }[];
  globalFilter: string;
  onGlobalFilterChange: (value: string) => void;
  table: Table<Employee>;
  onOpenColumnModal: () => void;
  organizedColumns: {
    left: Column<Employee, unknown>[];
    center: Column<Employee, unknown>[];
    right: Column<Employee, unknown>[];
    all: Column<Employee, unknown>[];
  };
}) {
  const { rows } = table.getRowModel();

  return (
    <div className="controls">
      <h1>
        Virtualized Table - {data.length.toLocaleString()} Rows ×{" "}
        {columns.length} Columns
      </h1>

      <div className="search-controls">
        <input
          type="text"
          placeholder="Search all columns..."
          value={globalFilter}
          onChange={(e) => onGlobalFilterChange(e.target.value)}
          className="search-input"
        />

        <select
          value=""
          onChange={(e) => {
            if (e.target.value) {
              const column = table.getColumn(e.target.value);
              if (column) {
                column.toggleVisibility();
              }
            }
          }}
          className="column-toggle"
        >
          <option value="">Toggle Columns...</option>
          {columns.map((col) => (
            <option key={col.id} value={col.id}>
              {col.header as string} (
              {table.getColumn(col.id!)?.getIsVisible() ? "Hide" : "Show"})
            </option>
          ))}
        </select>

        <button
          onClick={onOpenColumnModal}
          className="button-primary"
        >
          📋 Reorder Columns
        </button>
      </div>

      <div className="table-stats">
        <span>
          Showing {rows.length.toLocaleString()} of{" "}
          {data.length.toLocaleString()} rows
        </span>
        <span>•</span>
        <span>
          {organizedColumns.all.length} of {columns.length} columns visible
        </span>
        <span>•</span>
        <span>
          Pinned: {organizedColumns.left.length} left,{" "}
          {organizedColumns.right.length} right
        </span>
        <span>•</span>
        <span style={{ color: "#666", fontSize: "0.9em" }}>
          💡 Hover column edges to resize
        </span>
      </div>
    </div>
  );
}
