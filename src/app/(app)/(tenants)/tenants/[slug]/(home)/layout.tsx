import { Footer } from "@/modules/tenants/ui/components/footer";
import Navbar, { NavbarSkeleton } from "@/modules/tenants/ui/components/navbar";
import { Suspense } from "react";

interface LayoutProps {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
}

const Layout = async ({ children, params }: LayoutProps) => {
  const { slug } = await params;

  return (
    <div className="min-h-screen bg-[#F4F4F0] flex flex-col">
      <Suspense fallback={<NavbarSkeleton />}>
        <Navbar slug={slug} />
      </Suspense>

      <div className="flex-1">
        <div className="max-w-(--breakpoint-xl) mx-auto">{children}</div>
      </div>
      <Footer />
    </div>
  );
};

export default Layout;
