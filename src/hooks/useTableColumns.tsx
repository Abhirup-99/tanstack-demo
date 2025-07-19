import { useMemo } from "react";
import { createColumnHelper } from "@tanstack/react-table";
import type { Employee } from "../types/Employee";
import { EditableCell } from "../components/EditableCell";

const columnHelper = createColumnHelper<Employee>();

// Column definitions for the table
export const useTableColumns = () => {
  return useMemo(
    () => [
      columnHelper.accessor("id", {
        id: "id",
        header: "ID",
        cell: (info) => info.getValue(),
        size: 80,
      }),
      columnHelper.accessor("firstName", {
        id: "firstName",
        header: "First Name",
        cell: EditableCell,
        size: 120,
      }),
      columnHelper.accessor("lastName", {
        id: "lastName",
        header: "Last Name",
        cell: EditableCell,
        size: 120,
      }),
      columnHelper.accessor("email", {
        id: "email",
        header: "Email",
        cell: EditableCell,
        size: 200,
      }),
      columnHelper.accessor("department", {
        id: "department",
        header: "Department",
        cell: EditableCell,
        size: 120,
      }),
      columnHelper.accessor("position", {
        id: "position",
        header: "Position",
        cell: EditableCell,
        size: 150,
      }),
      columnHelper.accessor("salary", {
        id: "salary",
        header: "Salary",
        cell: EditableCell,
        size: 100,
      }),
      columnHelper.accessor("joinDate", {
        id: "joinDate",
        header: "Join Date",
        cell: EditableCell,
        size: 110,
      }),
      columnHelper.accessor("status", {
        id: "status",
        header: "Status",
        cell: EditableCell,
        size: 80,
      }),
      columnHelper.accessor("phone", {
        id: "phone",
        header: "Phone",
        cell: EditableCell,
        size: 120,
      }),
      columnHelper.accessor("address", {
        id: "address",
        header: "Address",
        cell: EditableCell,
        size: 150,
      }),
      columnHelper.accessor("city", {
        id: "city",
        header: "City",
        cell: EditableCell,
        size: 100,
      }),
      columnHelper.accessor("state", {
        id: "state",
        header: "State",
        cell: EditableCell,
        size: 60,
      }),
      columnHelper.accessor("zipCode", {
        id: "zipCode",
        header: "Zip Code",
        cell: EditableCell,
        size: 80,
      }),
      columnHelper.accessor("birthDate", {
        id: "birthDate",
        header: "Birth Date",
        cell: EditableCell,
        size: 110,
      }),
      columnHelper.accessor("emergencyContact", {
        id: "emergencyContact",
        header: "Emergency Contact",
        cell: EditableCell,
        size: 150,
      }),
      columnHelper.accessor("manager", {
        id: "manager",
        header: "Manager",
        cell: EditableCell,
        size: 120,
      }),
      columnHelper.accessor("startDate", {
        id: "startDate",
        header: "Start Date",
        cell: EditableCell,
        size: 110,
      }),
      columnHelper.accessor("performanceRating", {
        id: "performanceRating",
        header: "Performance Rating",
        cell: (info) => `${info.getValue()}/5`,
        size: 140,
      }),
      columnHelper.accessor("bonus", {
        id: "bonus",
        header: "Bonus",
        cell: EditableCell,
        size: 100,
      }),
      columnHelper.accessor("vacationDays", {
        id: "vacationDays",
        header: "Vacation Days",
        cell: EditableCell,
        size: 120,
      }),
      columnHelper.accessor("sickDays", {
        id: "sickDays",
        header: "Sick Days",
        cell: EditableCell,
        size: 100,
      }),
      columnHelper.accessor("project", {
        id: "project",
        header: "Project",
        cell: EditableCell,
        size: 120,
      }),
      columnHelper.accessor("skills", {
        id: "skills",
        header: "Skills",
        cell: EditableCell,
        size: 200,
      }),
      columnHelper.accessor("education", {
        id: "education",
        header: "Education",
        cell: EditableCell,
        size: 100,
      }),
      columnHelper.accessor("experience", {
        id: "experience",
        header: "Experience (Years)",
        cell: (info) => `${info.getValue()} years`,
        size: 130,
      }),
      columnHelper.accessor("certification", {
        id: "certification",
        header: "Certification",
        cell: EditableCell,
        size: 120,
      }),
      columnHelper.accessor("teamSize", {
        id: "teamSize",
        header: "Team Size",
        cell: EditableCell,
        size: 100,
      }),
      columnHelper.accessor("lastReview", {
        id: "lastReview",
        header: "Last Review",
        cell: (info) =>
          new Date(info.getValue() as string).toLocaleDateString(),
        size: 110,
      }),
      columnHelper.accessor("nextReview", {
        id: "nextReview",
        header: "Next Review",
        cell: (info) =>
          new Date(info.getValue() as string).toLocaleDateString(),
        size: 110,
      }),
      columnHelper.accessor("notes", {
        id: "notes",
        header: "Notes",
        cell: EditableCell,
        size: 200,
      }),
    ],
    []
  );
};
