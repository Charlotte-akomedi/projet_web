import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import { Trash2, Timer, ShoppingBag, ArrowRight, Loader2, CheckCircle2 } from "lucide-react";

export default function Cart() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSuccess, setIsSuccess] = useState(false);

  const fetchItems = async () => {
    if (!user) return;
    try {
      const res = await api.get("/cart");
      setItems(res.data);
    } catch (err) {
      console.error("Erreur de chargement", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, [user]);

  const removeItem = async (id: string) => {
    await api.delete(`/cart/${id}`);
    fetchItems();
  };

  //  ACTION DE PAIEMENT : Vide le serveur ET l'interface//  Dans handleCheckout
const handleCheckout = async () => {
  try {
    // Supprime les données sur le serveur (variable tempCart)
    await api.delete("/cart/all"); 
    
    // Vide la liste locale immédiatement pour que l'interface affiche "vide"
    setItems([]); 
    
    // Affiche l'écran de succès
    setIsSuccess(true); 
  } catch (err) {
    alert("Erreur serveur : impossible de vider le panier.");
  }
};

  const getTimeRemaining = (expiresAt: string) => {
    const diff = new Date(expiresAt).getTime() - Date.now();
    return diff <= 0 ? "Expiré" : `${Math.floor(diff / 60000)} min`;
  };

  const total = items.reduce((acc, item) => acc + (item.productPrice || 0), 0);

  if (isSuccess) {
    return (
      <Layout>
        <div className="container py-32 flex flex-col items-center text-center">
          <CheckCircle2 className="h-20 w-20 text-[#2D5A43] mb-6 animate-bounce" />
          <h1 className="text-4xl font-bold text-[#2D5A43] mb-4">Commande validée !</h1>
          <p className="text-gray-500 mb-10">Le panier a été vidé avec succès.</p>
          <Button onClick={() => navigate("/catalogue")} className="bg-[#2D5A43] px-10 py-6 rounded-2xl">
            Continuer mes achats
          </Button>
        </div>
      </Layout>
    );
  }

  if (!user) return <Layout><div className="py-20 text-center"><Button onClick={() => navigate("/login")}>Se connecter</Button></div></Layout>;

  return (
    <Layout>
      <div className="container py-12 max-w-4xl">
        <h1 className="text-3xl font-bold mb-8 text-[#2D5A43]">Votre Panier</h1>
        {loading ? <Loader2 className="mx-auto animate-spin" /> : items.length === 0 ? (
          <div className="text-center py-20 bg-gray-50 rounded-[2.5rem] border-2 border-dashed">
            <ShoppingBag className="mx-auto mb-4 text-gray-300" size={48} />
            <p className="text-gray-500 mb-6 font-medium">Votre panier est vide</p>
            <Button onClick={() => navigate("/catalogue")} className="bg-[#2D5A43]">Boutique</Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              {items.map((item) => (
                <div key={item.id} className="flex gap-4 p-6 rounded-3xl border bg-white shadow-sm">
                  <div className="w-24 h-24 rounded-2xl overflow-hidden bg-gray-50">
                    <img src={item.productImage} alt={item.productName} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-800">{item.productName}</h3>
                    <p className="text-sm text-gray-400 font-medium">Taille : {item.size}</p>
                    <div className="flex items-center gap-2 text-xs text-orange-600 mt-3 font-semibold bg-orange-50 px-3 py-1 rounded-full w-fit">
                      <Timer size={12} /> {getTimeRemaining(item.expiresAt)}
                    </div>
                  </div>
                  <div className="flex flex-col justify-between items-end">
                    <p className="font-bold text-[#2D5A43]">{item.productPrice?.toFixed(2)} €</p>
                    <Button variant="ghost" size="icon" onClick={() => removeItem(item.id)} className="text-gray-300 hover:text-red-500">
                      <Trash2 size={20} />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
            <div className="bg-[#F9FAF9] p-8 rounded-[2.5rem] border h-fit sticky top-24 shadow-sm">
              <h2 className="text-xl font-bold mb-6 text-gray-800">Résumé</h2>
              <div className="flex justify-between items-center mb-8">
                <span className="font-bold text-lg text-gray-700">Total</span>
                <span className="text-3xl font-black text-[#2D5A43]">{total.toFixed(2)} €</span>
              </div>
              {/*  VÉRIFIE QUE LE ONCLICK APPELLE BIEN handleCheckout */}
              <Button className="w-full py-8 bg-[#2D5A43] rounded-2xl font-bold text-lg" onClick={handleCheckout}>
                Payer la commande <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}