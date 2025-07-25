import React, { useState, useEffect, useRef, useContext } from 'react';
import { FaPlus, FaMinus, FaShoppingCart, FaTimes, FaUtensils, FaSpinner } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import { API_BASE_URL } from '../../../../config';
import { setupAPIClient } from '../../../../services/api';
import { AuthContext } from '../../../../contexts/AuthContext';
import { toast, ToastContainer } from 'react-toastify';
import { useRouter } from 'next/router';

type Product = {
  id: string;
  name: string;
  description: string;
  banner?: string;
  unit: string;
  isIgredient: boolean;
  isDerived?: boolean;
  PrecoVenda: { preco_venda: number }[];
  Category: { name: string; id: string };
};

type CartItem = {
  product: Product;
  quantity: number;
};

const ProductMenu = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [groupedProducts, setGroupedProducts] = useState<Record<string, Product[]>>({});
  const [cart, setCart] = useState<CartItem[]>([]);
  const [showCart, setShowCart] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useContext(AuthContext);
  const apiClient = setupAPIClient();
  const router = useRouter();
  const { organizationId, number } = router.query;
  
  const categoryRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const productsResponse = await apiClient.get('/produts', {
          params: { organizationId: user?.organizationId },
          headers: { Authorization: `Bearer ${user?.token}` }
        });

        const processedProducts = productsResponse.data.map((product: Product) => ({
          ...product,
          PrecoVenda: product.PrecoVenda || [{ preco_venda: 0 }]
        }));

        const filteredProducts = processedProducts.filter(
          (product: Product) => product.isIgredient === false
        );

        setProducts(filteredProducts);
        groupProductsByCategory(filteredProducts);
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error('Erro ao carregar produtos');
      }
    };

    if (user) fetchData();
  }, [user]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setActiveCategory(entry.target.id);
          }
        });
      },
      { threshold: 0.5, rootMargin: '-100px 0px -50% 0px' }
    );

    Object.values(categoryRefs.current).forEach(ref => {
      if (ref) observer.observe(ref);
    });

    return () => observer.disconnect();
  }, [groupedProducts]);

  const groupProductsByCategory = (products: Product[]) => {
    const grouped: Record<string, Product[]> = {};
    products.forEach(product => {
      const categoryName = product.Category?.name || 'Sem Categoria';
      if (!grouped[categoryName]) {
        grouped[categoryName] = [];
      }
      grouped[categoryName].push(product);
    });
    setGroupedProducts(grouped);
    
    const firstCategory = Object.keys(grouped)[0];
    setActiveCategory(firstCategory);
  };

  const scrollToCategory = (category: string) => {
    const formattedCategory = category.replace(/\s+/g, '-');
    const element = categoryRefs.current[formattedCategory];
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const addToCart = (product: Product) => {
    setSelectedProduct(product);
    setQuantity(1);
  };

  const confirmAddToCart = () => {
    if (!selectedProduct) return;

    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.product.id === selectedProduct.id);
      
      if (existingItem) {
        return prevCart.map(item =>
          item.product.id === selectedProduct.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        return [...prevCart, { product: selectedProduct, quantity }];
      }
    });

    setSelectedProduct(null);
  };

  const updateCartItem = (productId: string, newQuantity: number) => {
    if (newQuantity < 1) return;

    setCart(prevCart =>
      prevCart.map(item =>
        item.product.id === productId
          ? { ...item, quantity: newQuantity }
          : item
      )
    );
  };

  const removeFromCart = (productId: string) => {
    setCart(prevCart => prevCart.filter(item => item.product.id !== productId));
  };

  const submitOrder = async () => {
    if (!user || !number || !organizationId || cart.length === 0) return;
    
    setIsSubmitting(true);
    
    try {
      const items = cart.map(item => ({
        productId: item.product.id,
        amount: item.quantity
      }));

      const response = await apiClient.post('/orders/with-stock', {
        tableNumber: Number(number),
        organizationId: user.organizationId,
        items,
        customerName: `Pedido Mesa ${number}`
      });

      if (response.data.success) {
        toast.success('Pedido criado com sucesso!');
        setCart([]);
        setShowCart(false);
      }
    } catch (error: any) {
      console.error("Error submitting order:", error);
      toast.error(error.response?.data?.error || 'Erro ao enviar pedido');
    } finally {
      setIsSubmitting(false);
    }
  };

  const calculateTotal = () => {
    return cart.reduce((total, item) => {
      const price = item.product.PrecoVenda[0]?.preco_venda || 0;
      return total + (price * item.quantity);
    }, 0);
  };

  return (
    <div className="bg-gray-50 min-h-screen pb-20">
      <ToastContainer position="top-right" autoClose={3000} />
      
      <header className="sticky top-0 bg-white shadow-sm z-20">
        <div className="p-4 flex justify-between items-center">
          <h1 className="text-xl font-bold">Cardápio</h1>
          <button 
            onClick={() => setShowCart(!showCart)}
            className="relative p-2 text-gray-700 hover:text-blue-600"
            disabled={isSubmitting}
          >
            <FaShoppingCart size={24} />
            {cart.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {cart.reduce((total, item) => total + item.quantity, 0)}
              </span>
            )}
          </button>
        </div>
        
        <div className="overflow-x-auto bg-white border-t">
          <div className="flex space-x-4 px-4 py-2">
            {Object.keys(groupedProducts).map(category => (
              <button
                key={category}
                onClick={() => scrollToCategory(category)}
                className={`whitespace-nowrap px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                  activeCategory === category 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        {Object.entries(groupedProducts).map(([category, products]) => {
          const categoryId = category.replace(/\s+/g, '-');
          return (
            <section 
              key={category}
              id={categoryId}
              ref={el => categoryRefs.current[categoryId] = el as HTMLDivElement}
              className="mb-12 pt-4"
            >
              <h2 className="text-xl font-bold text-gray-800 mb-4">{category}</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {products.map(product => (
                  <motion.div 
                    key={product.id}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.98 }}
                    className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition-shadow relative group"
                    onClick={() => addToCart(product)}
                  >
                    <div className="relative aspect-square">
                      {product.banner ? (
                        <img
                          src={`${API_BASE_URL}/tmp/${product.banner}`}
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                          <FaUtensils className="text-gray-400 text-3xl" />
                        </div>
                      )}
                      
                      <div className="absolute inset-0 bg-black bg-opacity-70 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center p-4">
                        <p className="text-white text-sm text-center line-clamp-5">
                          {product.description || "Sem descrição disponível"}
                        </p>
                      </div>
                    </div>
                    <div className="p-3">
                      <h3 className="font-semibold text-gray-800 truncate">{product.name}</h3>
                      <p className="text-blue-600 font-bold">
                        {product.PrecoVenda[0]?.preco_venda?.toFixed(2)} Kz
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </section>
          );
        })}
      </div>

      <AnimatePresence>
        {selectedProduct && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-30 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white rounded-lg p-6 w-full max-w-md"
            >
              <h3 className="text-lg font-bold mb-4">{selectedProduct.name}</h3>
              <div className="flex items-center justify-between mb-6">
                <button 
                  onClick={() => setQuantity(q => Math.max(1, q - 1))}
                  className="p-2 rounded-full bg-gray-200 hover:bg-gray-300"
                >
                  <FaMinus />
                </button>
                <span className="text-xl font-bold">{quantity}</span>
                <button 
                  onClick={() => setQuantity(q => q + 1)}
                  className="p-2 rounded-full bg-gray-200 hover:bg-gray-300"
                >
                  <FaPlus />
                </button>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setSelectedProduct(null)}
                  className="flex-1 py-2 border border-gray-300 rounded-lg hover:bg-gray-100"
                >
                  Cancelar
                </button>
                <button
                  onClick={confirmAddToCart}
                  className="flex-1 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Adicionar
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showCart && (
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30 }}
            className="fixed top-0 right-0 h-full w-full sm:w-96 bg-white shadow-lg z-40"
          >
            <div className="p-4 h-full flex flex-col">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Seu Pedido Mesa Nº {number} </h2>
                <button 
                  onClick={() => setShowCart(false)}
                  className="text-gray-500 hover:text-gray-700"
                  disabled={isSubmitting}
                >
                  <FaTimes />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto mb-4">
                {cart.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    Seu carrinho está vazio
                  </div>
                ) : (
                  <ul className="divide-y">
                    {cart.map(item => (
                      <li key={item.product.id} className="py-3">
                        <div className="flex justify-between">
                          <div className="flex-1">
                            <h3 className="font-medium">{item.product.name}</h3>
                            <p className="text-sm text-gray-600">
                              {item.product.PrecoVenda[0]?.preco_venda?.toFixed(2)} Kz × {item.quantity}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => updateCartItem(item.product.id, item.quantity - 1)}
                              className="p-1 text-gray-500 hover:text-red-500"
                              disabled={isSubmitting}
                            >
                              <FaMinus size={12} />
                            </button>
                            <span className="w-6 text-center">{item.quantity}</span>
                            <button
                              onClick={() => updateCartItem(item.product.id, item.quantity + 1)}
                              className="p-1 text-gray-500 hover:text-green-500"
                              disabled={isSubmitting}
                            >
                              <FaPlus size={12} />
                            </button>
                            <button
                              onClick={() => removeFromCart(item.product.id)}
                              className="p-1 text-gray-500 hover:text-red-500 ml-2"
                              disabled={isSubmitting}
                            >
                              <FaTimes size={14} />
                            </button>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <div className="border-t pt-4">
                <div className="flex justify-between font-bold text-lg mb-4">
                  <span>Total:</span>
                  <span>{calculateTotal().toFixed(2)} Kz</span>
                </div>
                <button
                  onClick={submitOrder}
                  disabled={cart.length === 0 || isSubmitting}
                  className={`w-full py-3 rounded-lg font-bold flex items-center justify-center ${
                    cart.length === 0 || isSubmitting
                      ? 'bg-gray-300 cursor-not-allowed'
                      : 'bg-green-600 hover:bg-green-700 text-white'
                  }`}
                >
                  {isSubmitting ? (
                    <>
                      <FaSpinner className="animate-spin mr-2" />
                      Processando...
                    </>
                  ) : (
                    'Finalizar Pedido'
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProductMenu;