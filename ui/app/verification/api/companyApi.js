const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL; // Change if backend is hosted elsewhere

export const fetchCompanies = async () => {
  try {
    const response = await fetch(`${API_URL}/raw_companies`);
    const result = await response.json();

    if (result.status === "success") {
      return result.data;
    } else {
      console.error("Failed to fetch companies:", result);
      return [];
    }
  } catch (error) {
    console.error("Error fetching companies:", error);
    return [];
  }
};