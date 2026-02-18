import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { ClipboardList, Eye, EyeOff, AlertCircle } from "lucide-react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email.trim()) { setError("Informe seu email"); return; }
    if (!password.trim()) { setError("Informe sua senha"); return; }
    if (password.length < 1) { setError("A senha nao pode estar vazia"); return; }

    setLoading(true);
    try {
      await login(email, password);
      navigate("/dashboard");
    } catch (err: any) {
      const status = err.response?.status;
      const msg = err.response?.data?.error;

      if (status === 401) {
        setError("Email ou senha incorretos. Verifique suas credenciais.");
      } else if (status === 403) {
        setError("Conta desativada. Entre em contato com o administrador.");
      } else if (status === 400) {
        setError(msg || "Dados invalidos. Verifique o email e a senha.");
      } else if (!err.response) {
        setError("Servidor indisponivel. Tente novamente em alguns instantes.");
      } else {
        setError(msg || "Erro ao fazer login. Tente novamente.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-600 to-blue-800 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8">
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mb-4">
            <ClipboardList className="text-white" size={32} />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">TaskList Enterprise</h1>
          <p className="text-gray-500 mt-1">Acesse sua conta</p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
            <AlertCircle size={18} className="text-red-500 shrink-0 mt-0.5" />
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input type="email" required value={email} onChange={(e) => { setEmail(e.target.value); setError(""); }}
              placeholder="seu@email.com"
              className={"w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 " +
                (error && !email ? "border-red-300" : "border-gray-300")} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Senha</label>
            <div className="relative">
              <input type={showPassword ? "text" : "password"} required value={password}
                onChange={(e) => { setPassword(e.target.value); setError(""); }}
                placeholder="Sua senha"
                className={"w-full px-4 py-3 pr-12 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 " +
                  (error && !password ? "border-red-300" : "border-gray-300")} />
              <button type="button" onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1">
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>
          <button type="submit" disabled={loading}
            className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold transition-colors disabled:opacity-50">
            {loading ? "Entrando..." : "Entrar"}
          </button>
        </form>
      </div>
    </div>
  );
}
