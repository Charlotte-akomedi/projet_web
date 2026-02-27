import { ShoppingCart } from "lucide-react";
import { Link } from "react-router-dom"; // ✅ Ajout du lien

interface ProductCardProps {
  product: {
    id: string;
    name: string;
    brand: string;
    basePrice: number;
    imageUrl: string;
  };
}

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <div className="bg-white rounded-3xl shadow-sm hover:shadow-xl transition-all p-4 flex flex-col h-full border border-gray-100 group">
      {/* ✅ Cliquer sur l'image redirige vers les détails */}
      <Link to={`/product/${product.id}`} className="block">
        <div className="h-48 w-full overflow-hidden rounded-2xl mb-4 bg-[#F9FAF9] flex items-center justify-center">
          <img
            src={product.imageUrl || "/placeholder.svg"}
            alt={product.name}
            className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
        </div>
      </Link>

      <div className="flex-grow">
        <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">{product.brand}</p>
        <Link to={`/product/${product.id}`}>
          <h2 className="text-sm font-semibold line-clamp-2 h-10 hover:text-[#2D5A43] transition-colors">
            {product.name}
          </h2>
        </Link>
      </div>

      <div className="mt-4 flex items-center justify-between">
        <span className="text-lg font-bold text-[#2D5A43]">
          {product.basePrice} €
        </span>

        <Link to={`/product/${product.id}`}>
           <button className="bg-[#2D5A43] text-white p-2.5 rounded-xl hover:bg-[#1A3326] transition-all active:scale-90">
             <ShoppingCart size={18} />
           </button>
        </Link>
      </div>
    </div>
  );
}