import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Leaf, Mail, Lock, User, Loader2, AlertCircle } from "lucide-react";
import { api } from "@/lib/api"; // Import de ton instance Axios configurée

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      // ✅ Envoi des données au backend Express/Prisma
      await api.post("/auth/register", { name, email, password });
      
      // Si l'inscription réussit, on redirige vers le login
      navigate("/login", { state: { message: "Compte créé ! Connectez-vous." } });
    } catch (err: any) {
      // Récupération de l'erreur (ex: "Cet utilisateur existe déjà")
      setError(err.response?.data?.message || "Une erreur est survenue lors de l'inscription.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout>
      <div className="min-h-[80vh] flex items-center justify-center bg-[#F9FAF9] px-6">
        <div className="w-full max-w-md bg-white p-10 rounded-[2.5rem] shadow-2xl border border-gray-100">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#E8F0EB] mb-4">
              <Leaf className="h-8 w-8 text-[#2D5A43]" />
            </div>
            <h1 className="text-3xl font-bold text-[#2D5A43]">Rejoindre la famille</h1>
            <p className="text-gray-500 mt-2">Créez votre compte éco-responsable</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 rounded-2xl flex items-center gap-2 text-sm">
              <AlertCircle className="h-4 w-4" />
              {error}
            </div>
          )}

          <form onSubmit={handleRegister} className="space-y-5">
            <div className="space-y-2 text-left">
              <label className="text-sm font-semibold text-gray-700 ml-1">Nom complet</label>
              <div className="relative">
                <User className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  required
                  placeholder="John Doe"
                  className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-[#2D5A43] outline-none transition-all"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2 text-left">
              <label className="text-sm font-semibold text-gray-700 ml-1">Email</label>
              <div className="relative">
                <Mail className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
                <input
                  type="email"
                  required
                  placeholder="votre@email.com"
                  className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-[#2D5A43] outline-none transition-all"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2 text-left">
              <label className="text-sm font-semibold text-gray-700 ml-1">Mot de passe</label>
              <div className="relative">
                <Lock className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-[#2D5A43] outline-none transition-all"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full py-7 bg-[#2D5A43] hover:bg-[#244835] text-white rounded-full font-bold text-lg shadow-lg transition-all mt-4"
              disabled={isLoading}
            >
              {isLoading ? <Loader2 className="h-6 w-6 animate-spin" /> : "S'inscrire"}
            </Button>
          </form>

          <p className="mt-8 text-sm text-gray-500 text-center">
            Déjà membre ?{" "}
            <button 
              onClick={() => navigate("/login")} 
              className="font-bold text-[#2D5A43] hover:underline"
            >
              Se connecter
            </button>
          </p>
        </div>
      </div>
    </Layout>
  );
}