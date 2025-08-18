"use client";
import React, { useState } from "react";
import OnboardingHomepage from "../onboarding/onboarding_homepage/OnboardingHomepage";
import Login from "../Login/Login";
// import { useAuthStore } from "@/state/authStore";
import { redirect } from "next/navigation";

function MainPage() {
  const [done, isDone] = useState(false);

  return <>{done ? <OnboardingHomepage /> : <Login isDone={isDone} />}</>;
}

export default MainPage;
