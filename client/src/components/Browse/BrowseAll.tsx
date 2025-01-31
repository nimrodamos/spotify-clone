// import React from "react";
// import { useQuery } from "@tanstack/react-query";
// import { useNavigate } from "react-router-dom";
// import { api } from "@/api";
// import { useUserContext } from "@/Context/UserContext";

// // Function to assign a predefined color palette to categories
// const getCategoryColor = (index: number) => {
//   const colors = [
//     "#1DB954", // Green
//     "#E22134", // Red
//     "#1E3264", // Dark Blue
//     "#A5673F", // Brown
//     "#8D67AB", // Purple
//     "#D84000", // Orange
//     "#D8D8D8", // Grey
//     "#2D46B9", // Blue
//     "#E13300", // Dark Orange
//     "#F037A5", // Pink
//   ];
//   return colors[index % colors.length];
// };

// const BrowseAll: React.FC = () => {
//   const navigate = useNavigate();
//   const { user } = useUserContext();

//   // Fetch categories from Spotify API
//   const fetchCategories = async () => {
//     if (!user?.accessToken) {
//       throw new Error("Unauthorized: No access token found");
//     }

//     const response = await api.get(
//       "https://api.spotify.com/v1/browse/categories?limit=50",
//       {
//         headers: {
//           Authorization: `Bearer ${user.accessToken}`,
//         },
//       }
//     );

//     if (response.status !== 200) {
//       throw new Error(`Error fetching categories: ${response.statusText}`);
//     }

//     return response.data.categories.items;
//   };

//   const {
//     data: categories,
//     isLoading,
//     error,
//   } = useQuery({
//     queryKey: ["categories"],
//     queryFn: fetchCategories,
//     enabled: Boolean(user?.accessToken),
//   });

//   if (isLoading)
//     return <p className="text-center text-white text-2xl">Loading...</p>;
//   if (error)
//     return (
//       <p className="text-center text-red-500 text-2xl">
//         Failed to load categories: {error instanceof Error ? error.message : ""}
//       </p>
//     );
//     return (
//       <div
//         className="grid grid-cols-[repeat(auto-fill,minmax(230px,1fr))] gap-6
//                    w-full overflow-x-hidden overflow-y-auto
//                    px-4 py-4"
//       >
//         {categories?.map((category: any, index: number) => (
//           <div
//             key={category.id}
//             onClick={() => navigate(`/category/${category.id}`)}
//             className="cursor-pointer transition-all duration-300

//                        rounded- overflow-hidden shadow-md
//                        relative flex flex-col justify-between"
//             style={{
//               backgroundColor: getCategoryColor(index),
//               minHeight: '130px',
//               maxHeight: '200px',
//               minWidth: '230px',
//               maxWidth: '355px',
//             }}
//           >
//             <div className="p-4 text-white font-semibold text-lg">
//               {category.name}
//             </div>
//             {category.icons?.[0]?.url && (
//               <img
//                 src={category.icons[0].url}
//                 alt={category.name}
//                 className="absolute bottom-0 right-0 w-32 rotate-12 shadow-lg"
//               />
//             )}
//           </div>
//         ))}
//       </div>
//     );
//   };

//   export default BrowseAll;

import React from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { api } from "@/api";
import { useUserContext } from "@/Context/UserContext";

// Function to assign a predefined color palette to categories
const getCategoryColor = (index: number) => {
  const colors = [
    "#1DB954", // Green
    "#E22134", // Red
    "#1E3264", // Dark Blue
    "#A5673F", // Brown
    "#8D67AB", // Purple
    "#D84000", // Orange
    "#D8D8D8", // Grey
    "#2D46B9", // Blue
    "#E13300", // Dark Orange
    "#F037A5", // Pink
  ];
  return colors[index % colors.length];
};

const BrowseAll: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useUserContext();

  // Fetch categories from Spotify API
  const fetchCategories = async () => {
    if (!user?.accessToken) {
      throw new Error("Unauthorized: No access token found");
    }

    const response = await api.get(
      "https://api.spotify.com/v1/browse/categories?limit=50",
      {
        headers: {
          Authorization: `Bearer ${user.accessToken}`,
        },
      }
    );

    if (response.status !== 200) {
      throw new Error(`Error fetching categories: ${response.statusText}`);
    }

    return response.data.categories.items;
  };

  const {
    data: categories,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["categories"],
    queryFn: fetchCategories,
    enabled: Boolean(user?.accessToken),
  });

  if (isLoading)
    return <p className="text-center text-white text-2xl">Loading...</p>;
  if (error)
    return (
      <p className="text-center text-red-500 text-2xl">
        Failed to load categories: {error instanceof Error ? error.message : ""}
      </p>
    );
  return (
    <div
      className="grid grid-cols-[repeat(auto-fill,minmax(230px,1fr))] gap-6 
                   w-full overflow-x-hidden overflow-y-auto 
                   px-4 py-4"
    >
      {categories?.map((category: any, index: number) => (
        <div
          key={category.id}
          onClick={() => navigate(`/category/${category.id}`)}
          className="cursor-pointer transition-all duration-300 
                       
                       rounded-xl overflow-hidden shadow-md 
                       relative flex flex-col justify-between"
          style={{
            backgroundColor: getCategoryColor(index),
            minHeight: "130px",
            maxHeight: "200px",
            minWidth: "230px",
            maxWidth: "355px",
          }}
        >
          <div className="p-4 text-white font-semibold text-lg z-10">
            {category.name}
          </div>
          {category.icons?.[0]?.url && (
            <img
              src={category.icons[0].url}
              alt={category.name}
              className="absolute bottom-0 right-0 w-32 rotate-12 shadow-lg"
            />
          )}
        </div>
      ))}
    </div>
  );
};

export default BrowseAll;
