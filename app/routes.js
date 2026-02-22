import { index, layout, route } from "@react-router/dev/routes";

export default [
  index("routes/home.jsx"),
  route("login", "routes/login.jsx"),
  route("terms", "routes/terms.jsx"),
  route("privacy", "routes/privacy.jsx"),
  route("pricing", "routes/pricing.jsx"),
  route("payment-success", "routes/payment-success.jsx"),
  route("api/webhooks/dodo", "routes/api.webhooks.dodo.js"),
  route("api/webhooks/razorpay", "routes/api.webhooks.razorpay.js"),
  route("api/razorpay-order", "routes/api.razorpay-order.js"),
  route("api/razorpay-verify", "routes/api.razorpay-verify.js"),
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
