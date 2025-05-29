import type { ActionFunction } from "@remix-run/node";
import { json } from "@remix-run/node";

export const action: ActionFunction = async ({ request }) => {
  try {
    if (request.method !== "PUT") {
      return json({ message: "Method Not Allowed" }, { status: 405 });
    }

    /*
    const cookie = request.headers.get("Cookie");

    const response = await fetch(`${process.env.API_URL}/dashboard/notifications/read-all`, {
      method: "PUT",
      headers: {
        Cookie: cookie ?? "",
      },
      credentials: "include",
    });

    if (!response.ok) {
      return json(
        { message: "Failed to mark all notifications as read" },
        { status: response.status }
      );
    }
    */

    // Mock success response while backend is commented out
    return json({ message: "All notifications marked as read" });
  } catch (error) {
    console.error("Mark all notifications as read error:", error);
    return json({ message: "Internal server error" }, { status: 500 });
  }
};
