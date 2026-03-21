import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { email, neighbourhood, scorecard } = await req.json();

    if (!email || !email.includes("@")) {
      return NextResponse.json({ error: "Valid email required" }, { status: 400 });
    }

    const RESEND_KEY = process.env.RESEND_API_KEY;
    if (!RESEND_KEY) {
      console.error("RESEND_API_KEY not set");
      return NextResponse.json({ error: "Server configuration error" }, { status: 500 });
    }

    // 1. Add contact to Resend audience
    const audienceId = process.env.RESEND_AUDIENCE_ID;
    if (audienceId) {
      await fetch(`https://api.resend.com/audiences/${audienceId}/contacts`, {
        method: "POST",
        headers: { Authorization: `Bearer ${RESEND_KEY}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          first_name: neighbourhood || "Subscriber",
          unsubscribed: false,
        }),
      });
    }

    // 2. Send welcome email
    const fromEmail = process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev";
    await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${RESEND_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: `Real Data IQ <${fromEmail}>`,
        to: [email],
        subject: scorecard ? `Your Free ${neighbourhood || "Toronto"} Neighbourhood Scorecard | Real Data IQ` : "Welcome to Real Data IQ — Toronto Neighbourhood Intelligence",
        html: `
          <div style="font-family: -apple-system, sans-serif; max-width: 560px; margin: 0 auto; padding: 40px 20px;">
            <h1 style="font-size: 24px; font-weight: 300; color: #1a1a1a; margin-bottom: 16px;">Welcome to Real Data IQ</h1>
            <div style="width: 48px; height: 1px; background: #1a1a1a; margin-bottom: 24px;"></div>
            <p style="font-size: 15px; color: #555; line-height: 1.7;">
              You're now subscribed to the weekly neighbourhood intelligence brief. Every week you'll get:
            </p>
            <ul style="font-size: 15px; color: #555; line-height: 1.8; padding-left: 20px;">
              <li>Crime & safety trends across Toronto neighbourhoods</li>
              <li>New development pipeline updates</li>
              <li>School rating changes and family metrics</li>
              <li>Market movement signals and investment indicators</li>
            </ul>
            ${neighbourhood ? `<p style="font-size: 14px; color: #999; margin-top: 24px;">You signed up from the <strong>${neighbourhood}</strong> neighbourhood page — we'll highlight updates relevant to that area.</p>` : ""}
            <div style="margin-top: 32px; padding-top: 24px; border-top: 1px solid #eee;">
              <p style="font-size: 12px; color: #999;">Real Data IQ — Neighbourhood intelligence for Toronto's 158 neighbourhoods.</p>
              <p style="font-size: 12px; color: #999;">You can unsubscribe at any time by replying to any email.</p>
            </div>
          </div>
        `,
      }),
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Subscribe error:", err);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
