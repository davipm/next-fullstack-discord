import { PropsChildren } from "@/types";

export default function AuthLayout({ children }: PropsChildren) {
  return (
    <div className="h-full flex items-center justify-center">{children}</div>
  );
}
