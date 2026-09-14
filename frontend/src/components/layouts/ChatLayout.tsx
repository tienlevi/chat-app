import React from "react";
import { TooltipProvider } from "@/components/ui/tooltip";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import NavRail from "@/components/NavRail";

function ChatLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <TooltipProvider>
        <div className="relative flex h-svh flex-col overflow-hidden bg-background">
          <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
            <div className="absolute -top-40 -left-32 size-[520px] rounded-full bg-primary/12 blur-3xl animate-float-slow" />
            <div className="absolute -right-40 -bottom-48 size-[560px] rounded-full bg-accent/40 blur-3xl animate-float-slower" />
            <div className="absolute inset-0 bg-grain opacity-[0.035] mix-blend-multiply dark:opacity-[0.05] dark:mix-blend-screen" />
          </div>

          <LanguageSwitcher className="absolute top-6 right-8 z-20 hidden xl:inline-flex" />

          <div className="flex flex-1 gap-3 p-3">
            <div className="w-[5%] hidden shrink-0 flex-col items-center gap-1 rounded-3xl border border-border bg-card py-5 md:flex">
              <NavRail />
            </div>
            <div className="w-[95%]">{children}</div>
          </div>
        </div>
      </TooltipProvider>
    </>
  );
}

export default ChatLayout;
