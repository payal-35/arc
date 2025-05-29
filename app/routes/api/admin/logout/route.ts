import type { ActionFunction } from "@remix-run/node";
import { json } from "@remix-run/node";

export const action: ActionFunction = async ({ request }) => {
  try {
    /*
    // Forward cookies from client to backend
    const cookieHeader = request.headers.get("cookie") ?? "";

    // Call your Go backend API to logout
    const response = await fetch(`${process.env.API_URL}/admin/logout`, {
      method: "POST",
      headers: {
        // Forward the cookies so backend can clear session
        cookie: cookieHeader,
      },
      credentials: "include", // include cookies
    });

    if (!response.ok) {
      const errorData = await response.json();
      return json(
        { message: errorData.message || "Logout failed" },
        { status: response.status }
      );
    }

    // Get the set-cookie header to clear auth cookies
    const cookies = response.headers.get("set-cookie");

    const headers: HeadersInit = {};
    if (cookies) {
      headers["Set-Cookie"] = cookies;
    }

    return json({ message: "Logged out successfully" }, { headers });
    */

    // Temporary mock success response to let frontend run smoothly
    return json({ message: "Logout successful (mock)" });
  } catch (error) {
    console.error("Logout error:", error);
    return json({ message: "Internal server error" }, { status: 500 });
  }
};
