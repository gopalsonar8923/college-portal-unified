
import { ReactNode, useState } from "react";
import { Header } from "./Header";
import { SidebarNav } from "./SidebarNav";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

interface DashboardLayoutProps {
  children: ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col w-full">
      <Header />
      <div className="flex-1 flex w-full">
        <SidebarProvider>
          <div className="flex-1 flex w-full min-h-0">
            <SidebarNav />
            <main className="flex-1 p-3 sm:p-4 md:p-6 overflow-auto w-full min-w-0">
              <div className="w-full max-w-full">
                <div className="flex mb-4">
                  <SidebarTrigger />
                </div>
                <div className="w-full max-w-full overflow-hidden">
                  {children}
                </div>
              </div>
            </main>
          </div>
        </SidebarProvider>
      </div>
    </div>
  );
}
