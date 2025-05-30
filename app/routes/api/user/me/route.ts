import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";

export const loader: LoaderFunction = async ({ request }) => {
  try {
    const cookie = request.headers.get("Cookie"); 

    const response = await fetch(`http://183.83.220.58:20021/api/v1/auth/user/me`, {
      method: "GET",
      headers: {
        Cookie: cookie ?? "",
      },
    });

    if (!response.ok) {
      return json({ message: "Not authenticated" }, { status: response.status });
    }

    const data = await response.json();
    return json(data);
  } catch (error) {
    console.error("Get user info error:", error);
    return json({ message: "Internal server error" }, { status: 500 });
  }
};
