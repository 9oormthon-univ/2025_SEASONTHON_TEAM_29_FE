import LoginForm from '@/components/auth/LoginForm';

export default function LoginPage() {
  return (
    <main className="mx-auto max-w-[420px] min-h-dvh px-5 pb-[calc(env(safe-area-inset-bottom)+16px)]">
      <LoginForm />
    </main>
  );
}