import { useState } from "react"
import { Users, Trash2, ChevronDown, ChevronUp } from "lucide-react"
import CardHeader from "./CardHeader"
import ConfirmModal from "./ConfirmModal"
import api from "../../services/api"

function ProfessorAvatar({ username, inactive }) {
    const initial = username ? username.charAt(0).toUpperCase() : "?"
    return (
        <div
            className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold shrink-0 text-white select-none"
            style={{
                background: inactive
                    ? "linear-gradient(135deg, #9ca3af, #d1d5db)"
                    : "linear-gradient(135deg, #1a7a5e, #2ecc9a)"
            }}
        >
            {initial}
        </div>
    )
}

function ProfessoresListCard({ professores, loading, currentUserId, onRemove, onError }) {
    const [confirmTarget, setConfirmTarget] = useState(null) // { id, username }
    const [removing, setRemoving] = useState(false)
    const [showInactive, setShowInactive] = useState(false)

    const handleConfirmRemove = async () => {
        if (!confirmTarget) return
        setRemoving(true)
        try {
            await api.delete(`auth/users/${confirmTarget.id}/`)
            setConfirmTarget(null)
            onRemove()
        } catch (err) {
            console.error("Erro ao remover professor", err)
            const data = err.response?.data
            const msg =
                (data?.errors?.id ?? data?.id)?.[0] ||
                data?.detail ||
                data?.message ||
                "Não foi possível remover o professor."
            setConfirmTarget(null)
            if (onError) onError(msg)
        } finally {
            setRemoving(false)
        }
    }

    return (
        <>
            <div
                className="bg-white rounded-2xl p-6 border"
                style={{ borderColor: "var(--border, #e5e7eb)", borderWidth: "0.5px" }}
            >
                <CardHeader
                    icon={Users}
                    title="Professores Cadastrados"
                    subtitle="Gerencie os professores com acesso ao sistema"
                />

                {loading ? (
                    <div className="space-y-3">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="flex items-center gap-3 animate-pulse">
                                <div className="w-9 h-9 rounded-full bg-gray-200 shrink-0" />
                                <div className="flex-1 space-y-1.5">
                                    <div className="h-3.5 bg-gray-200 rounded w-1/3" />
                                    <div className="h-3 bg-gray-100 rounded w-1/2" />
                                </div>
                            </div>
                        ))}
                    </div>
                ) : professores.length === 0 ? (
                    <div className="text-center py-8 text-gray-400">
                        <Users size={32} className="mx-auto mb-2 opacity-40" />
                        <p className="text-sm">Nenhum professor encontrado.</p>
                    </div>
                ) : (
                    <>
                        <ul className="space-y-1.5">
                            {professores.filter(p => p.is_active !== false).map(prof => {
                                const isMe = prof.id === currentUserId

                                return (
                                    <li
                                        key={prof.id}
                                        className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors relative
                                            ${isMe
                                                ? "bg-[#e1f5ee]/60"
                                                : "hover:bg-gray-50"
                                            }`}
                                    >
                                        <ProfessorAvatar username={prof.username} inactive={false} />

                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 flex-wrap">
                                                <span className="text-sm font-semibold truncate text-gray-800">
                                                    {prof.username}
                                                </span>

                                                {/* Badge "você" */}
                                                {isMe && (
                                                    <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-full bg-[#1a7a5e] text-white leading-none shrink-0">
                                                        você
                                                    </span>
                                                )}
                                            </div>
                                            <p className="text-xs text-gray-400 truncate">{prof.email || "—"}</p>
                                        </div>

                                        <button
                                            disabled={isMe}
                                            onClick={() => !isMe && setConfirmTarget({ id: prof.id, username: prof.username })}
                                            title={
                                                isMe ? "Você não pode remover a si mesmo"
                                                    : `Remover ${prof.username}`
                                            }
                                            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors shrink-0
                                                ${isMe
                                                    ? "opacity-30 cursor-not-allowed text-gray-400 bg-gray-100"
                                                    : "text-[#c0392b] bg-[#fde8e8] hover:bg-red-200"
                                                }`}
                                        >
                                            <Trash2 size={13} />
                                            Remover
                                        </button>
                                    </li>
                                )
                            })}
                        </ul>

                        {/* Seção Inativos */}
                        {professores.some(p => p.is_active === false) && (
                            <div className="mt-6 border-t border-gray-100 pt-4">
                                <button
                                    onClick={() => setShowInactive(!showInactive)}
                                    className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-gray-50 hover:bg-gray-100 border border-gray-100 text-sm font-semibold text-gray-600 transition-colors w-full"
                                >
                                    <span className="flex-1 text-left">
                                        Professores Inativos ({professores.filter(p => p.is_active === false).length})
                                    </span>
                                    {showInactive ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                                </button>

                                {showInactive && (
                                    <ul className="space-y-1.5 mt-3 opacity-70 grayscale">
                                        {professores.filter(p => p.is_active === false).map(prof => (
                                            <li
                                                key={prof.id}
                                                className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-gray-50 relative"
                                            >
                                                <ProfessorAvatar username={prof.username} inactive={true} />

                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center gap-2 flex-wrap">
                                                        <span className="text-sm font-semibold truncate line-through text-gray-400">
                                                            {prof.username}
                                                        </span>

                                                        <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-full bg-gray-300 text-gray-600 leading-none shrink-0">
                                                            inativo
                                                        </span>
                                                    </div>
                                                    <p className="text-xs text-gray-400 truncate">{prof.email || "—"}</p>
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        )}
                    </>
                )}
            </div>

            <ConfirmModal
                open={!!confirmTarget}
                danger
                title="Remover professor"
                message={`Tem certeza que deseja remover "${confirmTarget?.username}"? Esta ação não pode ser desfeita.`}
                confirmLabel={removing ? "Removendo..." : "Sim, remover"}
                onConfirm={handleConfirmRemove}
                onCancel={() => !removing && setConfirmTarget(null)}
            />
        </>
    )
}

export default ProfessoresListCard
