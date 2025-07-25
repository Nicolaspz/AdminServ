import React, { useState, useContext } from 'react';
import { useRouter } from 'next/router';
import { AuthContext } from "../../../contexts/AuthContext";
import { motion } from 'framer-motion';
import Head from 'next/head';
import { toast } from 'react-toastify';
import { setupAPIClient } from '../../../services/api';

const TableSelection = () => {
  const [tableNumber, setTableNumber] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { user } = useContext(AuthContext);
  const { organizationId } = router.query;
  const apiClient = setupAPIClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!tableNumber.trim() || isNaN(Number(tableNumber))) {
      toast.warning('Por favor, informe um número de mesa válido');
      return;
    }

    setIsLoading(true);

    try {
      const response = await apiClient.get(`/mesa_verify/${tableNumber}`, {
        data: {
          organizationId: user?.organizationId
        },
        headers: {
          Authorization: `Bearer ${user?.token}`
        }
      });

      if (response.data.success) {
        router.push(`/dashboard/cardapio/${user?.organizationId}/${tableNumber}`);
      } else {
        toast.error(response.data.error || 'Mesa não encontrada');
      }
    } catch (error: any) {
      console.error('Erro ao verificar mesa:', error);
      
      if (error.response?.data?.error) {
        toast.error(error.response.data.error);
      } else {
        toast.error('Erro ao verificar mesa');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <Head>
        <title>Selecionar Mesa</title>
      </Head>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md"
      >
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-800">Bem-vindo ao Cardápio Digital</h1>
          <p className="text-gray-600 mt-2">Informe o número da mesa para continuar</p>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label htmlFor="tableNumber" className="block text-sm font-medium text-gray-700 mb-2">
              Número da Mesa
            </label>
            <input
              type="number"
              id="tableNumber"
              min="1"
              value={tableNumber}
              onChange={(e) => setTableNumber(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
              placeholder="Ex: 5"
              required
              autoFocus
            />
          </div>
          
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center"
            disabled={!tableNumber.trim() || isLoading}
          >
            {isLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Verificando...
              </>
            ) : (
              'Acessar Cardápio'
            )}
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
};

export default TableSelection;