// src/app/(public)/(auth)/callback/page.tsx
import { redirect } from 'next/navigation';

type Props = {
  searchParams: Record<string, string | string[] | undefined>;
};

export default function AuthCallbackPage({ searchParams }: Props) {
  const qs = new URLSearchParams(searchParams as Record<string, string>).toString();
  redirect(`/api/auth/callback?${qs}`);
}