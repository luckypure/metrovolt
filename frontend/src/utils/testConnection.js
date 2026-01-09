// Utility to test backend connection
export const testBackendConnection = async () => {
  try {
    const response = await fetch("http://localhost:5000/");
    const text = await response.text();
    return {
      success: true,
      message: "Backend is running",
      data: text
    };
  } catch (error) {
    return {
      success: false,
      message: "Cannot connect to backend",
      error: error.message,
      suggestion: "Make sure backend is running: cd backend && npm run dev"
    };
  }
};

// Test API endpoint
export const testAPIEndpoint = async (endpoint = "/auth/test") => {
  try {
    const response = await fetch(`http://localhost:5000/api${endpoint}`);
    const data = await response.json();
    return {
      success: true,
      message: "API endpoint is accessible",
      data
    };
  } catch (error) {
    return {
      success: false,
      message: "API endpoint not accessible",
      error: error.message
    };
  }
};
