import { useState } from "react";
import { flexRender, type Header, type Column } from "@tanstack/react-table";
import type { Employee } from "../types/Employee";

// Header Cell Component with resizing support
export function HeaderCell({
  header,
  column,
  style,
  isPinned,
  onPin,
  onUnpin,
}: {
  header: Header<Employee, unknown>;
  column: Column<Employee, unknown>;
  style: React.CSSProperties;
  isPinned: "left" | "right" | false;
  onPin: (columnId: string, side: "left" | "right") => void;
  onUnpin: (columnId: string) => void;
}) {
  const [isResizing, setIsResizing] = useState(false);

  return (
    <div
      className="header-cell"
      style={{
        ...style,
        background: isPinned ? "#e3f2fd" : "#f8f9fa",
        borderLeft:
          isPinned === "left"
            ? "3px solid #2196f3"
            : isPinned === "right"
            ? "3px solid #ff9800"
            : "none",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          width: "100%",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            cursor: column.getCanSort() ? "pointer" : "default",
            flex: 1,
            minWidth: 0, // Allow content to shrink
          }}
          onClick={header?.column.getToggleSortingHandler()}
        >
          <span
            style={{
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {flexRender(column.columnDef.header, header?.getContext())}
          </span>
          {column.getCanSort() && (
            <span style={{ marginLeft: "4px", flexShrink: 0 }}>
              {column.getIsSorted() === "asc"
                ? " ↑"
                : column.getIsSorted() === "desc"
                ? " ↓"
                : " ⇅"}
            </span>
          )}
        </div>

        <div style={{ display: "flex", gap: "2px", flexShrink: 0 }}>
          {/* Pin buttons */}
          <button
            onClick={() =>
              isPinned ? onUnpin(column.id) : onPin(column.id, "left")
            }
            style={{
              background: isPinned === "left" ? "#2196f3" : "transparent",
              color: isPinned === "left" ? "white" : "#666",
              border: "1px solid #ccc",
              borderRadius: "2px",
              padding: "1px 4px",
              fontSize: "10px",
              cursor: "pointer",
            }}
            title={isPinned === "left" ? "Unpin" : "Pin Left"}
          >
            📌L
          </button>
          <button
            onClick={() =>
              isPinned ? onUnpin(column.id) : onPin(column.id, "right")
            }
            style={{
              background: isPinned === "right" ? "#ff9800" : "transparent",
              color: isPinned === "right" ? "white" : "#666",
              border: "1px solid #ccc",
              borderRadius: "2px",
              padding: "1px 4px",
              fontSize: "10px",
              cursor: "pointer",
            }}
            title={isPinned === "right" ? "Unpin" : "Pin Right"}
          >
            📌R
          </button>
        </div>
      </div>

      {/* Column resizer */}
      {column.getCanResize() && (
        <div
          className={`column-resizer ${
            column.getIsResizing() ? "resizing" : ""
          }`}
          onMouseDown={header.getResizeHandler()}
          onTouchStart={header.getResizeHandler()}
          onMouseEnter={() => setIsResizing(true)}
          onMouseLeave={() => setIsResizing(false)}
          style={{
            position: "absolute",
            right: 0,
            top: 0,
            height: "100%",
            width: "5px",
            background:
              isResizing || column.getIsResizing() ? "#2196f3" : "transparent",
            cursor: "col-resize",
            userSelect: "none",
            touchAction: "none",
            zIndex: 1,
          }}
          title="Drag to resize"
        >
          <div
            style={{
              position: "absolute",
              right: "2px",
              top: "50%",
              transform: "translateY(-50%)",
              width: "1px",
              height: "60%",
              background:
                isResizing || column.getIsResizing() ? "#fff" : "#ccc",
            }}
          />
        </div>
      )}
    </div>
  );
}
