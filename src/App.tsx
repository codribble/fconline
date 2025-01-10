import "./index.css";
import { useEffect, useState } from "react";
import {
  RouterProvider,
  // createBrowserRouter,
  createHashRouter,
} from "react-router-dom";
import { auth } from "./firebase";
import { createGlobalStyle } from "styled-components";
import reset from "styled-reset";
import Layout from "./components/layout";
import Loading from "./components/loading";
import Home from "./routes/home";
import Profile from "./routes/profile";
import Login from "./routes/login";
import Signin from "./routes/signin";
import Players from "./routes/players";
import Records from "./routes/records";
import Users from "./routes/users";
import PlayerDetails from "./routes/player_details";
import MatchDetail from "./components/match_detail";

const router = createHashRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "",
        element: <Home />,
      },
      {
        path: "profile",
        element: <Profile />,
      },
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "signin",
        element: <Signin />,
      },
      {
        path: "players/:id",
        element: <PlayerDetails />,
      },
      {
        path: "players",
        element: <Players />,
      },
      {
        path: "records",
        element: <Records />,
      },
      {
        path: "users",
        element: <Users />,
      },
      {
        path: "match/:id",
        element: <MatchDetail />,
      },
    ],
  },
]);

const GlobalStyles = createGlobalStyle`
  ${reset}
  *, *::before, *::after {
    box-sizing: border-box;
  }
  html {
    overflow: hidden;
    overflow-y: scroll;
  }
  body {
    background-color: black;
    color: white;
    font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  }
`;

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const init = async () => {
    await auth.authStateReady();
    setIsLoading(false);
  };

  useEffect(() => {
    init();
  }, []);

  return (
    <div className="flex flex-col items-center h-screen">
      <GlobalStyles />
      {isLoading ? <Loading /> : <RouterProvider router={router} />}
    </div>
  );
}

export default App;
