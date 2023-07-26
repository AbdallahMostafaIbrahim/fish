import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { useUserStore } from "./utils/store/user";
import { QueryClientProvider, QueryClient, useQuery } from "react-query";
import { API } from "./utils/constants";
import { ScaleLoader } from "react-spinners";
import Login from "./routes/login";
import Home from "./routes/home";
import Campaigns from "./routes/campaigns";
import AdminRoot from "./components/AdminRoot";
import axios from "axios";
import Users from "./routes/users";
import Templates from "./routes/templates";
import Emails from "./routes/emails";

axios.defaults.withCredentials = true;

const client = new QueryClient({
  defaultOptions: { queries: { cacheTime: 0 } },
});

const router = createBrowserRouter([
  {
    path: "/",
    children: [
      {
        path: "admin",
        element: <AdminRoot />,
        children: [
          {
            index: true,
            element: <Home />,
          },
          {
            path: "campaigns",
            element: <Campaigns />,
          },
          {
            path: "users",
            element: <Users />,
          },
          {
            path: "templates",
            element: <Templates />,
          },
          {
            path: "emails",
            element: <Emails />,
          },
        ],
      },
      {
        path: "admin/login",
        element: <Login />,
      },
    ],
  },
]);

const App = () => {
  const { setUser } = useUserStore();
  const { data, isLoading, isError } = useQuery("user", async () => {
    const res = await axios.get<{
      code: number;
      user: {
        email: string;
        name: string;
        id: string;
      };
    }>(API + "/auth/me");
    return res.data;
  });

  React.useEffect(() => {
    if (data?.code == 200) {
      setUser(data.user);
    } else {
      setUser(undefined);
    }
  }, [data]);

  if (isError)
    return (
      <div className="h-screen flex flex-col space-y-4 items-center justify-center bg-gray-900">
        <h1 className="text-white font-light text-2xl">
          An error occurred while loading the page
        </h1>
        <button
          className="bg-emerald-500 px-4 py-2 rounded-lg text-white"
          onClick={() => window.location.reload()}
        >
          Reload
        </button>
      </div>
    );

  if (isLoading)
    return (
      <div className="h-screen flex flex-col space-y-4 items-center justify-center bg-gray-900">
        <ScaleLoader
          color="white"
          width={6}
          height={40}
          radius={8}
          margin={4}
        />
        <h1 className="text-white font-light text-2xl animate-bounce animate-pulse">
          Phishing...
        </h1>
      </div>
    );
  return <RouterProvider router={router} />;
};

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <QueryClientProvider client={client}>
      <App />
    </QueryClientProvider>
  </React.StrictMode>
);
