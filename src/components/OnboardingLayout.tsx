"use client";

import { ReactNode } from "react";
import { Layers } from "lucide-react";
import Link from "next/link";

interface OnboardingLayoutProps {
  children: ReactNode;
  currentStep: number;
  totalSteps?: number;
}

export default function OnboardingLayout({
  children,
  currentStep,
  totalSteps = 3,
}: OnboardingLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 py-4">
        <div className="container mx-auto px-4">
          <Link href="/" className="flex items-center gap-2">
            <Layers className="h-6 w-6 text-blue-600" />
            <span className="text-xl font-bold">Multi-Tenant CRM</span>
          </Link>
        </div>
      </header>

      {/* Progress indicator */}
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between max-w-3xl mx-auto mb-8">
          {Array.from({ length: totalSteps }).map((_, index) => (
            <div key={index} className="flex items-center">
              <div
                className={`rounded-full h-10 w-10 flex items-center justify-center ${
                  index + 1 <= currentStep
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-gray-500"
                }`}
              >
                {index + 1}
              </div>
              {index < totalSteps - 1 && (
                <div
                  className={`h-1 w-16 sm:w-24 md:w-32 ${
                    index + 1 < currentStep ? "bg-blue-600" : "bg-gray-200"
                  }`}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Main content */}
      <main className="flex-grow container mx-auto px-4 py-6">
        <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          {children}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-4 mt-auto">
        <div className="container mx-auto px-4 text-center text-sm text-gray-500">
          © {new Date().getFullYear()} Multi-Tenant CRM. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
