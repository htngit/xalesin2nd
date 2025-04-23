import Footer from "@/components/footer";
import Hero from "@/components/hero";
import Navbar from "@/components/navbar";
import {
  ArrowUpRight,
  CheckCircle2,
  Shield,
  Users,
  Database,
  Layers,
  UserCog,
  BarChart,
} from "lucide-react";
import { createClient } from "../../supabase/server";
import Link from "next/link";

export default async function Home() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <Navbar />
      <Hero />

      {/* Features Section */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">
              Comprehensive CRM Features
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Our multi-tenant CRM provides all the tools you need to manage
              customer relationships with robust isolation between
              organizational units.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: <Layers className="w-6 h-6" />,
                title: "Multi-Level Isolation",
                description:
                  "Complete data separation between tenants, departments, and teams",
              },
              {
                icon: <Shield className="w-6 h-6" />,
                title: "Role-Based Access Control",
                description:
                  "Granular permissions with context-aware authorization",
              },
              {
                icon: <Users className="w-6 h-6" />,
                title: "Team Management",
                description:
                  "Create and manage departments and teams with proper hierarchies",
              },
              {
                icon: <Database className="w-6 h-6" />,
                title: "Customer Records",
                description:
                  "Manage contacts, companies, and opportunities with proper access controls",
              },
              {
                icon: <UserCog className="w-6 h-6" />,
                title: "User Context Switching",
                description:
                  "Seamlessly switch between roles and organizational contexts",
              },
              {
                icon: <BarChart className="w-6 h-6" />,
                title: "Activity Tracking",
                description:
                  "Comprehensive logging of user actions and customer interactions",
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-100"
              >
                <div className="text-blue-600 mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">How It Works</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Our CRM system is designed with multi-level isolation at its core
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 relative">
              <div className="absolute -top-4 -left-4 w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">
                1
              </div>
              <h3 className="text-xl font-semibold mb-3 mt-2">
                Tenant Isolation
              </h3>
              <p className="text-gray-600">
                Each organization gets a completely isolated environment with
                its own data, users, and settings
              </p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 relative">
              <div className="absolute -top-4 -left-4 w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">
                2
              </div>
              <h3 className="text-xl font-semibold mb-3 mt-2">
                Department Scoping
              </h3>
              <p className="text-gray-600">
                Within each tenant, departments have their own data scope with
                controlled access to shared resources
              </p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 relative">
              <div className="absolute -top-4 -left-4 w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">
                3
              </div>
              <h3 className="text-xl font-semibold mb-3 mt-2">
                Team Collaboration
              </h3>
              <p className="text-gray-600">
                Teams within departments collaborate on customer records with
                appropriate permissions
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-blue-600 text-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold mb-2">99.9%</div>
              <div className="text-blue-100">Data Isolation</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">50+</div>
              <div className="text-blue-100">Role Configurations</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">100%</div>
              <div className="text-blue-100">Access Control</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">24/7</div>
              <div className="text-blue-100">Activity Monitoring</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Transform Your CRM Experience?
          </h2>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
            Join organizations that trust our multi-tenant CRM system for
            secure, isolated customer relationship management.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/dashboard"
              className="inline-flex items-center px-6 py-3 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Access Dashboard
              <ArrowUpRight className="ml-2 w-4 h-4" />
            </Link>
            <Link
              href="/sign-up"
              className="inline-flex items-center px-6 py-3 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
            >
              Create Account
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
