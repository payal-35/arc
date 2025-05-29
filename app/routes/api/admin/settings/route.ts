import type { LoaderFunction, ActionFunction } from "@remix-run/node";
import { json } from "@remix-run/node";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "";

export const loader: LoaderFunction = async ({ request }) => {
  try {
    const cookieHeader = request.headers.get("cookie") ?? "";

    /*
    const response = await fetch(`${API_URL}/admin/settings`, {
      method: "GET",
      headers: {
        cookie: cookieHeader,
      },
      credentials: "include",
    });

    if (!response.ok) {
      return json({ message: "Failed to fetch settings" }, { status: response.status });
    }

    const data = await response.json();
    return json(data);
    */

    // Mock settings data for frontend
    return json({
      emailNotifications: true,
      smsNotifications: false,
      theme: "light",
    });
  } catch (error) {
    console.error("Get settings error:", error);
    return json({ message: "Internal server error" }, { status: 500 });
  }
};

export const action: ActionFunction = async ({ request }) => {
  try {
    const cookieHeader = request.headers.get("cookie") ?? "";
    const body = await request.json();

    /*
    const response = await fetch(`${API_URL}/admin/settings`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        cookie: cookieHeader,
      },
      body: JSON.stringify(body),
      credentials: "include",
    });

    if (!response.ok) {
      return json({ message: "Failed to update settings" }, { status: response.status });
    }

    return json({ message: "Settings updated successfully" });
    */

    // Mock success response
    console.log("Mock update settings with:", body);
    return json({ message: "Mock: Settings updated successfully" });
  } catch (error) {
    console.error("Update settings error:", error);
    return json({ message: "Internal server error" }, { status: 500 });
  }
};
