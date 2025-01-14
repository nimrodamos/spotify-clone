import { UserProvider } from "./Context/UserContext.tsx"; // Adjust the path as necessary
import Navbar from "./components/Navbar/Navbar.tsx";
import Player from "./components/Player";
import Main from "./pages/Main";
import SignUp from "./pages/SignUp";
import LogIn from "./pages/Login";
import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import PasswordRecoveryPage from "./pages/ForgotPassword";
import NotFoundPage from "./pages/404Page.tsx";

const App = () => {
  const location = useLocation();

  const isFullPage =
    location.pathname === "/login" ||
    location.pathname === "/signup" ||
    location.pathname === "/password-reset";

  return (
    <UserProvider>
      <div className="h-screen bg-black">
        {!isFullPage && location.pathname !== "/404" && (
          <div className="h-[8.5%]">
            <Navbar />
          </div>
        )}

        <div className={isFullPage ? "h-full" : "h-[81%]"}>
            <Routes>
              <Route path="/" element={<Main />} />
              <Route path="/signup" element={<SignUp />} />
              <Route path="/login" element={<LogIn />} />
              <Route path="/password-reset" element={<PasswordRecoveryPage />} />
              <Route path="*" element={<Navigate to="/404" />} />
              <Route path="/404" element={<NotFoundPage />} />
            </Routes>
        </div>

        {!isFullPage && location.pathname !== "/404" &&  (
          <div className="h-[10%]">
            <Player />
          </div>
        )}
      </div>
    </UserProvider>
  );
};

export default App;
