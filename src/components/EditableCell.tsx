import { useState, useEffect } from "react";
import type { CellContext } from "@tanstack/react-table";
import type { Employee } from "../types/Employee";

export const EditableCell = ({
  getValue,
  row,
  column,
  table,
}: CellContext<Employee, unknown>) => {
  const initialValue = getValue();
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState(initialValue);

  const onBlur = () => {
    table.options.meta?.updateData(row.index, column.id, value);
    setIsEditing(false);
  };

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  if (isEditing) {
    return (
      <input
        value={value as string}
        onChange={(e) => setValue(e.target.value)}
        onBlur={onBlur}
        autoFocus
        className="editable-cell-input"
      />
    );
  }

  return (
    <div
      onClick={() => setIsEditing(true)}
      className="editable-cell-display"
      title="Click to edit"
    >
      {value as string}
    </div>
  );
};
