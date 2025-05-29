import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";

export const loader: LoaderFunction = async ({ request }) => {
  try {
    const url = new URL(request.url);
    const unread = url.searchParams.get("unread");
    const limit = url.searchParams.get("limit") || "20";

    /*
    // Build backend API URL with query params
    let apiUrl = `${process.env.API_URL}/dashboard/notifications?limit=${limit}`;
    if (unread === "true") {
      apiUrl += `&unread=true`;
    }

    // Forward cookies for authentication
    const cookie = request.headers.get("Cookie");

    const response = await fetch(apiUrl, {
      method: "GET",
      headers: {
        Cookie: cookie ?? "",
      },
      credentials: "include",
    });

    if (!response.ok) {
      return json(
        { message: "Failed to fetch notifications" },
        { status: response.status }
      );
    }

    const data = await response.json();
    return json(data);
    */

    // Mock data response while backend is not available
    return json({
      notifications: [],
      message: "Mock notifications response - backend disabled",
    });
  } catch (error) {
    console.error("Get notifications error:", error);
    return json({ message: "Internal server error" }, { status: 500 });
  }
};
