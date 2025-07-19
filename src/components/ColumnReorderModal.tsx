import {
  DndContext,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  closestCenter,
  type DragEndEvent,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { SortableColumnItem } from "./SortableColumnItem";
import type { ColumnPinning } from "../types/Employee";

// Column Reorder Modal Component
export function ColumnReorderModal({
  isOpen,
  onClose,
  columns,
  columnOrder,
  onColumnOrderChange,
  columnPinning,
  onPin,
  onUnpin,
}: {
  isOpen: boolean;
  onClose: () => void;
  columns: Array<{ id: string; header: string }>;
  columnOrder: string[];
  onColumnOrderChange: (newOrder: string[]) => void;
  columnPinning: ColumnPinning;
  onPin: (columnId: string, side: "left" | "right") => void;
  onUnpin: (columnId: string) => void;
}) {
  const sensors = useSensors(
    useSensor(MouseSensor),
    useSensor(TouchSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = columnOrder.indexOf(active.id as string);
      const newIndex = columnOrder.indexOf(over.id as string);
      const newOrder = arrayMove(columnOrder, oldIndex, newIndex);
      onColumnOrderChange(newOrder);
    }
  };

  const orderedColumns = columnOrder
    .map((id) => columns.find((col) => col.id === id))
    .filter((col): col is NonNullable<typeof col> => Boolean(col));

  const getColumnPinStatus = (columnId: string): "left" | "right" | false => {
    if (columnPinning.left?.includes(columnId)) return "left";
    if (columnPinning.right?.includes(columnId)) return "right";
    return false;
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Reorder Columns</h2>
          <button className="close-button" onClick={onClose}>
            ×
          </button>
        </div>

        <div className="modal-body">
          <p className="modal-description">
            Drag and drop to reorder columns. Use pin buttons to pin columns to
            left or right.
          </p>

          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={columnOrder}
              strategy={verticalListSortingStrategy}
            >
              <div className="sortable-columns-list">
                {orderedColumns.map((column) => {
                  const isPinned = getColumnPinStatus(column.id);
                  return (
                    <div key={column.id} className="column-item-wrapper">
                      <SortableColumnItem column={column} isPinned={isPinned} />
                      <div className="column-controls">
                        <button
                          onClick={() =>
                            isPinned === "left"
                              ? onUnpin(column.id)
                              : onPin(column.id, "left")
                          }
                          className={`pin-button ${
                            isPinned === "left" ? "active" : ""
                          }`}
                          title={isPinned === "left" ? "Unpin" : "Pin Left"}
                        >
                          📌L
                        </button>
                        <button
                          onClick={() =>
                            isPinned === "right"
                              ? onUnpin(column.id)
                              : onPin(column.id, "right")
                          }
                          className={`pin-button ${
                            isPinned === "right" ? "active" : ""
                          }`}
                          title={isPinned === "right" ? "Unpin" : "Pin Right"}
                        >
                          📌R
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </SortableContext>
          </DndContext>
        </div>

        <div className="modal-footer">
          <button className="button-secondary" onClick={onClose}>
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
