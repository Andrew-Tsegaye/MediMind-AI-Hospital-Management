import Image from "next/image";
import Link from "next/link";

import { PatientForm } from "@/components/forms/PatientForm";
import { PasskeyModal } from "@/components/PasskeyModal";

interface PageProps {
  params?: { [key: string]: string };
  searchParams?: { [key: string]: string | string[] | undefined };
}

const Home = ({ searchParams }: PageProps) => {
  const isAdmin = searchParams?.admin === "true";

  return (
    <main className="flex w-full h-screen overflow-hidden bg-dark-300 text-light-200">
      {/* Admin Login Modal */}
      {isAdmin && <PasskeyModal />}

      {/* Left Section: Background Image */}
      <div className="hidden xl:flex w-1/2">
        <Image
          src="/assets/images/onboarding-img.png"
          alt="Patient Onboarding"
          width={1000}
          height={1000}
          className="h-full w-full object-cover"
          priority
        />
      </div>

      {/* Right Section: Form */}
      <section className="flex flex-col justify-center w-full max-w-[496px] px-6 sm:px-8 py-12 mx-auto">
        {/* Logo */}
        <Image
          src="/assets/icons/logo-full.svg"
          width={1000}
          height={1000}
          alt="CarePluse Logo"
          className="mb-12 h-10 w-auto"
          priority
        />

        {/* Patient Form */}
        <PatientForm />

        {/* Footer Text */}
        <footer className="mt-20 flex justify-between text-xs text-dark-600">
          <span>© 2025 MediMind</span>
          <Link
            href="/?admin=true"
            className="text-purple-600 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-green-500"
          >
            Admin
          </Link>
        </footer>
      </section>
    </main>
  );
};

export default Home;
