import type { ActionFunction } from "@remix-run/node";
import { json } from "@remix-run/node";

export const action: ActionFunction = async ({ request }) => {
  try {
    const { email, password } = await request.json();

    /*
    // Uncomment this block when backend is ready
    const response = await fetch(`${process.env.API_URL}/auth/user/login`, {
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
    */

    // Mocked login success response
    return json(
      {
        userId: "mock-user-id",
        email,
        phone: "+1234567890",
        tenants: [
          { id: "tenant-1", name: "Tenant One" },
          { id: "tenant-2", name: "Tenant Two" },
        ],
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Login error:", error);
    return json({ message: "Internal server error" }, { status: 500 });
  }
};
