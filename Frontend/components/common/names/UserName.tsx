"use client";
import { useUserProfileStore } from "@/state/user";
import { formatName } from "@/helpers/formatName";
import React from "react";

const UserName = () => {
  const { profile } = useUserProfileStore();

  return <span>{formatName(profile?.full_name ?? "Guest")}</span>;
};

export default UserName;
