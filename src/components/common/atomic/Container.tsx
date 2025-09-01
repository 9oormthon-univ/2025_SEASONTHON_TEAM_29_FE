import { cn } from "@/utills/cn";

export function Container({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('mx-auto w-full max-w-6xl', className)} {...props} />;
}