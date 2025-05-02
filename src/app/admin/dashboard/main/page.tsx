import {Sidebar} from "@/components/sideBar";

const Main =()=>{
    return (
        <>
            <div className="max-w-none flex flex-row w-full h-screen bg-white mx-auto max-md:max-w-[991px] max-sm:max-w-screen-sm">
                <Sidebar />
                <div className="grow flex flex-col p-5">
                    {/*<Header />*/}
                    {/*<DashboardOverview />*/}
                    {/*<AnalyticsSection />*/}
                </div>
            </div>
        </>
    )
}
export default Main