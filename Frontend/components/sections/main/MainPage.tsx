"use client";
import React, { useState } from "react";
import OnboardingHomepage from "../onboarding/onboarding_homepage/OnboardingHomepage";
import Login from "../Login/Login";
import { useAuthStore } from "@/state/authStore";
import { redirect } from "next/navigation";

function MainPage() {
  const [done, isDone] = useState(false);

  useAuthStore(state => state.isAuthenticated) ? isDone(true) : redirect("/")
  return <>{done ? <OnboardingHomepage /> : <Login isDone={isDone} />}</>;
}

export default MainPage;
