import type { ActionFunction } from "@remix-run/node";
import { json } from "@remix-run/node";

export const action: ActionFunction = async ({ request, params }) => {
  const purposeId = params.id;
  if (!purposeId) {
    return json({ message: "Purpose ID is required" }, { status: 400 });
  }

  try {
    const cookieHeader = request.headers.get("cookie") ?? "";

    if (request.method === "PUT") {
      const body = await request.json();

      if (!body.name || !body.description) {
        return json({ message: "Missing required fields" }, { status: 400 });
      }

      /*
      const response = await fetch(`${process.env.API_URL}/admin/purposes/${purposeId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          cookie: cookieHeader,
        },
        body: JSON.stringify(body),
        credentials: "include",
      });

      if (!response.ok) {
        return json({ message: "Failed to update purpose" }, { status: response.status });
      }

      return json({ message: "Purpose updated successfully" });
      */

      // Mock success response
      return json({ message: "Mock: Purpose updated successfully" });
    } else if (request.method === "DELETE") {
      /*
      const response = await fetch(`${process.env.API_URL}/admin/purposes/${purposeId}`, {
        method: "DELETE",
        headers: {
          cookie: cookieHeader,
        },
        credentials: "include",
      });

      if (!response.ok) {
        return json({ message: "Failed to delete purpose" }, { status: response.status });
      }

      return json({ message: "Purpose deleted successfully" });
      */

      // Mock success response
      return json({ message: "Mock: Purpose deleted successfully" });
    } else {
      return json({ message: "Method not allowed" }, { status: 405 });
    }
  } catch (error) {
    console.error("Purpose action error:", error);
    return json({ message: "Internal server error" }, { status: 500 });
  }
};
