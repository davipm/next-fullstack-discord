import NavigationSidebar from "@/components/navigation/navigation-sidebar";
import { PropsChildren } from "@/types";

export default function Layout({ children }: PropsChildren) {
  return (
    <section className="h-full">
      <div className="hidden md:flex h-full w-[72px] z-30 flex-col fixed inset-y-0">
        <NavigationSidebar />
      </div>
      <main className="md:pl-[72px] h-full">{children}</main>
    </section>
  );
}
