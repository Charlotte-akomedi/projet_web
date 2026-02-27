import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Leaf, Lock, Mail, Loader2, AlertCircle } from "lucide-react";
import { api } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext"; // ✅ Ajout de l'import du contexte

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth(); // ✅ Récupération de la fonction login

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      // Appel réel au backend Express via Prisma
      const response = await api.post("/auth/login", { email, password });
      
      if (response.data.token) {
        // ✅ Utilisation du contexte pour mettre à jour l'état global
        // Cela gère automatiquement le localStorage et l'état de l'utilisateur
        login(response.data); 
        
        // Redirection vers l'accueil avec un message de bienvenue
        navigate("/", { state: { welcomeMessage: `Ravi de vous revoir !` } }); 
      }
    } catch (err: any) {
      // Affichage de l'erreur envoyée par le serveur (ex: "Identifiants invalides")
      setError(err.response?.data?.message || "Impossible de se connecter au serveur.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout>
      {/* ... Le reste de ton JSX reste identique, il est parfait ... */}
      <div className="min-h-[80vh] flex items-center justify-center bg-[#F9FAF9] px-6">
        <div className="w-full max-w-md bg-white p-10 rounded-[2.5rem] shadow-2xl border border-gray-100">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#E8F0EB] mb-4">
              <Leaf className="h-8 w-8 text-[#2D5A43]" />
            </div>
            <h1 className="text-3xl font-bold text-[#2D5A43]">Bon retour</h1>
            <p className="text-gray-500 mt-2">Accédez à votre espace Sneakers Family</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 rounded-2xl flex items-center gap-2 text-sm">
              <AlertCircle className="h-4 w-4" />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 ml-1">Email</label>
              <div className="relative">
                <Mail className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
                <input
                  type="email"
                  required
                  className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-[#2D5A43] outline-none transition-all"
                  placeholder="votre@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 ml-1">Mot de passe</label>
              <div className="relative">
                <Lock className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
                <input
                  type="password"
                  required
                  className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-[#2D5A43] outline-none transition-all"
                  placeholder="••••••••"
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
              {isLoading ? <Loader2 className="h-6 w-6 animate-spin" /> : "Se connecter"}
            </Button>

            <div className="mt-8 text-center text-sm text-gray-500">
              Pas encore de compte ?{" "}
              <button 
                type="button"
                onClick={() => navigate("/register")} 
                className="font-bold text-[#2D5A43] hover:text-[#1A3326] transition-colors hover:underline underline-offset-4"
              >
                S'inscrire
              </button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
}