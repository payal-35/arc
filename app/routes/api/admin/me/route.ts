import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";

export const loader: LoaderFunction = async ({ request }) => {
  try {
    /*
    // Forward client cookies to backend
    const cookieHeader = request.headers.get("cookie") ?? "";

    // Call your Go backend API
    const response = await fetch(`${process.env.API_URL}/admin/me`, {
      method: "GET",
      headers: {
        cookie: cookieHeader,
      },
      credentials: "include",
    });

    if (!response.ok) {
      return json(
        { message: "Not authenticated" },
        { status: response.status }
      );
    }

    const data = await response.json();

    // Return the admin info JSON
    return json(data);
    */

    // Temporary mock response for frontend rendering
    return json({
      id: "mock-admin-id",
      name: "Mock Admin",
      email: "admin@example.com",
      role: "superadmin",
    });
  } catch (error) {
    console.error("Get admin info error:", error);
    return json({ message: "Internal server error" }, { status: 500 });
  }
};
