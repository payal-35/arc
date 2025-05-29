import type { ActionFunction } from "@remix-run/node";
import { json } from "@remix-run/node";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "";

export const action: ActionFunction = async ({ request }) => {
  try {
    const { email, name, phone, password, role } = await request.json();

    // Commented-out actual API call for now to prevent frontend errors
    /*
    const response = await fetch(`${API_URL}/admin/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, name, phone, password, role }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return json(
        { message: errorData.message || "Signup failed" },
        { status: response.status }
      );
    }

    const data = await response.json();

    return json({
      tenant_id: data.tenant_id,
      user_id: data.user_id,
      message: data.message,
    });
    */

    // Mocked successful response
    console.log("Mock signup payload:", { email, name, phone, password, role });
    return json({
      tenant_id: "mock-tenant-id",
      user_id: "mock-user-id",
      message: "Signup successful (mock)",
    });
  } catch (error) {
    console.error("Signup error:", error);
    return json({ message: "Internal server error" }, { status: 500 });
  }
};
