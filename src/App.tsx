import "./App.css";
import { Navigate, HashRouter as Router, useLocation, useRoutes } from "react-router-dom";
import routes from "~react-pages";
import MainLayout from "./layouts/mainlayout";
import { Suspense } from "react";
import { Spin, Typography } from "antd";
import useNetworkStatus from "./hooks/useNetworkStatus";
import NetworkError from "./views/errors/NetworkError";
import NotFound from "./views/errors/404";

const { Text } = Typography;

const Loader = () => (
  <div
    style={{
      height: "100vh",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      flexDirection: "column",
      gap: "12px",
    }}
  >
    <Text strong>Teams Bot is loading...</Text>
    <Spin size="large" />
  </div>
);

function App() {
  const location = useLocation();
  const isOnline = useNetworkStatus();

  const isAuthenticated =
    localStorage.getItem("isAuthenticated") === "true";

  const element = useRoutes([
    ...routes,
    { path: "*", element: <NotFound /> },
  ]);

  const cleanPath = location.pathname.replace(/\/+$/, "");

  const noLayoutRoutes = [
    "/login",
    "/signup",
    "/forgot-password",
    "/WelcomeScreen"
  ];


  if (
    !isAuthenticated &&
    !noLayoutRoutes.includes(cleanPath)
  ) {
    return <Navigate to="/login" replace />;
  }

  if (
    isAuthenticated &&
    cleanPath === "/login"
  ) {
    return <Navigate to="/connectionsboomi" replace />;
  }

  return (
    <>
      {!isOnline ? (
        <NetworkError />
      ) : (
        <Suspense fallback={<Loader />}>
          {noLayoutRoutes.includes(cleanPath) ? (
            element
          ) : (
            <MainLayout>{element}</MainLayout>
          )}
        </Suspense>
      )}
    </>
  );
}

export default function Root() {
  return (
    <Router>
      <App />
    </Router>
  );
}
