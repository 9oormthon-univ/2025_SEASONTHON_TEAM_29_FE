import SignupWizard from '@/components/auth/SignupWizard';

export default function SignUpPage() {
  return (
    <main className="mx-auto h-dvh w-full max-w-[420px] overflow-hidden pb-[calc(env(safe-area-inset-bottom)+16px)]">
      <SignupWizard />
    </main>
  );
}