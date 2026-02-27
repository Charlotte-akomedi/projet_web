import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ShoppingCart, Menu, X, Leaf, User, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { api } from "@/lib/api";

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  useEffect(() => {
    // ✅ Si Charlotte se déconnecte, on force le badge à 0 immédiatement
    if (!user) {
      setCartCount(0);
      return;
    }

    const fetchCartCount = async () => {
      try {
        const res = await api.get("/cart");
        setCartCount(res.data.length);
      } catch (err) {
        setCartCount(0);
      }
    };

    fetchCartCount();
    const interval = setInterval(fetchCartCount, 5000);
    return () => clearInterval(interval);
  }, [user]);

  return (
    <header className="sticky top-0 z-50 border-b bg-white/90 backdrop-blur-md">
      <div className="container mx-auto flex h-20 items-center justify-between px-6">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 font-bold text-xl text-[#2D5A43]">
          <Leaf className="h-6 w-6" />
          <span>Sneakers Family</span>
        </Link>

        {/* ✅ RETOUR DES MENUS (Qui étaient partis !) */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-600">
          <Link to="/catalogue" className="hover:text-[#2D5A43] transition-colors">Catalogue</Link>
          <Link to="/catalogue?category=Men" className="hover:text-[#2D5A43] transition-colors">Homme</Link>
          <Link to="/catalogue?category=Women" className="hover:text-[#2D5A43] transition-colors">Femme</Link>
          <Link to="/catalogue?category=Kids" className="hover:text-[#2D5A43] transition-colors">Enfant</Link>
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-4">
          <button onClick={() => navigate("/panier")} className="relative p-2 text-gray-600 hover:text-[#2D5A43]">
            <ShoppingCart className="h-6 w-6" />
            {cartCount > 0 && (
              <span className="absolute top-0 right-0 bg-[#2D5A43] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full border-2 border-white">
                {cartCount}
              </span>
            )}
          </button>

          {user ? (
            <div className="hidden md:flex items-center gap-4">
              <div className="flex items-center gap-2 px-4 py-2 bg-[#F0F7F2] rounded-full text-[#2D5A43] font-bold border border-[#DCEBE1]">
                <User className="h-4 w-4" />
                <span>{user.name}</span>
              </div>
              <button onClick={() => { logout(); navigate("/"); }} className="text-gray-400 hover:text-red-500">
                <LogOut className="h-5 w-5" />
              </button>
            </div>
          ) : (
            <Button onClick={() => navigate("/login")} className="bg-[#2D5A43]">Connexion</Button>
          )}

          <button className="md:hidden" onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>
    </header>
  );
}