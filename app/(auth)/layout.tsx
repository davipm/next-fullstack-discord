import { PropsChildren } from "@/types";

export default function AuthLayout({ children }: PropsChildren) {
  return (
    <div className="h-screen flex items-center justify-center">{children}</div>
  );
}
