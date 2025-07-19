import type { Employee } from "../types/Employee";

// Generate large dataset for unlimited rows demo
export const generateLargeDataset = (rowCount: number): Employee[] => {
  const firstNames = [
    "John",
    "Jane",
    "Bob",
    "Alice",
    "Charlie",
    "Diana",
    "Eva",
    "Frank",
    "Grace",
    "Henry",
    "Ivy",
    "Jack",
    "Kate",
    "Liam",
    "Mia",
    "Noah",
    "Olivia",
    "Paul",
    "Quinn",
    "Ruby",
  ];
  const lastNames = [
    "Smith",
    "Johnson",
    "Williams",
    "Brown",
    "Jones",
    "Garcia",
    "Miller",
    "Davis",
    "Rodriguez",
    "Martinez",
    "Hernandez",
    "Lopez",
    "Gonzalez",
    "Wilson",
    "Anderson",
    "Thomas",
    "Taylor",
    "Moore",
    "Jackson",
    "Martin",
  ];
  const departments = [
    "Engineering",
    "Design",
    "Marketing",
    "Sales",
    "HR",
    "Finance",
    "Operations",
    "Legal",
    "Research",
    "Customer Support",
  ];
  const positions = [
    "Manager",
    "Senior",
    "Junior",
    "Lead",
    "Principal",
    "Associate",
    "Director",
    "VP",
    "Analyst",
    "Specialist",
  ];
  const cities = [
    "New York",
    "Los Angeles",
    "Chicago",
    "Houston",
    "Phoenix",
    "Philadelphia",
    "San Antonio",
    "San Diego",
    "Dallas",
    "San Jose",
  ];
  const states = ["NY", "CA", "IL", "TX", "AZ", "PA", "FL", "OH", "NC", "MI"];
  const projects = [
    "Project Alpha",
    "Project Beta",
    "Project Gamma",
    "Project Delta",
    "Project Epsilon",
    "Project Zeta",
    "Project Eta",
    "Project Theta",
  ];
  const skills = [
    "JavaScript",
    "Python",
    "React",
    "Node.js",
    "SQL",
    "AWS",
    "Docker",
    "Kubernetes",
    "Machine Learning",
    "Data Analysis",
  ];

  return Array.from({ length: rowCount }, (_, i) => {
    const firstName = firstNames[i % firstNames.length];
    const lastName =
      lastNames[Math.floor(i / firstNames.length) % lastNames.length];
    const department = departments[i % departments.length];
    const position = positions[i % positions.length];

    return {
      id: i + 1,
      firstName,
      lastName,
      email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}${
        i > 399 ? i : ""
      }@company.com`,
      department,
      position: `${position} ${department.slice(0, -1)}`,
      salary: Math.floor(Math.random() * 100000) + 50000,
      joinDate: new Date(
        2020 + Math.floor(Math.random() * 4),
        Math.floor(Math.random() * 12),
        Math.floor(Math.random() * 28) + 1
      )
        .toISOString()
        .split("T")[0],
      status:
        Math.random() > 0.1 ? "Active" : ("Inactive" as "Active" | "Inactive"),
      phone: `(555) ${String(Math.floor(Math.random() * 900) + 100)}-${String(
        Math.floor(Math.random() * 9000) + 1000
      )}`,
      address: `${Math.floor(Math.random() * 9999) + 1} ${
        lastNames[i % lastNames.length]
      } St`,
      city: cities[i % cities.length],
      state: states[i % states.length],
      zipCode: String(Math.floor(Math.random() * 90000) + 10000),
      birthDate: new Date(
        1970 + Math.floor(Math.random() * 30),
        Math.floor(Math.random() * 12),
        Math.floor(Math.random() * 28) + 1
      )
        .toISOString()
        .split("T")[0],
      emergencyContact: `${firstNames[(i + 1) % firstNames.length]} ${
        lastNames[(i + 1) % lastNames.length]
      }`,
      manager: `${firstNames[(i + 2) % firstNames.length]} ${
        lastNames[(i + 2) % lastNames.length]
      }`,
      startDate: new Date(
        2019 + Math.floor(Math.random() * 5),
        Math.floor(Math.random() * 12),
        Math.floor(Math.random() * 28) + 1
      )
        .toISOString()
        .split("T")[0],
      performanceRating: Math.floor(Math.random() * 5) + 1,
      bonus: Math.floor(Math.random() * 20000),
      vacationDays: Math.floor(Math.random() * 30) + 10,
      sickDays: Math.floor(Math.random() * 10) + 2,
      project: projects[i % projects.length],
      skills: skills.slice(0, Math.floor(Math.random() * 3) + 1).join(", "),
      education: ["Bachelor's", "Master's", "PhD", "Associate"][i % 4],
      experience: Math.floor(Math.random() * 20) + 1,
      certification: ["AWS", "Google Cloud", "Azure", "Salesforce", "None"][
        i % 5
      ],
      teamSize: Math.floor(Math.random() * 10) + 1,
      lastReview: new Date(
        2023,
        Math.floor(Math.random() * 12),
        Math.floor(Math.random() * 28) + 1
      )
        .toISOString()
        .split("T")[0],
      nextReview: new Date(
        2024,
        Math.floor(Math.random() * 12),
        Math.floor(Math.random() * 28) + 1
      )
        .toISOString()
        .split("T")[0],
      notes: `Employee notes for ${firstName} ${lastName}`,
    };
  });
};
