import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";

export const loader: LoaderFunction = async ({ request }) => {
  try {
    /*
    // Uncomment this when backend is ready
    const cookie = request.headers.get("Cookie");

    const response = await fetch(`${process.env.API_URL}/user/me`, {
      method: "GET",
      headers: {
        Cookie: cookie ?? "",
      },
      credentials: "include",
    });

    if (!response.ok) {
      return json({ message: "Not authenticated" }, { status: response.status });
    }

    const data = await response.json();
    return json(data);
    */

    // Mocked user data while backend is disabled
    return json({
      userId: "mock-user-id",
      email: "mockuser@example.com",
      name: "Mock User",
      phone: "1234567890",
      tenants: [{ id: "tenant1", name: "Tenant One" }],
    });
  } catch (error) {
    console.error("Get user info error:", error);
    return json({ message: "Internal server error" }, { status: 500 });
  }
};
