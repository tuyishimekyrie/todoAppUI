// Retrieve the stored object from localStorage
const storedData = localStorage.getItem("token");

if (storedData) {
  try {
    // Parse the stored data as JSON
    const userData = JSON.parse(storedData);

    // Check if the isAdmin property exists
    if (userData.isAdmin !== undefined) {
      // Retrieve and log the value of isAdmin
      const isAdmin = userData.isAdmin;
      console.log("isAdmin:", isAdmin);

      // Convert isAdmin to boolean if needed
      const isAdminBool = isAdmin === true || isAdmin === "true";
      console.log("isAdmin (as boolean):", isAdminBool);

      // You can now use the isAdmin property as needed
    } else {
      console.log("isAdmin property does not exist in the stored data");
    }
  } catch (error) {
    console.error("Error parsing stored data:", error);
  }
} else {
  console.log("No stored data found in localStorage");
}
