import type { ActionFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";

export const action: ActionFunction = async ({ request }) => {
  try {
    const { email, password } = await request.json();

    /*
    // Call your Go backend API
    const response = await fetch(`${process.env.API_URL}/admin/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return json(
        { message: errorData.message || "Invalid credentials" },
        { status: response.status }
      );
    }

    const data = await response.json();

    // Get the auth_token cookie from the backend response
    const cookies = response.headers.get("set-cookie");

    // Create response JSON with data from backend
    const headers: HeadersInit = {};
    if (cookies) {
      // Forward the set-cookie header to the client
      headers["Set-Cookie"] = cookies;
    }

    return json(
      {
        expiresIn: data.expiresIn,
        tenantId: data.tenantId,
      },
      { headers }
    );
    */

    // Temporary mock success response for frontend rendering
    return json({
      expiresIn: 3600,
      tenantId: "mock-tenant-id",
    });
  } catch (error) {
    console.error("Login error:", error);
    return json({ message: "Internal server error" }, { status: 500 });
  }
};
