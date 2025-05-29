import type { ActionFunction } from "@remix-run/node"
import { json } from "@remix-run/node"

export const action: ActionFunction = async ({ request }) => {
  try {
    // Forward cookies from the incoming request to backend
    const cookie = request.headers.get("Cookie")

    const response = await fetch(`${process.env.API_URL}/user/logout`, {
      method: "POST",
      headers: {
        Cookie: cookie ?? "",
      },
      credentials: "include",
    })

    if (!response.ok) {
      const errorData = await response.json()
      return json(
        { message: errorData.message || "Logout failed" },
        { status: response.status }
      )
    }

    const cookies = response.headers.get("set-cookie")

    const remixResponse = json({ message: "Logged out successfully" })

    if (cookies) {
      remixResponse.headers.append("Set-Cookie", cookies)
    }

    return remixResponse
  } catch (error) {
    console.error("Logout error:", error)
    return json({ message: "Internal server error" }, { status: 500 })
  }
}
