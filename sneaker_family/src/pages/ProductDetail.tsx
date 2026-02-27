import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { api } from "@/lib/api"; // ✅ Utilisation de ton instance API
import { ShoppingCart, ArrowLeft, Timer, Check, Loader2 } from "lucide-react";

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [product, setProduct] = useState<any | null>(null);
  const [selectedSize, setSelectedSize] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    if (!id) return;
    
    // ✅ Récupération du produit depuis ton port 5000
    api.get(`/products/${id}`)
      .then((res) => {
        setProduct(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Erreur chargement produit:", err);
        setLoading(false);
      });
  }, [id]);

  const handleAddToCart = async () => {
    if (!selectedSize || !user) {
      if (!user) navigate("/login");
      return;
    }

    setAdding(true);
    try {
      // ✅ Appel à ton futur endpoint panier backend
      await api.post("/cart/add", {
        productId: product.id,
        size: selectedSize,
        quantity: 1
      });
      alert("Ajouté au panier ! Réservé pour 15 minutes.");
    } catch (error) {
      alert("Erreur lors de l'ajout au panier");
    } finally {
      setAdding(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="container py-40 flex flex-col items-center">
          <Loader2 className="h-12 w-12 animate-spin text-[#2D5A43]" />
          <p className="mt-4 text-gray-500">Chargement de votre sneaker...</p>
        </div>
      </Layout>
    );
  }

  if (!product) return <Layout><div className="container py-16 text-center">Produit introuvable</div></Layout>;

  const categoryLabels: Record<string, string> = { Men: "Homme", Women: "Femme", Kids: "Enfant" };

  return (
    <Layout>
      <div className="container py-8">
        <Button variant="ghost" size="sm" onClick={() => navigate(-1)} className="mb-6 hover:bg-[#E8F0EB] text-[#2D5A43]">
          <ArrowLeft className="h-4 w-4 mr-1" /> Retour au catalogue
        </Button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16">
          {/* Section Image */}
          <div className="aspect-square rounded-[2rem] overflow-hidden bg-[#F9FAF9] border border-gray-100 shadow-inner">
            {product.imageUrl ? (
              <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover transition-transform hover:scale-105 duration-500" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-8xl">👟</div>
            )}
          </div>

          {/* Section Détails */}
          <div className="flex flex-col justify-center">
            <Badge className="w-fit bg-[#E8F0EB] text-[#2D5A43] hover:bg-[#E8F0EB] border-none px-4 py-1 rounded-full">
              {categoryLabels[product.category]}
            </Badge>
            <p className="text-gray-400 font-medium mt-4 uppercase tracking-widest text-xs">{product.brand}</p>
            <h1 className="text-4xl font-bold text-[#2D5A43] mt-2">{product.name}</h1>
            <p className="text-3xl font-bold text-[#2D5A43] mt-4">{product.basePrice.toFixed(2)} €</p>

            <div className="h-px bg-gray-100 my-8" />

            <p className="text-gray-600 leading-relaxed mb-8">{product.description}</p>

            {/* Sélection de Pointure */}
            <div className="mb-8">
              <h3 className="font-bold text-[#2D5A43] mb-4">Choisir une pointure</h3>
              <div className="flex flex-wrap gap-3">
                {product.variants?.map((v: any) => (
                  <button
                    key={v.id}
                    disabled={v.stock <= 0}
                    onClick={() => setSelectedSize(v.size)}
                    className={`
                      w-16 h-12 rounded-xl border-2 font-bold transition-all
                      ${selectedSize === v.size 
                        ? "bg-[#2D5A43] text-white border-[#2D5A43]" 
                        : "border-gray-100 hover:border-[#2D5A43] text-gray-600"}
                      ${v.stock <= 0 ? "opacity-20 cursor-not-allowed line-through" : "cursor-pointer"}
                    `}
                  >
                    {v.size}
                  </button>
                ))}
              </div>
            </div>

            {/* Action Panier */}
            <div className="space-y-4">
              <Button
                size="lg"
                className="w-full py-8 bg-[#2D5A43] hover:bg-[#1A3326] text-white rounded-2xl font-bold text-xl shadow-xl transition-all active:scale-95"
                onClick={handleAddToCart}
                disabled={!selectedSize || adding}
              >
                {adding ? (
                  <Loader2 className="h-6 w-6 animate-spin" />
                ) : (
                  <span className="flex items-center gap-3"><ShoppingCart className="h-6 w-6" /> Ajouter au panier</span>
                )}
              </Button>
              <div className="flex items-center justify-center gap-2 text-sm text-gray-400">
                <Timer className="h-4 w-4" />
                <span>Réservation garantie pendant 15 minutes</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}