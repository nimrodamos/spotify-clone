// import { UserProvider } from "./Context/UserContext.tsx"; // Adjust the path as necessary
// import { AppDataProvider } from "./Context/AppDataContext";
// import Navbar from "./components/Navbar/Navbar.tsx";
// import Player from "./components/Player";
// import Main from "./pages/Main";
// import SignUp from "./pages/SignUp";
// import LogIn from "./pages/Login";
// import { Routes, Route, useLocation } from "react-router-dom";
// import PasswordRecoveryPage from "./pages/ForgotPassword";

// const App = () => {
//   const location = useLocation();

//   const isFullPage =
//     location.pathname === "/login" ||
//     location.pathname === "/signup" ||
//     location.pathname === "/password-reset";

//   return (
//     <UserProvider>
//       <AppDataProvider>
//         <div className="h-screen bg-black">
//           {!isFullPage && (
//             <div className="h-[8.5%]">
//               <Navbar />
//             </div>
//           )}

//           <div className={isFullPage ? "h-full" : "h-[81%]"}>
//             <Routes>
//               <Route path="*" element={<Main />} />
//               <Route path="/signup" element={<SignUp />} />
//               <Route path="/login" element={<LogIn />} />
//               <Route path="/password-reset" element={<PasswordRecoveryPage />} />
//             </Routes>
//           </div>

//           {!isFullPage && (
//             <div className="h-[10%]">
//               <Player />
//             </div>
//           )}
//         </div>

//       </AppDataProvider>
//     </UserProvider>
//   );
// };

// export default App;
// //!

// import { UserProvider } from "./Context/UserContext";
// import { AppDataProvider } from "./Context/AppDataContext";
// import Navbar from "./components/Navbar/Navbar";
// import Main from "./pages/Main";
// import SignUp from "./pages/SignUp";
// import LogIn from "./pages/Login";
// import { Routes, Route, useLocation } from "react-router-dom";
// import PasswordRecoveryPage from "./pages/ForgotPassword";
// import Player from "./components/Player";

// const App = () => {
//   const location = useLocation();
//   const isFullPage = ["/login", "/signup", "/password-reset"].includes(location.pathname);

//   return (
//     <UserProvider>
//       <AppDataProvider>
//         <div className={`
//           h-screen
//           overflow-hidden
//           bg-black
//           ${isFullPage ? '' : 'grid grid-rows-[55px_1fr_102px] gap-[9px]'}
//         `}>
//           {!isFullPage && (
//             <>
//               {/* Navbar */}
//               <div className="w-full">
//                 <Navbar />
//               </div>

//               {/* Main Content */}
//               <div className="w-full overflow-hidden">
//                 <Main />
//               </div>

//               {/* Player */}
//               <div className="w-full bg-black">
//                 <Player />
//               </div>
//             </>
//           )}

//           {isFullPage && (
//             <Routes>
//               <Route path="/signup" element={<SignUp />} />
//               <Route path="/login" element={<LogIn />} />
//               <Route path="/password-reset" element={<PasswordRecoveryPage />} />
//             </Routes>
//           )}
//         </div>
//       </AppDataProvider>
//     </UserProvider>
//   );
// };

// export default App;
// //!

import { UserProvider } from "./Context/UserContext";
import { AppDataProvider } from "./Context/AppDataContext";
import Navbar from "./components/Navbar/Navbar";
import Main from "./pages/Main";
import SignUp from "./pages/SignUp";
import LogIn from "./pages/Login";
import { Routes, Route, useLocation } from "react-router-dom";
import PasswordRecoveryPage from "./pages/ForgotPassword";
import Player from "./components/Player";

const App = () => {
  const location = useLocation();
  const isFullPage = ["/login", "/signup", "/password-reset"].includes(
    location.pathname
  );

  return (
    <UserProvider>
      <AppDataProvider>
        <div
          className={`
          h-screen 
          overflow-hidden
          bg-black 
          ${isFullPage ? "" : "grid grid-rows-[55px_1fr_102px]"}
        `}
        >
          {!isFullPage && (
            <>
              {/* Navbar */}
              <div className="w-full">
                <Navbar />
              </div>

              {/* Main Content */}
              <div className="w-full overflow-hidden">
                <Main />
              </div>

              <div className="w-full bg-black">
                <Player />
              </div>
            </>
          )}

          {isFullPage && (
            <Routes>
              <Route path="/signup" element={<SignUp />} />
              <Route path="/login" element={<LogIn />} />
              <Route
                path="/password-reset"
                element={<PasswordRecoveryPage />}
              />
            </Routes>
          )}
        </div>
      </AppDataProvider>
    </UserProvider>
  );
};

export default App;
