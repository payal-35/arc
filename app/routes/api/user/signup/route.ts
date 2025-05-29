import type { ActionFunction } from "@remix-run/node";
import { json } from "@remix-run/node";

export const action: ActionFunction = async ({ request }) => {
  try {
    const {
      email,
      first_name,
      last_name,
      phone,
      age,
      location,
      password,
    } = await request.json();

    /*
    const response = await fetch(`${process.env.API_URL}/auth/user/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        first_name,
        last_name,
        phone,
        age,
        location,
        password,
      }),
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
      user_id: data.user_id,
      message: data.message,
    });
    */

    // Mock success response while backend is disabled
    return json({
      user_id: "mock-user-id-123",
      message: "Signup successful (mock response)",
    });
  } catch (error) {
    console.error("Signup error:", error);
    return json({ message: "Internal server error" }, { status: 500 });
  }
};
