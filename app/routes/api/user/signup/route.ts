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

    const response= await fetch("http://183.83.220.58:20021/api/v1/auth/user/signup", {
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

  } catch (error) {
    console.error("Signup error:", error);
    return json({ message: "Internal server error" }, { status: 500 });
  }
};
