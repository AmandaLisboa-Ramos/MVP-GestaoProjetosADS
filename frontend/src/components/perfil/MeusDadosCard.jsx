import { User, Mail, LogOut } from "lucide-react"
import CardHeader from "./CardHeader"
import FieldLabel from "./FieldLabel"
import { useAuth } from "../../context/AuthContext"

function MeusDadosCard({ currentUser, loading, error }) {
    const { logout } = useAuth()

    return (
        <div
            className="bg-white rounded-2xl p-6 border"
            style={{ borderColor: "var(--border, #e5e7eb)", borderWidth: "0.5px" }}
        >
            <CardHeader
                icon={User}
                title="Meus Dados"
                subtitle="Informações do seu perfil atual"
            />

            {loading ? (
                <div className="animate-pulse space-y-3">
                    <div className="h-10 bg-gray-100 rounded-lg w-full" />
                    <div className="h-10 bg-gray-100 rounded-lg w-full" />
                </div>
            ) : error ? (
                <p className="text-sm text-red-500">{error}</p>
            ) : currentUser ? (
                <div className="space-y-4">
                    <div>
                        <FieldLabel htmlFor="perfil-username">Nome de Usuário</FieldLabel>
                        <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-700">
                            <User size={15} className="text-gray-400 shrink-0" />
                            <span className="font-medium">{currentUser.username}</span>
                        </div>
                    </div>

                    <div>
                        <FieldLabel htmlFor="perfil-email">E-mail</FieldLabel>
                        <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-700">
                            <Mail size={15} className="text-gray-400 shrink-0" />
                            <span className="font-medium">{currentUser.email || "Não informado"}</span>
                        </div>
                    </div>

                    <div className="pt-3 border-t border-gray-100">
                        <button
                            onClick={logout}
                            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium
                                border border-red-300 text-red-600 bg-white hover:bg-red-50 transition-colors"
                        >
                            <LogOut size={15} />
                            Sair da conta
                        </button>
                    </div>
                </div>
            ) : null}
        </div>
    )
}

export default MeusDadosCard
