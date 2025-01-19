import React from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/api";
import { useUserContext } from "@/Context/UserContext";

const fetchCategoryDetails = async (
  categoryId: string,
  accessToken: string
) => {
  if (!accessToken) throw new Error("Access token is missing");

  const response = await api.get(
    `https://api.spotify.com/v1/browse/categories/${categoryId}`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
  return response.data;
};

const CategoryPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useUserContext();

  const {
    data: category,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["category", id],
    queryFn: () =>
      fetchCategoryDetails(id as string, user?.accessToken as string),
    enabled: Boolean(id && user?.accessToken),
  });

  // Handle loading state
  if (isLoading) return <p className="text-white text-center">Loading...</p>;

  // Handle error or empty data
  if (error || !category) {
    return (
      <p className="text-red-500 text-center">
        Failed to load category details. Please try again.
      </p>
    );
  }

  // Debugging in development mode
  if (process.env.NODE_ENV === "development") {
    console.log("Fetched Category Data:", category);
  }

  return (
    <div className="px-12 py-10">
      <h1 className="text-white text-4xl font-bold mb-6 text-center">
        {category?.name || "Unknown Category"}
      </h1>
      <div className="flex flex-col items-center">
        {category?.icons?.[0]?.url ? (
          <img
            src={category.icons[0].url}
            alt={category.name}
            className="w-48 h-48 rounded-lg shadow-lg"
          />
        ) : (
          <div className="w-48 h-48 bg-gray-800 flex items-center justify-center rounded-lg">
            <p className="text-gray-400">No Image Available</p>
          </div>
        )}
        <p className="text-gray-300 text-lg mt-4 text-center max-w-2xl">
          {category?.description || "No description available"}
        </p>
      </div>
    </div>
  );
};

export default CategoryPage;
