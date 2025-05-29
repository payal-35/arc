import type { ActionFunction } from "@remix-run/node";
import { json } from "@remix-run/node";

export const action: ActionFunction = async ({ request, params }) => {
  try {
    if (request.method !== "PUT") {
      return json({ message: "Method Not Allowed" }, { status: 405 });
    }

    const notificationId = params.id;
    if (!notificationId) {
      return json({ message: "Notification ID is required" }, { status: 400 });
    }

    /*
    // Forward the cookies from the client to the backend for authentication
    const cookie = request.headers.get("Cookie");

    const response = await fetch(
      `${process.env.API_URL}/dashboard/notifications/${notificationId}/read`,
      {
        method: "PUT",
        headers: {
          Cookie: cookie ?? "",
        },
        credentials: "include",
      }
    );

    if (!response.ok) {
      return json(
        { message: "Failed to mark notification as read" },
        { status: response.status }
      );
    }
    */

    // Mock response while backend is disabled
    return json({ message: "Notification marked as read" });
  } catch (error) {
    console.error("Mark notification as read error:", error);
    return json({ message: "Internal server error" }, { status: 500 });
  }
};
