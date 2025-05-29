import { json } from "@remix-run/node";

interface LoaderArgs {
  request: Request;
  params: Record<string, string | undefined>;
}

export async function loader({ params, request }: LoaderArgs) {
  try {
    const { consentId } = params;
    if (!consentId) {
      return json({ message: "Consent ID is required" }, { status: 400 });
    }

    // Commented out actual API call to avoid breaking frontend during development
    /*
    const backendResponse = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/user/consents/${consentId}/history`,
      {
        method: "GET",
        credentials: "include",
        headers: {
          cookie: request.headers.get("cookie") || "",
        },
      }
    );

    if (!backendResponse.ok) {
      const errorData = await backendResponse.json().catch(() => ({}));
      return json(
        { message: errorData.message || "Failed to fetch consent history" },
        { status: backendResponse.status }
      );
    }

    const data = await backendResponse.json();
    return json(data);
    */

    // Mocked response to keep frontend functional
    return json({
      consentId,
      history: [
        {
          version: 1,
          acceptedAt: "2024-01-01T10:00:00Z",
          acceptedBy: "user@example.com",
        },
        {
          version: 2,
          acceptedAt: "2024-06-01T14:30:00Z",
          acceptedBy: "user@example.com",
        },
      ],
    });
  } catch (error) {
    console.error("Get consent history error:", error);
    return json({ message: "Internal server error" }, { status: 500 });
  }
}
