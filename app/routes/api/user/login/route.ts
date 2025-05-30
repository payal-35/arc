import type { ActionFunction } from "@remix-run/node";
import { json } from "@remix-run/node";

export const action: ActionFunction = async ({ request }) => {
  try {
    const { email, password } = await request.json();

    const response = await fetch("http://183.83.220.58:20021/api/v1/auth/user/login", {
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

    const remixResponse = json(
      {
        userId: data.userId,
        email: data.email,
        phone: data.phone,
        tenants: data.tenants,
      },
      { status: 200 }
    );

    if (cookies) {
      remixResponse.headers.append("Set-Cookie", cookies);
    }

    return remixResponse;
  } catch (error) {
    console.error("Login error:", error);
    return json({ message: "Internal server error" }, { status: 500 });
  }
};
