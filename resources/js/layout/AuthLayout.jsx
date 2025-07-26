import { Outlet } from 'react-router-dom'

function AuthLayout() {
    return (
        <>
            <div className="container d-flex justify-content-center align-items-center vh-100">
                <Outlet />
            </div>
        </>
    )
}
export default AuthLayout
