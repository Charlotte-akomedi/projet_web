import { useEffect, useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import  ProductCard  from "@/components/ProductCard";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Search, SlidersHorizontal, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getProducts } from "@/lib/api"; //  Utilisation de ton API réelle

export default function Catalogue() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState<any[]>([]); // Utilisation de tes données Prisma
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [priceRange, setPriceRange] = useState([0, 500]);
  const [showFilters, setShowFilters] = useState(false);

  const category = searchParams.get("category");

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      try {
        //  Récupération depuis ton serveur Express port 5000
        const data = await getProducts();
        setProducts(data ?? []);
      } catch (error) {
        console.error("Erreur de chargement des produits:", error);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []); // On charge tout, le filtrage se fait côté client pour plus de fluidité

  const filtered = useMemo(() => {
    return products.filter(p => {
      //  Filtrage par catégorie (respecte Men, Women, Kids de ton Prisma)
      const matchesCategory = !category || p.category === category;
      const matchesSearch = !search || 
        p.name.toLowerCase().includes(search.toLowerCase()) || 
        p.brand.toLowerCase().includes(search.toLowerCase());
      const matchesPrice = Number(p.basePrice) >= priceRange[0] && Number(p.basePrice) <= priceRange[1];
      
      return matchesCategory && matchesSearch && matchesPrice;
    });
  }, [products, category, search, priceRange]);

  const categoryLabels: Record<string, string> = { Men: "Homme", Women: "Femme", Kids: "Enfant" };

  return (
    <Layout>
      <div className="container py-8">
        <h1 className="text-3xl font-bold mb-2 text-[#2D5A43]">
          {category ? `Collection ${categoryLabels[category]}` : "Catalogue Complet"}
        </h1>
        <p className="text-muted-foreground mb-6">
          {filtered.length} modèle{filtered.length !== 1 ? "s" : ""} trouvé{filtered.length !== 1 ? "s" : ""}
        </p>

        {/* Barre de recherche et filtres */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher un modèle, une marque..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="pl-10 rounded-xl"
            />
          </div>
          <Select value={category ?? "all"} onValueChange={v => {
            if (v === "all") {
              searchParams.delete("category");
            } else {
              searchParams.set("category", v);
            }
            setSearchParams(searchParams);
          }}>
            <SelectTrigger className="w-full md:w-48 rounded-xl">
              <SelectValue placeholder="Catégorie" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Toutes les collections</SelectItem>
              <SelectItem value="Men">Homme</SelectItem>
              <SelectItem value="Women">Femme</SelectItem>
              <SelectItem value="Kids">Enfant</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" className="rounded-xl gap-2" onClick={() => setShowFilters(!showFilters)}>
            <SlidersHorizontal className="h-4 w-4" />
            Filtres
          </Button>
        </div>

        {showFilters && (
          <div className="mb-8 p-6 rounded-2xl border bg-[#F9FAF9] animate-in fade-in slide-in-from-top-2 duration-300">
            <label className="text-sm font-bold text-[#2D5A43] mb-4 block">
              Budget : {priceRange[0]}€ - {priceRange[1]}€
            </label>
            <Slider
              min={0}
              max={500}
              step={10}
              value={priceRange}
              onValueChange={setPriceRange}
              className="max-w-md"
            />
          </div>
        )}

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="h-12 w-12 animate-spin text-[#2D5A43] mb-4" />
            <p className="text-gray-500">Chargement de la collection...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 bg-gray-50 rounded-3xl border-2 border-dashed">
            <p className="text-muted-foreground font-medium">Aucun modèle ne correspond à vos critères.</p>
            <Button variant="link" onClick={() => { setSearch(""); setPriceRange([0, 500]); }} className="text-[#2D5A43]">
              Réinitialiser les filtres
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {filtered.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        )}
      </div>
    </Layout>
  );
}