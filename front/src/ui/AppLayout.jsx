import { Outlet } from "react-router-dom";

function AppLayout() {
    return (
        <div className={'layout'} >
            

            <main>
                <Outlet />
            </main>

        </div>
    )
}

export default AppLayout
