import { index, layout, route } from "@react-router/dev/routes";

export default [
  index("routes/home.jsx"),
  route("login", "routes/login.jsx"),
  layout("components/ProtectedLayout.jsx", [
    layout("routes/dashboard.jsx", [
      route("dashboard", "routes/dashboard-index.jsx"),
      route("dashboard/:subjectId/:moduleId", "routes/dashboard-module.jsx"),
      route("dashboard/formulas", "routes/dashboard-formulas.jsx"),
      route("dashboard/connections", "routes/dashboard-connections.jsx"),
      route("dashboard/practice-exam", "routes/dashboard-practice-exam.jsx"),
    ]),
  ]),
];
