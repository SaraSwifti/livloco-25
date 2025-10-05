//businesses/add/page.jsx

// app/(whatever)/businesses/add/page.jsx

import BusinessAddForm from "@/components/BusinessAddForm.jsx";
import { getServerSession } from "next-auth";
import { authOptions } from "@/utils/authOptions"; // keep your existing path
import connectDB from "@/config/database";
import User from "@/models/User";

export default async function AddBusinessPage() {
  // 1) Session first
  const session = await getServerSession(authOptions);
  const sessionUser = session?.user || {};

  let userEmail = (sessionUser.email || "").toLowerCase();
  let userFullName = sessionUser.full_name || "";
  let userPhoneE164 = sessionUser.phone || ""; // e.g. "+16165551212"

  // 2) Fallback to DB profile if session doesn't include these fields
  if (userEmail && (!userFullName || !userPhoneE164)) {
    await connectDB();
    const u = await User.findOne({ email: userEmail })
      .select("full_name phone")
      .lean();
    if (u) {
      if (!userFullName) userFullName = u.full_name || "";
      if (!userPhoneE164) userPhoneE164 = u.phone || "";
    }
  }

  return (
    <section>
      <div className="container m-auto max-w-2xl py-24">
        <div className="bg-white px-6 py-8 mb-4 rounded-md shadow-md border m-4 md:m-0">
          <BusinessAddForm
            userEmail={userEmail}
            userFullName={userFullName}
            userPhoneE164={userPhoneE164}
          />
        </div>
      </div>
    </section>
  );
}
