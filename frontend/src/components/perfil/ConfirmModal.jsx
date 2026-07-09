import { Trash2, HelpCircle } from "lucide-react"

function ConfirmModal({ open, title, message, confirmLabel = "Confirmar", onConfirm, onCancel, danger = false }) {
    if (!open) return null

    const Icon = danger ? Trash2 : HelpCircle

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                onClick={onCancel}
            />
            {/* Dialog */}
            <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm mx-4 p-6">
                <div className="flex items-start gap-3 mb-4">
                    <div
                        className="flex items-center justify-center w-10 h-10 rounded-full shrink-0"
                        style={{
                            backgroundColor: danger ? "#fde8e8" : "#e1f5ee",
                            color: danger ? "#c0392b" : "#1a7a5e"
                        }}
                    >
                        <Icon size={18} />
                    </div>
                    <div>
                        <h3 className="text-base font-semibold text-gray-800">{title}</h3>
                        <p className="text-sm text-gray-500 mt-1">{message}</p>
                    </div>
                </div>

                <div className="flex gap-3 justify-end mt-6">
                    <button
                        onClick={onCancel}
                        className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={onConfirm}
                        className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${danger
                            ? "bg-[#fde8e8] text-[#c0392b] hover:bg-red-200"
                            : "bg-[#1a7a5e] text-white hover:bg-[#15644d]"
                            }`}
                    >
                        {confirmLabel}
                    </button>
                </div>
            </div>
        </div>
    )
}

export default ConfirmModal
