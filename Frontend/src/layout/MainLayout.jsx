import Sidebar from "./Sidebar";
import Header from "./Header";

const MainLayout = () => {
    return (
        <div className="flex min-h-screen border-4 ">

           
            <div className="border-2 ">
                <Sidebar />
            </div>

            
            <div className="flex flex-1 flex-col border-2 ">

              
                <div className="border-2 ">
                    <Header />
                </div>

             
                <main className="mt-6 ml-6 flex-1 border-2 text-gray-200  p-6 shadow-lg">
                    Main Section
                </main>

            </div>

        </div>
    );
};

export default MainLayout;