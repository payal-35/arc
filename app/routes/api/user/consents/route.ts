import type { LoaderFunction, ActionFunction } from "@remix-run/node";
import { json } from "@remix-run/node";

// GET /api/user/consents
export const loader: LoaderFunction = async ({ request }) => {
  try {
    const cookie = request.headers.get("Cookie");

    // Commented out actual backend call for now
    /*
    const response = await fetch(`${process.env.API_URL}/user/consents`, {
      method: "GET",
      headers: {
        Cookie: cookie ?? "",
      },
      credentials: "include",
    });

    if (!response.ok) {
      return json({ message: "Failed to fetch consents" }, { status: response.status });
    }

    const data = await response.json();
    return json(data);
    */

    // Mock response
    return json({
      consents: [
        {
          id: "consent-1",
          title: "Privacy Policy",
          accepted: true,
          acceptedAt: "2024-01-01T12:00:00Z",
        },
        {
          id: "consent-2",
          title: "Terms of Service",
          accepted: false,
          acceptedAt: null,
        },
      ],
    });
  } catch (error) {
    console.error("Get consents error:", error);
    return json({ message: "Internal server error" }, { status: 500 });
  }
};

// PUT /api/user/consents
export const action: ActionFunction = async ({ request }) => {
  try {
    const cookie = request.headers.get("Cookie");
    const body = await request.json();

    // Commented out actual backend call for now
    /*
    const response = await fetch(`${process.env.API_URL}/user/consents`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Cookie: cookie ?? "",
      },
      body: JSON.stringify(body),
      credentials: "include",
    });

    if (!response.ok) {
      return json({ message: "Failed to update consents" }, { status: response.status });
    }

    return json({ message: "Consents updated successfully" });
    */

    // Simulate success
    console.log("Mock update consents payload:", body);
    return json({ message: "Consents updated successfully (mock)" });
  } catch (error) {
    console.error("Update consents error:", error);
    return json({ message: "Internal server error" }, { status: 500 });
  }
};
