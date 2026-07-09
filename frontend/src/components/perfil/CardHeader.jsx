function CardHeader({ icon: Icon, title, subtitle }) {
    return (
        <div className="flex items-center gap-3 pb-4 mb-5 border-b border-gray-100">
            <div
                className="flex items-center justify-center w-10 h-10 rounded-full shrink-0"
                style={{ backgroundColor: "#e1f5ee", color: "#1a7a5e" }}
            >
                <Icon size={18} />
            </div>
            <div>
                <h2 className="text-base font-semibold text-gray-800 leading-tight">{title}</h2>
                {subtitle && (
                    <p className="text-xs text-gray-500 mt-0.5">{subtitle}</p>
                )}
            </div>
        </div>
    )
}

export default CardHeader
