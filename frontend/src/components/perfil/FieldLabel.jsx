function FieldLabel({ children, required = false, htmlFor }) {
    return (
        <label
            htmlFor={htmlFor}
            className="block text-[11px] font-semibold uppercase tracking-wider text-gray-500 mb-1"
        >
            {children}
            {required && <span className="text-red-500 ml-0.5">*</span>}
        </label>
    )
}

export default FieldLabel
