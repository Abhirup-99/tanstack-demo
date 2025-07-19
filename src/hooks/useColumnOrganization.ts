import { useMemo, useCallback } from "react";
import type { Column } from "@tanstack/react-table";
import type { Employee, ColumnPinning } from "../types/Employee";

// Hook to organize columns into left pinned, center, and right pinned
export const useOrganizedColumns = (
  visibleColumns: Column<Employee, unknown>[],
  columnPinning: ColumnPinning,
  columnOrder: string[]
) => {
  return useMemo(() => {
    // Create a map for quick lookup of column objects by ID
    const columnMap = new Map(visibleColumns.map(col => [col.id, col]));
    
    // Get columns in the correct order based on columnOrder state
    const orderedVisibleColumns = columnOrder
      .map(id => columnMap.get(id))
      .filter((col): col is NonNullable<typeof col> => Boolean(col));
    
    const leftPinned = (columnPinning.left || [])
      .map((id) => columnMap.get(id))
      .filter((col): col is NonNullable<typeof col> => Boolean(col));
    const rightPinned = (columnPinning.right || [])
      .map((id) => columnMap.get(id))
      .filter((col): col is NonNullable<typeof col> => Boolean(col));
    const center = orderedVisibleColumns.filter(
      (col) =>
        !columnPinning.left?.includes(col.id) &&
        !columnPinning.right?.includes(col.id)
    );

    return {
      left: leftPinned,
      center,
      right: rightPinned,
      all: [...leftPinned, ...center, ...rightPinned],
    };
  }, [visibleColumns, columnPinning, columnOrder]);
};

// Hook for column pinning handlers
export const useColumnPinning = (
  setColumnPinning: (updater: (prev: ColumnPinning) => ColumnPinning) => void
) => {
  const handlePinColumn = useCallback(
    (columnId: string, side: "left" | "right") => {
      setColumnPinning((prev) => {
        const newPinning = { ...prev };

        // Remove from current position
        newPinning.left = (newPinning.left || []).filter(
          (id) => id !== columnId
        );
        newPinning.right = (newPinning.right || []).filter(
          (id) => id !== columnId
        );

        // Add to new position
        if (side === "left") {
          newPinning.left = [...(newPinning.left || []), columnId];
        } else {
          newPinning.right = [...(newPinning.right || []), columnId];
        }

        return newPinning;
      });
    },
    [setColumnPinning]
  );

  const handleUnpinColumn = useCallback((columnId: string) => {
    setColumnPinning((prev) => ({
      left: (prev.left || []).filter((id) => id !== columnId),
      right: (prev.right || []).filter((id) => id !== columnId),
    }));
  }, [setColumnPinning]);

  return { handlePinColumn, handleUnpinColumn };
};
