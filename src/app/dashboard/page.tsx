"use client"

import React from "react";
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";

export default function DashBoardPage() {
  const { user, getUser } = useKindeBrowserClient();
  const alsoUser = getUser();

  console.log(alsoUser);
  return <div>YO {user?.email}</div>;
}
