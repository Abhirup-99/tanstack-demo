import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

// Sortable Column Item Component for Modal
export function SortableColumnItem({
  column,
  isPinned,
}: {
  column: { id: string; header: string };
  isPinned: "left" | "right" | false;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: column.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`sortable-column-item ${isPinned ? `pinned-${isPinned}` : ""}`}
      {...attributes}
      {...listeners}
    >
      <div className="drag-handle">⋮⋮</div>
      <span className="column-name">{column.header}</span>
      {isPinned && (
        <span className={`pin-indicator pin-${isPinned}`}>📌 {isPinned}</span>
      )}
    </div>
  );
}
