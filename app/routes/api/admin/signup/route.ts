import type { ActionFunction } from "@remix-run/node";
import { json } from "@remix-run/node";

export const action: ActionFunction = async ({ request }) => {
  try {
    const { email, name, phone, password, role } = await request.json();

    const response = await fetch("http://183.83.220.58:20021/api/v1/auth/admin/signup", {
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

  } catch (error) {
    console.error("Signup error:", error);
    return json({ message: "Internal server error" }, { status: 500 });
  }
};
