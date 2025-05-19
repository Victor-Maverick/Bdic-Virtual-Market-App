import { Sidebar } from "@/components/sideBar";
import { ReactNode } from "react";
import { Header } from "@/components/adminDashboardHeader";

export default function AdminLayout({ children }: { children: ReactNode }) {
    return (
        <div className="flex flex-col h-screen w-full">
            <Header />

            <div className="flex flex-1 overflow-hidden">
                <Sidebar />

                <main className="flex-1 overflow-y-auto">
                    <div className="">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}