"use client"

import DashboardHeader from "@/components/dashboardHeader"

export default function ChatPage() {

    return (
        <>
            <DashboardHeader />
            <div className="min-h-screen bg-gray-50 p-4">
                <div className="max-w-4xl mx-auto">
                    <h1 className="text-2xl font-bold mb-4">Chat</h1>
                    <p className="text-gray-600 mb-8">You are now chatting </p>
                </div>

                {/*<ChatWindow*/}
                {/*    vendorEmail={vendorEmail}*/}
                {/*    vendorName={vendorName}*/}
                {/*    onClose={handleClose}*/}
                {/*    isMinimized={isMinimized}*/}
                {/*    onToggleMinimize={handleToggleMinimize}*/}
                {/*/>*/}
            </div>
        </>
    )
}
