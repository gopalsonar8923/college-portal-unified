
import { ReactNode, useState } from "react";
import { Header } from "./Header";
import { SidebarNav } from "./SidebarNav";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

interface DashboardLayoutProps {
  children: ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex-1 flex">
        <SidebarProvider>
          <div className="flex-1 flex w-full">
            <SidebarNav />
            <main className="flex-1 p-6 overflow-auto">
              <div className="mx-auto">
                <div className="hidden md:flex mb-4">
                  <SidebarTrigger />
                </div>
                {children}
              </div>
            </main>
          </div>
        </SidebarProvider>
      </div>
    </div>
  );
}
