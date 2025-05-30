import type { ActionFunction } from "@remix-run/node";
import { json } from "@remix-run/node";

export const action: ActionFunction = async ({ request }) => {
  try {
    const { email, password } = await request.json();

    const response = await fetch(`http://183.83.220.58:20021/api/v1/auth/organization/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return json(
        { message: errorData.message || "Invalid credentials" },
        { status: response.status }
      );
    }

    const data = await response.json();

    const cookies = response.headers.get("set-cookie");

    const headers: HeadersInit = {};
    if (cookies) {
      headers["Set-Cookie"] = cookies;
    }

    return json(
      {
        expiresIn: data.expiresIn,
        tenantId: data.tenantId,
      },
      { headers }
    );
  } catch (error) {
    console.error("Login error:", error);
    return json({ message: "Internal server error" }, { status: 500 });
  }
};
