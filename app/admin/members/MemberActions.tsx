"use client";

import { useTransition } from "react";
import { resetPassword, deleteUser } from "@/app/actions/admin";

export default function MemberActions({ userId }: { userId: string }) {
  const [isPending, startTransition] = useTransition();

  const handleReset = () => {
    if (confirm('OVERRIDE PASS_KEY TO "reset123"?')) {
      startTransition(async () => {
        const formData = new FormData();
        formData.append("userId", userId);
        await resetPassword(formData);
      });
    }
  };

  const handleDelete = () => {
    if (confirm('PURGE NODE FROM SYSTEM?')) {
      startTransition(async () => {
        const formData = new FormData();
        formData.append("userId", userId);
        await deleteUser(formData);
      });
    }
  };

  return (
    <>
      <button
        type="button"
        disabled={isPending}
        className="text-orange-500 border border-orange-500/30 hover:bg-orange-500 hover:text-black font-black text-[9px] px-3 py-1.5 transition-all w-32 tracking-widest uppercase disabled:opacity-50"
        onClick={handleReset}
      >
        [ OVERRIDE_KEY ]
      </button>
      <button
        type="button"
        disabled={isPending}
        className="text-red-500 border border-red-500/30 hover:bg-red-500 hover:text-black font-black text-[9px] px-3 py-1.5 transition-all w-32 tracking-widest uppercase disabled:opacity-50"
        onClick={handleDelete}
      >
        [ PURGE_NODE ]
      </button>
    </>
  );
}
