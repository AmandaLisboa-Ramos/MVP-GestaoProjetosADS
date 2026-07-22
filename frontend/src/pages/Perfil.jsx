import { useState, useEffect, useCallback } from "react"
import { ShieldCheck, User, Users } from "lucide-react"
import api from "../services/api"
import MeusDadosCard from "../components/perfil/MeusDadosCard"
import AlterarSenhaCard from "../components/perfil/AlterarSenhaCard"
import ProfessoresListCard from "../components/perfil/ProfessoresListCard"
import NovoProfessorCard from "../components/perfil/NovoProfessorCard"
import Toast from "../components/perfil/Toast"


function TabButton({ active, icon: Icon, label, onClick }) {
    return (
        <button
            onClick={onClick}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200
                ${active
                    ? "bg-[#1a7a5e] text-white shadow-md"
                    : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
                }`}
        >
            <Icon size={16} />
            {label}
        </button>
    )
}


function Perfil() {
    const [activeTab, setActiveTab] = useState("perfil")
    const [currentUser, setCurrentUser] = useState(null)
    const [loadingUser, setLoadingUser] = useState(true)
    const [errorUser, setErrorUser] = useState("")
    const [professores, setProfessores] = useState([])
    const [loadingProfs, setLoadingProfs] = useState(false)
    const [professoresLoaded, setProfessoresLoaded] = useState(false)
    const [toast, setToast] = useState({ message: "", type: "success" })

    const showToast = useCallback((message, type = "success") => {
        setToast({ message, type })
    }, [])

    const clearToast = useCallback(() => {
        setToast({ message: "", type: "success" })
    }, [])

    useEffect(() => {
        const fetchMe = async () => {
            try {
                const res = await api.get("auth/me/")
                const userData = res.data?.data ?? res.data
                setCurrentUser(userData)
            } catch {
                setErrorUser("Não foi possível carregar os dados do perfil.")
            } finally {
                setLoadingUser(false)
            }
        }
        fetchMe()
    }, [])

    const fetchProfessores = useCallback(async () => {
        setLoadingProfs(true)
        try {
            const res = await api.get("auth/users/")
            const data = res.data?.results ?? res.data
            setProfessores(Array.isArray(data) ? data : [])
        } catch {
            setProfessores([])
        } finally {
            setLoadingProfs(false)
        }
    }, [])

    useEffect(() => {
        if (activeTab === "professores" && !professoresLoaded) {
            setProfessoresLoaded(true)
            fetchProfessores()
        }
    }, [activeTab, professoresLoaded, fetchProfessores])

    const handleProfRemoved = () => {
        fetchProfessores()
        showToast("Professor removido com sucesso!")
    }

    const handleProfCreated = () => {
        fetchProfessores()
    }

    return (
        <section className="min-h-screen">
            {/* Toast global */}
            <Toast message={toast.message} type={toast.type} onClose={clearToast} />

            {/* Page Header */}
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2 m-0">
                    <ShieldCheck size={26} className="text-[#1a7a5e]" />
                    Perfil e Administração
                </h1>
                <p className="text-gray-500 text-sm mt-1">
                    Gerencie seus dados e os professores com acesso ao sistema.
                </p>
            </div>

            {/* Tab Bar */}
            <div className="flex items-center gap-3 mb-6">
                <TabButton
                    active={activeTab === "perfil"}
                    icon={User}
                    label="Meu Perfil"
                    onClick={() => setActiveTab("perfil")}
                />
                <TabButton
                    active={activeTab === "professores"}
                    icon={Users}
                    label="Professores"
                    onClick={() => setActiveTab("professores")}
                />
            </div>

            {/* Aba 1 — Meu Perfil */}
            {activeTab === "perfil" && (
                <div
                    className="grid gap-[14px]"
                    style={{ gridTemplateColumns: "1fr 1fr" }}
                >
                    <MeusDadosCard
                        currentUser={currentUser}
                        loading={loadingUser}
                        error={errorUser}
                    />
                    <AlterarSenhaCard
                        onSuccess={(msg) => showToast(msg, "success")}
                    />
                </div>
            )}

            {/* Aba 2 — Professores */}
            {activeTab === "professores" && (
                <div
                    className="grid gap-[14px]"
                    style={{ gridTemplateColumns: "1fr 1fr" }}
                >
                    <ProfessoresListCard
                        professores={professores}
                        loading={loadingProfs}
                        currentUserId={currentUser?.id ?? null}
                        onRemove={handleProfRemoved}
                        onError={(msg) => showToast(msg, "error")}
                    />
                    <NovoProfessorCard
                        onSuccess={(msg) => showToast(msg, "success")}
                        onCreated={handleProfCreated}
                    />
                </div>
            )}
        </section>
    )
}

export default Perfil
