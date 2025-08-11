import Image from "next/image";
import { redirect } from "next/navigation";

import { getPatient, getUser } from "@/lib/actions/patient.actions";
import RegisterForm from "@/components/forms/RegisterForm";

const register = async (props: SearchParamProps) => {
  const { userId } = await props.params;

  const user = await getUser(userId);
  const patient = await getPatient(userId);

  if (!user) {
    // You can show a loading spinner, error message, or redirect
    return <div>User not found or loading...</div>;
  }

  if (patient && patient.registrationComplete)
    redirect(`/patients/${userId}/new-appointment`);

  return (
    <div className="flex h-screen max-h-screen">
      <section className="remove-scrollbar container">
        <div className="sub-container max-w-[860px] flex-1 flex-col py-10">
          <Image
            src="/assets/icons/logo-full.svg"
            height={1000}
            width={1000}
            alt="patient"
            className="mb-12 h-10 w-fit"
          />

          <RegisterForm user={user} />

          <p className="copyright py-12">© 2025 MediMind</p>
        </div>
      </section>

      <Image
        src="/assets/images/register-img.png"
        height={1000}
        width={1000}
        alt="patient"
        className="side-img max-w-[390px]"
      />
    </div>
  );
};

export default register;
