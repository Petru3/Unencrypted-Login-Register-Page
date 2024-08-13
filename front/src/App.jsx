import { createBrowserRouter, RouterProvider } from "react-router-dom"

// Importing Pages
import Login from './pages/Login'
import Register from './pages/Register'
import Home from "./pages/Home"

import Error from './pages/NotFound'

// Importing the AppLayout Component
import AppLayout from './ui/AppLayout'

function App() {
    const router = createBrowserRouter([
        {
            element: <AppLayout />,
            errorElement: <Error />,

            children: [
                {
                    path: '/',
                    element: <Login />
                },
                {
                    path: 'register',
                    element: <Register />
                },
                {
                    path: 'home',
                    element: <Home />
                }
            ]
        }
    ])

    return (
        <RouterProvider
            router={router}
        />
    )
}

export default App
