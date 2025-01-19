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
      "https://api.spotify.com/v1/browse/categories?limit=20",
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
    <div className="px-10 py-8">
      <h1 className="text-white text-2xl font-bold mb-4">Browse all</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        {categories?.map((category: any, index: number) => (
          <div
            key={category.id}
            onClick={() => navigate(`/category/${category.id}`)}
            className="relative rounded overflow-hidden cursor-pointer shadow-lg hover:scale-105 transition-all duration-300"
            style={{
              backgroundColor: getCategoryColor(index),
              height: "180px",
              width: "280px",
            }}
          >
            <h2 className="text-white text-2xl font-bold p-6">
              {category.name}
            </h2>
            <img
              src={category.icons?.[0]?.url}
              alt={category.name}
              className="absolute bottom-0 right-0 w-32 rotate-12 shadow-lg"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default BrowseAll;
