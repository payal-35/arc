import type { LoaderFunction, ActionFunction } from "@remix-run/node";
import { json } from "@remix-run/node";

export const loader: LoaderFunction = async ({ request }) => {
  try {
    /*
    // Forward client cookies to backend
    const cookieHeader = request.headers.get("cookie") ?? "";

    // Call your Go backend API
    const response = await fetch(`${process.env.API_URL}/admin/purposes`, {
      method: "GET",
      headers: {
        cookie: cookieHeader,
      },
      credentials: "include",
    });

    if (!response.ok) {
      return json(
        { message: "Failed to fetch purposes" },
        { status: response.status }
      );
    }

    const data = await response.json();
    return json(data);
    */

    // Mock response for frontend rendering
    return json([
      {
        id: "mock-purpose-1",
        name: "Purpose 1",
        description: "This is a mock purpose description.",
      },
      {
        id: "mock-purpose-2",
        name: "Purpose 2",
        description: "Another mock purpose.",
      },
    ]);
  } catch (error) {
    console.error("Get purposes error:", error);
    return json({ message: "Internal server error" }, { status: 500 });
  }
};

export const action: ActionFunction = async ({ request }) => {
  try {
    const body = await request.json();

    if (!body.name || !body.description) {
      return json({ message: "Missing required fields" }, { status: 400 });
    }

    /*
    // Forward client cookies to backend
    const cookieHeader = request.headers.get("cookie") ?? "";

    // Call your Go backend API
    const response = await fetch(`${process.env.API_URL}/admin/purposes`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        cookie: cookieHeader,
      },
      body: JSON.stringify(body),
      credentials: "include",
    });

    if (!response.ok) {
      return json(
        { message: "Failed to create purpose" },
        { status: response.status }
      );
    }

    const data = await response.json();
    return json(data, { status: 201 });
    */

    // Mock successful creation response
    return json(
      {
        id: "mock-purpose-new",
        name: body.name,
        description: body.description,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Create purpose error:", error);
    return json({ message: "Internal server error" }, { status: 500 });
  }
};
