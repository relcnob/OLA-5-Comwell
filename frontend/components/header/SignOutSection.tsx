import Link from "next/link";
import { useContext } from "react";
import { AuthContext } from "@/context/AuthContext";
import "dotenv/config";
import { deleteCookie } from "cookies-next";

export default function SignOutSection({
  isLoginVisible,
}: {
  isLoginVisible: boolean;
}) {
  const { onSignOutSuccess } = useContext(AuthContext);

  async function handleSignOut() {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BE_HOST}/auth/logout`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      }
    );
    if (!response.ok) {
      console.log(response);
      return false;
    } else {
      deleteCookie("token_fe");
      onSignOutSuccess();
    }
  }

  return (
    <section
      className={`absolute flex flex-col px-4 pt-6 pb-3 bg-slate-50 rounded-lg right-0 top-16 w-64 gap-4 ${
        isLoginVisible ? "" : "hidden"
      }`}
    >
      <Link href="/dashboard" className={`transition hover:text-charcoal-100`}>
        Dashboard
      </Link>
      <Link href="#" className={`transition hover:text-charcoal-100`}>
        Frequently Asked Questions
      </Link>
      <Link href="#" className={`transition hover:text-charcoal-100`}>
        Club offers
      </Link>
      <Link href="#" className={`transition hover:text-charcoal-100`}>
        Notifications
      </Link>
      <Link href="/dashboard" className={`transition hover:text-charcoal-100`}>
        Profile Settings
      </Link>

      <div className="py-5 px-8 flex items-center justify-center w-full">
        <button
          className="bg-white rounded-full border border-gray-200 w-full py-4"
          onClick={handleSignOut}
        >
          Sign out
        </button>
      </div>
    </section>
  );
}
