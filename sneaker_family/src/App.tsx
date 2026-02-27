import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index"; 
import Login from "./pages/Login"; 
import Register from "./pages/Register"; 
import Catalogue from "./pages/Catalogue"; 
import ProductDetail from "./pages/ProductDetail"; // Vérifie bien s'il y a un "s" à Details
import Cart from "./pages/Cart"; //  Ajout de l'import pour le panier
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "./contexts/AuthContext";
import { Toaster } from "@/components/ui/toaster"; // Pour afficher les notifications d'ajout

const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider> 
        <BrowserRouter>
          <Routes>
            {/* Pages principales */}
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/catalogue" element={<Catalogue />} />
            
            {/*  Route dynamique pour la fiche produit */}
            <Route path="/product/:id" element={<ProductDetail />} />
            
            {/* Route pour le panier */}
            <Route path="/panier" element={<Cart />} />
            
          </Routes>
          <Toaster /> {/* Composant nécessaire pour voir les alertes "Ajouté au panier" */}
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;