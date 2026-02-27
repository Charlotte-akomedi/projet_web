import { Leaf } from "lucide-react";
import { Link } from "react-router-dom";

export function Footer() {
  return (
    <footer className="border-t bg-[#F1F3F1] mt-auto"> {/* Fond gris/vert très léger */}
      <div className="container mx-auto py-12 px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 font-bold text-lg mb-3 text-[#2D5A43]">
              <Leaf className="h-5 w-5" />
              <span>Sneakers Family</span>
            </div>
            <p className="text-sm text-gray-600">
              Des sneakers écoresponsables pour toute la famille.
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold mb-3 text-[#2D5A43]">Catégories</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li><Link to="/catalogue?category=homme" className="hover:text-[#2D5A43] transition-colors">Homme</Link></li>
              <li><Link to="/catalogue?category=femme" className="hover:text-[#2D5A43] transition-colors">Femme</Link></li>
              <li><Link to="/catalogue?category=enfant" className="hover:text-[#2D5A43] transition-colors">Enfant</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-3 text-[#2D5A43]">Informations</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li><Link to="/politique-de-confidentialite" className="hover:text-[#2D5A43] transition-colors">Politique de confidentialité</Link></li>
              <li><Link to="/mentions-legales" className="hover:text-[#2D5A43] transition-colors">Mentions légales</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-3 text-[#2D5A43]">Contact</h4>
            <p className="text-sm text-gray-600">contact@sneakersfamily.fr</p>
            <p className="text-sm text-gray-600 mt-1">+33 1 23 45 67 89</p>
          </div>
        </div>
        
        <div className="mt-8 pt-6 border-t border-gray-200 text-center text-xs text-gray-400">
          © {new Date().getFullYear()} Sneakers Family. Tous droits réservés.
        </div>
      </div>
    </footer>
  );
}