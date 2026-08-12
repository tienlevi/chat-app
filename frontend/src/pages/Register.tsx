import { RegisterForm } from "@/components/RegisterForm";
import Wordmark from "@/components/Wordmark";

function Register() {
  return (
    <>
      <div className="relative flex min-h-svh items-center justify-center overflow-hidden bg-background px-6 py-12">
        <div className="relative w-full max-w-md animate-in fade-in slide-in-from-bottom-4 duration-700">
          <Wordmark className="mb-8" />

          <div className="rounded-2xl border border-border bg-card px-8 py-10 shadow-sm sm:px-10 sm:py-12">
            <div className="mb-8 flex flex-col gap-1.5">
              <h1 className="font-display text-4xl leading-tight font-semibold text-foreground">
                Register
              </h1>
            </div>

            <RegisterForm />
          </div>
        </div>
      </div>
    </>
  );
}

export default Register;
