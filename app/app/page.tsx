"use client";
import ProtectedRoute from "./components/ProtectedRoute";
import LandingPage from "./components/LandingPage";


export default function Home() {
  return (
    <>
      <ProtectedRoute>
        <LandingPage />
      </ProtectedRoute>
    </>
  );
}
