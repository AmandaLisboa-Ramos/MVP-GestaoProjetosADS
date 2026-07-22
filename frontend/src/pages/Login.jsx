import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import FormLogin from "../components/FormLogin"

function Login() {
    const { isAuthenticated } = useAuth()
    const navigate = useNavigate()

    useEffect(() => {
        if (isAuthenticated) {
            navigate('/dashboard')
        }
    }, [isAuthenticated, navigate])

    return (
        <section
            className="fixed inset-0"
            style={{
                backgroundImage: "url('https://portalint.unifeso.edu.br/FrameHTML/web/app/edu/PortalEducacional/login/assets/img/bg.jpg')",
                backgroundSize: 'cover',
                backgroundColor: '#333333',
            }}
        >
            <div className="flex flex-col items-center justify-center h-screen gap-6 ">

                <img
                    src="https://portalint.unifeso.edu.br/FrameHTML/web/app/edu/PortalEducacional/login/assets/img/logo-responsivo.png"
                    alt="Logo UNIFESO"
                    className="w-56 object-contain animate-slide-down-delayed"
                />
                <FormLogin />
            </div>
        </section>
    )
}

export default Login