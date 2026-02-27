import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Leaf, Loader2 } from "lucide-react";

export default function Auth() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);
  
  //  On utilise les noms exacts exportés par ton AuthContext
  const { login, register } = useAuth(); 
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isSignUp) {
        //  Correction : on utilise 'register' au lieu de 'signUp'
        await register(email, password, fullName);
        toast({ 
          title: "Compte créé !", 
          description: "Bienvenue dans la famille, Charlotte." 
        });
        navigate("/");
      } else {
        //  Correction : on utilise 'login' au lieu de 'signIn'
        await login(email, password);
        navigate("/");
      }
    } catch (err: any) {
      toast({ 
        title: "Erreur", 
        description: err.message || "Identifiants incorrects", 
        variant: "destructive" 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="container flex items-center justify-center py-16 min-h-[70vh]">
        <Card className="w-full max-w-md border-gray-100 shadow-xl rounded-[2.5rem] overflow-hidden">
          <CardHeader className="text-center pt-10">
            <div className="bg-[#F0F7F2] w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Leaf className="h-8 w-8 text-[#2D5A43]" />
            </div>
            <CardTitle className="text-3xl font-bold text-[#2D5A43]">
              {isSignUp ? "Nous rejoindre" : "Bon retour !"}
            </CardTitle>
            <p className="text-gray-500 mt-2">
              {isSignUp ? "Créez votre compte écoresponsable" : "Connectez-vous pour voir vos réservations"}
            </p>
          </CardHeader>
          <CardContent className="px-8 pb-10">
            <form onSubmit={handleSubmit} className="space-y-5">
              {isSignUp && (
                <div className="space-y-2">
                  <Label htmlFor="name">Nom complet</Label>
                  <Input 
                    id="name" 
                    placeholder="Charlotte Akomedi"
                    className="rounded-xl border-gray-100"
                    value={fullName} 
                    onChange={e => setFullName(e.target.value)} 
                    required 
                  />
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="charlotte@example.com"
                  className="rounded-xl border-gray-100"
                  value={email} 
                  onChange={e => setEmail(e.target.value)} 
                  required 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Mot de passe</Label>
                <Input 
                  id="password" 
                  type="password" 
                  className="rounded-xl border-gray-100"
                  value={password} 
                  onChange={e => setPassword(e.target.value)} 
                  required 
                  minLength={6} 
                />
              </div>
              <Button 
                type="submit" 
                className="w-full py-6 bg-[#2D5A43] hover:bg-[#1A3326] rounded-xl font-bold text-lg shadow-lg transition-all active:scale-95" 
                disabled={loading}
              >
                {loading ? (
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                ) : isSignUp ? "S'inscrire" : "Se connecter"}
              </Button>
            </form>
            
            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-gray-100"></span></div>
              <div className="relative flex justify-center text-xs uppercase"><span className="bg-white px-2 text-gray-400">Ou</span></div>
            </div>

            <p className="text-center text-sm text-gray-500">
              {isSignUp ? "Déjà un membre ?" : "Nouveau ici ?"}{" "}
              <button 
                onClick={() => setIsSignUp(!isSignUp)} 
                className="text-[#2D5A43] font-bold hover:underline"
              >
                {isSignUp ? "Connectez-vous" : "Créez un compte"}
              </button>
            </p>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}