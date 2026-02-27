import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import ProductCard from "@/components/ProductCard"; 
import { Layout } from "@/components/layout/Layout";
import { Leaf, ArrowRight, Recycle, TreePine, Heart, Loader2, CheckCircle } from "lucide-react";
import { getProducts } from "@/lib/api"; 

export default function Index() {
  const [featured, setFeatured] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  // Récupération du message de succès après redirection du Login
  const welcomeMessage = location.state?.welcomeMessage;

  useEffect(() => {
    getProducts()
      .then((data: any) => {
        if (Array.isArray(data)) {
          setFeatured(data.slice(0, 8));
        }
      })
      .catch((err: any) => console.error("Erreur Backend:", err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <Layout>
      {/* Bannière de notification de connexion */}
      {welcomeMessage && (
        <div className="bg-[#2D5A43] text-white py-3 px-6 flex items-center justify-center gap-2 animate-in slide-in-from-top duration-500">
          <CheckCircle className="h-4 w-4" />
          <span className="text-sm font-medium">{welcomeMessage}</span>
        </div>
      )}

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-[#2D5A43] min-h-[500px] flex items-center">
        <div className="absolute inset-0 bg-gradient-to-r from-[#2D5A43] to-transparent z-10" />
        
        <div className="relative z-20 container mx-auto px-6 py-20">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md text-white px-4 py-1.5 rounded-full text-sm mb-6 border border-white/20">
              <Leaf className="h-4 w-4" />
              Engagement Écoresponsable
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-white leading-tight mb-6">
              Des sneakers pour toute la famille
            </h1>
            <p className="text-white/80 text-lg md:text-xl mb-8 max-w-lg">
              Découvrez notre collection de sneakers alliant style, confort et respect de l'environnement.
            </p>
            <Link to="/catalogue">
              <Button size="lg" className="bg-white text-[#2D5A43] hover:bg-white/90 rounded-full px-8 font-bold shadow-lg transition-transform hover:scale-105">
                Explorer le catalogue <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Engagements */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center text-[#2D5A43] mb-16">Nos engagements</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {[
              { icon: Recycle, title: "Matériaux recyclés", desc: "80% de nos matériaux proviennent du recyclage." },
              { icon: TreePine, title: "Empreinte carbone", desc: "Nous compensons 100% de nos émissions de CO2." },
              { icon: Heart, title: "Commerce équitable", desc: "Des conditions de travail justes pour tous." },
            ].map((v) => (
              <div key={v.title} className="text-center p-10 rounded-3xl bg-[#F9FAF9] border border-gray-100 hover:shadow-xl transition-shadow">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#E8F0EB] mb-6">
                  <v.icon className="h-8 w-8 text-[#2D5A43]" />
                </div>
                <h3 className="text-xl font-bold text-[#2D5A43] mb-4">{v.title}</h3>
                <p className="text-gray-500 leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Collections (Emoji retirés pour un rendu plus pro) */}
      <section className="py-20 bg-[#F9FAF9]">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center text-[#2D5A43] mb-16">Nos collections</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { cat: "Men", label: "Homme", sizes: "Pointures 40-47" },
              { cat: "Women", label: "Femme", sizes: "Pointures 35-42" },
              { cat: "Kids", label: "Enfant", sizes: "Pointures 24-35" },
            ].map((c) => (
              <Link key={c.cat} to={`/catalogue?category=${c.cat}`} className="group">
                <div className="relative rounded-3xl overflow-hidden bg-[#4A7C59] p-10 text-white hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 h-64 flex flex-col justify-end">
                  <div className="absolute top-8 left-10 opacity-20 group-hover:opacity-40 transition-opacity">
                    <Leaf className="h-16 w-16" />
                  </div>
                  <h3 className="text-3xl font-bold">{c.label}</h3>
                  <p className="text-white/70 mt-2 font-medium">{c.sizes}</p>
                  <ArrowRight className="absolute bottom-10 right-10 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured products */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between mb-12">
            <h2 className="text-3xl font-bold text-[#2D5A43]">Nouveautés</h2>
            <Link to="/catalogue">
              <Button variant="ghost" className="text-[#2D5A43] hover:bg-[#E8F0EB] rounded-full">
                Voir tout <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>

          {loading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="h-10 w-10 animate-spin text-[#2D5A43]" />
            </div>
          ) : featured.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {featured.map((p: any) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
              <p className="text-gray-500 italic">Aucun produit disponible dans le catalogue pour le moment.</p>
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
}