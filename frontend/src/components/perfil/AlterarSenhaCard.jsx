import { useState } from "react"
import { Lock, Eye, EyeOff, Key, Loader2 } from "lucide-react"
import CardHeader from "./CardHeader"
import FieldLabel from "./FieldLabel"
import api from "../../services/api"


function PasswordInput({ id, name, value, onChange, placeholder, error }) {
    const [show, setShow] = useState(false)
    return (
        <div>
            <div
                className={`flex items-center bg-white border rounded-lg overflow-hidden transition-colors
                    focus-within:ring-2 focus-within:ring-[#1a7a5e]/30 focus-within:border-[#1a7a5e]
                    ${error ? "border-red-400" : "border-gray-300"}`}
            >
                <div className="bg-gray-50 px-3 py-2.5 border-r border-gray-200">
                    <Lock size={15} className="text-gray-400" />
                </div>
                <input
                    id={id}
                    type={show ? "text" : "password"}
                    name={name}
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    className="flex-1 px-3 py-2.5 text-sm outline-none bg-transparent"
                />
                <button
                    type="button"
                    onClick={() => setShow(s => !s)}
                    className="px-3 text-gray-400 hover:text-gray-600 transition-colors"
                    tabIndex={-1}
                >
                    {show ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
            </div>
            {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
        </div>
    )
}

function AlterarSenhaCard({ onSuccess }) {
    const [form, setForm] = useState({ senha_atual: "", nova_senha: "", confirmar_senha: "" })
    const [fieldErrors, setFieldErrors] = useState({})
    const [loading, setLoading] = useState(false)
    const [serverError, setServerError] = useState("")

    const handleChange = (e) => {
        const { name, value } = e.target
        setForm(prev => ({ ...prev, [name]: value }))
        if (fieldErrors[name]) setFieldErrors(prev => ({ ...prev, [name]: "" }))
        if (serverError) setServerError("")
    }

    const validate = () => {
        const errs = {}
        if (!form.senha_atual) errs.senha_atual = "Informe sua senha atual."
        if (!form.nova_senha) {
            errs.nova_senha = "Informe a nova senha."
        } else if (form.nova_senha.length < 8) {
            errs.nova_senha = "A senha deve ter no mínimo 8 caracteres."
        }
        if (!form.confirmar_senha) {
            errs.confirmar_senha = "Confirme a nova senha."
        } else if (form.nova_senha !== form.confirmar_senha) {
            errs.confirmar_senha = "As senhas não coincidem."
        }
        setFieldErrors(errs)
        return Object.keys(errs).length === 0
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!validate()) return

        setLoading(true)
        setServerError("")

        try {
            await api.patch("auth/change-password/", {
                senha_atual: form.senha_atual,
                nova_senha: form.nova_senha,
            })
            setForm({ senha_atual: "", nova_senha: "", confirmar_senha: "" })
            onSuccess("Senha alterada com sucesso!")
        } catch (err) {
            const data = err.response?.data
            const msg =
                data?.errors?.senha_atual?.[0] ||
                data?.errors?.nova_senha?.[0] ||
                data?.message ||
                "Erro ao alterar a senha. Verifique sua senha atual."
            setServerError(msg)
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
                icon={Lock}
                title="Alterar Senha"
                subtitle="Atualize sua senha de acesso"
            />

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <FieldLabel htmlFor="senha_atual" required>Senha Atual</FieldLabel>
                    <PasswordInput
                        id="senha_atual"
                        name="senha_atual"
                        value={form.senha_atual}
                        onChange={handleChange}
                        placeholder="••••••••"
                        error={fieldErrors.senha_atual}
                    />
                </div>

                <div>
                    <FieldLabel htmlFor="nova_senha" required>Nova Senha</FieldLabel>
                    <PasswordInput
                        id="nova_senha"
                        name="nova_senha"
                        value={form.nova_senha}
                        onChange={handleChange}
                        placeholder="Mínimo 8 caracteres"
                        error={fieldErrors.nova_senha}
                    />
                </div>

                <div>
                    <FieldLabel htmlFor="confirmar_senha" required>Confirmar Nova Senha</FieldLabel>
                    <PasswordInput
                        id="confirmar_senha"
                        name="confirmar_senha"
                        value={form.confirmar_senha}
                        onChange={handleChange}
                        placeholder="Repita a nova senha"
                        error={fieldErrors.confirmar_senha}
                    />
                </div>

                {serverError && (
                    <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2.5">
                        {serverError}
                    </div>
                )}

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg text-sm font-semibold
                        text-white bg-[#1a7a5e] hover:bg-[#15644d] disabled:opacity-60 disabled:cursor-not-allowed transition-colors mt-2"
                >
                    {loading
                        ? <><Loader2 size={15} className="animate-spin" /> Alterando...</>
                        : <><Key size={15} /> Alterar Senha</>
                    }
                </button>
            </form>
        </div>
    )
}

export default AlterarSenhaCard
