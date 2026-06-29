import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index"; 
import Login from "./pages/Login"; 
import Register from "./pages/Register"; 
import Catalogue from "./pages/Catalogue"; 
import ProductDetail from "./pages/ProductDetail"; 
import Cart from "./pages/Cart"; 
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "./contexts/AuthContext";
import { Toaster } from "@/components/ui/toaster"; 

const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider> 
        <BrowserRouter>
          <Routes>
            {}
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/catalogue" element={<Catalogue />} />
            
            {}
            <Route path="/product/:id" element={<ProductDetail />} />
            
            {}
            <Route path="/panier" element={<Cart />} />
            
          </Routes>
          <Toaster /> {}
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;