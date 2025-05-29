import type { LoaderFunction, ActionFunction } from "@remix-run/node";
import { json } from "@remix-run/node";

// GET /api/user/grievances
export const loader: LoaderFunction = async ({ request }) => {
  try {
    const url = new URL(request.url);
    const tenantId = url.searchParams.get("tenantId");
    const status = url.searchParams.get("status");

    if (!tenantId) {
      return json({ message: "Missing tenant ID" }, { status: 400 });
    }

    /*
    // Uncomment this block when backend is ready
    let apiUrl = `${process.env.API_URL}/user/grievances?tenantId=${tenantId}`;
    if (status) {
      apiUrl += `&status=${status}`;
    }

    const cookie = request.headers.get("Cookie");

    const response = await fetch(apiUrl, {
      method: "GET",
      headers: {
        Cookie: cookie ?? "",
      },
      credentials: "include",
    });

    if (!response.ok) {
      return json({ message: "Failed to fetch grievances" }, { status: response.status });
    }

    const data = await response.json();
    return json(data);
    */

    // Mocked response
    return json({
      grievances: [
        {
          id: "g1",
          tenantId,
          subject: "Delay in service",
          details: "It has been pending for 3 days.",
          type: "Service",
          status: status ?? "pending",
          createdAt: new Date().toISOString(),
        },
        {
          id: "g2",
          tenantId,
          subject: "Incorrect billing",
          details: "Charged wrongly for a service.",
          type: "Billing",
          status: status ?? "resolved",
          createdAt: new Date().toISOString(),
        },
      ],
    });
  } catch (error) {
    console.error("Get grievances error:", error);
    return json({ message: "Internal server error" }, { status: 500 });
  }
};

// POST /api/user/grievances
export const action: ActionFunction = async ({ request }) => {
  try {
    const cookie = request.headers.get("Cookie");
    const body = await request.json();

    const { tenantId, subject, details, type } = body;

    if (!tenantId || !subject || !details || !type) {
      return json({ message: "Missing required fields" }, { status: 400 });
    }

    /*
    // Uncomment this block when backend is ready
    const response = await fetch(`${process.env.API_URL}/user/grievances`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: cookie ?? "",
      },
      body: JSON.stringify(body),
      credentials: "include",
    });

    if (!response.ok) {
      return json({ message: "Failed to create grievance" }, { status: response.status });
    }

    const data = await response.json();
    return json(data, { status: 201 });
    */

    // Mocked creation response
    return json(
      {
        id: "mock-grievance-id",
        tenantId,
        subject,
        details,
        type,
        status: "pending",
        createdAt: new Date().toISOString(),
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Create grievance error:", error);
    return json({ message: "Internal server error" }, { status: 500 });
  }
};
