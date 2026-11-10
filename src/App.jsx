import { Navigate, Route, Routes } from "react-router-dom";
import { lazy, Suspense } from "react";

const AlignnaV2 = lazy(() => import("./pages/AlignnaV2"));
const AlignnaThankYou = lazy(() => import("./pages/AlignnaThankYou"));

function LandingFallback() {
  return (
    <div
      role="status"
      aria-label="Loading"
      className="min-h-screen w-full bg-[#f7f5f0] motion-safe:animate-pulse"
    />
  );
}

export default function App() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <Suspense fallback={<LandingFallback />}>
            <AlignnaV2 />
          </Suspense>
        }
      />
      <Route
        path="/thank-you-page"
        element={
          <Suspense fallback={<LandingFallback />}>
            <AlignnaThankYou />
          </Suspense>
        }
      />
      <Route path="/alignna-v2" element={<Navigate to="/" replace />} />
      <Route
        path="/alignna/thank-you"
        element={<Navigate to="/thank-you-page" replace />}
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
