const MainLayout = () => {

    console.log("🔥🔥 MAIN LAYOUT IS RUNNING");

    return (
        <div className="flex min-h-screen">

            <div className="w-64 border-r-4 border-red-500">
                <Sidebar />
            </div>

            <div className="flex flex-1 flex-col">

                <div className="border-b-4 border-blue-500">
                    <Header />
                </div>

                <main className="flex-1 bg-gray-50">
                    <Outlet />
                </main>

            </div>

        </div>
    );
};

export default MainLayout;