import Link from "next/link";
import {
  ArrowUpRight,
  Check,
  Layers,
  Shield,
  Users,
  Database,
} from "lucide-react";

export default function Hero() {
  return (
    <div className="relative overflow-hidden bg-white">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-purple-50 opacity-70" />

      <div className="relative pt-24 pb-32 sm:pt-32 sm:pb-40">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-5xl sm:text-6xl font-bold text-gray-900 mb-8 tracking-tight">
              Multi-Tenant{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                CRM
              </span>{" "}
              with Robust Isolation
            </h1>

            <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto leading-relaxed">
              A comprehensive customer relationship management system with
              multi-level isolation for tenants, departments, and teams. Secure,
              scalable, and built for enterprise.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                href="/dashboard"
                className="inline-flex items-center px-8 py-4 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors text-lg font-medium"
              >
                Access Dashboard
                <ArrowUpRight className="ml-2 w-5 h-5" />
              </Link>

              <Link
                href="/sign-up"
                className="inline-flex items-center px-8 py-4 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors text-lg font-medium"
              >
                Create Account
              </Link>
            </div>

            <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
              <div className="flex flex-col items-center p-4 bg-white rounded-lg shadow-sm border border-gray-100">
                <Layers className="w-8 h-8 text-blue-600 mb-3" />
                <h3 className="font-medium text-gray-900">
                  Multi-Level Isolation
                </h3>
                <p className="text-sm text-gray-600 text-center mt-2">
                  Tenant, department, and team-level data separation
                </p>
              </div>
              <div className="flex flex-col items-center p-4 bg-white rounded-lg shadow-sm border border-gray-100">
                <Shield className="w-8 h-8 text-blue-600 mb-3" />
                <h3 className="font-medium text-gray-900">Role-Based Access</h3>
                <p className="text-sm text-gray-600 text-center mt-2">
                  Granular permissions and access controls
                </p>
              </div>
              <div className="flex flex-col items-center p-4 bg-white rounded-lg shadow-sm border border-gray-100">
                <Users className="w-8 h-8 text-blue-600 mb-3" />
                <h3 className="font-medium text-gray-900">
                  Team Collaboration
                </h3>
                <p className="text-sm text-gray-600 text-center mt-2">
                  Seamless workflows across organizational units
                </p>
              </div>
              <div className="flex flex-col items-center p-4 bg-white rounded-lg shadow-sm border border-gray-100">
                <Database className="w-8 h-8 text-blue-600 mb-3" />
                <h3 className="font-medium text-gray-900">Secure Data</h3>
                <p className="text-sm text-gray-600 text-center mt-2">
                  Enterprise-grade security and data protection
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
