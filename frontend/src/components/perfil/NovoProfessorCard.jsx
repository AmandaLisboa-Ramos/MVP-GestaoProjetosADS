import { useState } from "react"
import { User, Mail, Lock, UserPlus, Loader2 } from "lucide-react"
import CardHeader from "./CardHeader"
import FieldLabel from "./FieldLabel"
import api from "../../services/api"

function TextInput({ id, name, type = "text", value, onChange, placeholder, icon: Icon, error }) {
    return (
        <div>
            <div
                className={`flex items-center bg-white border rounded-lg overflow-hidden transition-colors
                    focus-within:ring-2 focus-within:ring-[#1a7a5e]/30 focus-within:border-[#1a7a5e]
                    ${error ? "border-red-400" : "border-gray-300"}`}
            >
                <div className="bg-gray-50 px-3 py-2.5 border-r border-gray-200">
                    <Icon size={15} className="text-gray-400" />
                </div>
                <input
                    id={id}
                    type={type}
                    name={name}
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    className="flex-1 px-3 py-2.5 text-sm outline-none bg-transparent"
                />
            </div>
            {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
        </div>
    )
}

const EMPTY_FORM = { username: "", email: "", password: "" }

function NovoProfessorCard({ onSuccess, onCreated }) {
    const [form, setForm] = useState(EMPTY_FORM)
    const [fieldErrors, setFieldErrors] = useState({})
    const [loading, setLoading] = useState(false)

    const handleChange = (e) => {
        const { name, value } = e.target
        setForm(prev => ({ ...prev, [name]: value }))
        if (fieldErrors[name]) setFieldErrors(prev => ({ ...prev, [name]: "" }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        setFieldErrors({})

        try {
            await api.post("auth/register/", form)
            const registeredUsername = form.username
            setForm(EMPTY_FORM)
            onSuccess(`Professor "${registeredUsername}" cadastrado com sucesso!`)
            onCreated()
        } catch (err) {
            const data = err.response?.data
            // O backend retorna erros dentro de data.errors por campo
            if (data?.errors) {
                const errs = {}
                if (data.errors.username) errs.username = Array.isArray(data.errors.username) ? data.errors.username[0] : data.errors.username
                if (data.errors.email) errs.email = Array.isArray(data.errors.email) ? data.errors.email[0] : data.errors.email
                if (data.errors.password) errs.password = Array.isArray(data.errors.password) ? data.errors.password[0] : data.errors.password
                setFieldErrors(errs)
            } else {
                setFieldErrors({ password: data?.message || "Ocorreu um erro ao cadastrar o professor." })
            }
        } finally {
            setLoading(false)
        }
    }

    return (
        <div
            className="bg-white rounded-2xl p-6 border"
            style={{ borderColor: "var(--border, #e5e7eb)", borderWidth: "0.5px" }}
        >
            <CardHeader
                icon={UserPlus}
                title="Novo Professor"
                subtitle="Cadastre um novo professor no sistema"
            />

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <FieldLabel htmlFor="np-username" required>Nome de Usuário</FieldLabel>
                    <TextInput
                        id="np-username"
                        name="username"
                        value={form.username}
                        onChange={handleChange}
                        placeholder="ex: prof.joao"
                        icon={User}
                        error={fieldErrors.username}
                    />
                </div>

                <div>
                    <FieldLabel htmlFor="np-email" required>E-mail</FieldLabel>
                    <TextInput
                        id="np-email"
                        name="email"
                        type="email"
                        value={form.email}
                        onChange={handleChange}
                        placeholder="ex: joao@unifeso.edu.br"
                        icon={Mail}
                        error={fieldErrors.email}
                    />
                </div>

                <div>
                    <FieldLabel htmlFor="np-password" required>Senha Temporária</FieldLabel>
                    <TextInput
                        id="np-password"
                        name="password"
                        type="password"
                        value={form.password}
                        onChange={handleChange}
                        placeholder="Mínimo 8 caracteres"
                        icon={Lock}
                        error={fieldErrors.password}
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg text-sm font-semibold
                        text-white bg-[#1a7a5e] hover:bg-[#15644d] disabled:opacity-60 disabled:cursor-not-allowed transition-colors mt-2"
                >
                    {loading
                        ? <><Loader2 size={15} className="animate-spin" /> Cadastrando...</>
                        : <><UserPlus size={15} /> Cadastrar Professor</>
                    }
                </button>
            </form>
        </div>
    )
}

export default NovoProfessorCard
