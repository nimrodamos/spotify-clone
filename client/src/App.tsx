import { UserProvider } from "./Context/UserContext.tsx"; // Adjust the path as necessary
import Navbar from "./components/Navbar";
import Player from "./components/Player";
import Main from "./pages/Main";
import SignUp from "./pages/SignUp";
import LogIn from "./pages/Login";
import { Routes, Route, useLocation } from "react-router-dom";
import PasswordRecoveryPage from "./pages/ForgotPassword";

const App = () => {
  const location = useLocation();

  const isFullPage =
    location.pathname === "/login" ||
    location.pathname === "/signup" ||
    location.pathname === "/password-reset";

  return (
    <UserProvider>
      <div className="h-screen bg-black">
        {!isFullPage && (
          <div className="h-[10%]">
            <Navbar />
          </div>
        )}

        <div className={isFullPage ? "h-full" : "h-[80%]"}>
          <Routes>
            <Route path="*" element={<Main />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/login" element={<LogIn />} />
            <Route path="/password-reset" element={<PasswordRecoveryPage />} />
          </Routes>
        </div>

        {!isFullPage && (
          <div className="h-[10%]">
            <Player />
          </div>
        )}
      </div>
    </UserProvider>
  );
};

export default App;
