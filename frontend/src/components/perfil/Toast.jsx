import { useEffect, useState } from "react"
import { CheckCircle, AlertCircle, X } from "lucide-react"

function Toast({ message, type = "success", onClose }) {
    const [visible, setVisible] = useState(false)

    useEffect(() => {
        if (!message) return
        setVisible(true)
        const timer = setTimeout(() => {
            setVisible(false)
            setTimeout(onClose, 300)
        }, 3500)
        return () => clearTimeout(timer)
    }, [message, onClose])

    if (!message) return null

    const colors =
        type === "success"
            ? "bg-[#e1f5ee] border-[#1a7a5e] text-[#1a7a5e]"
            : "bg-red-50 border-red-400 text-red-700"

    const Icon = type === "success" ? CheckCircle : AlertCircle

    return (
        <div
            className={`fixed top-5 right-5 z-50 flex items-center gap-2 px-4 py-3 rounded-xl border shadow-lg text-sm font-medium
                transition-all duration-300 ${colors} ${visible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2"}`}
            style={{ maxWidth: 360 }}
        >
            <Icon size={18} className="shrink-0" />
            <span className="flex-1">{message}</span>
            <button
                onClick={() => { setVisible(false); setTimeout(onClose, 300) }}
                className="ml-1 opacity-60 hover:opacity-100 transition-opacity"
            >
                <X size={14} />
            </button>
        </div>
    )
}

export default Toast
