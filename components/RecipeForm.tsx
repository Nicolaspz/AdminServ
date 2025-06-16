import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { setupAPIClient } from '../services/api';

 const apiClient = setupAPIClient();
type Ingredient = {
  id: string;
  name: string;
  unit: string;
};

type RecipeFormProps = {
  productId: string;
  onAddItem: () => void;
};

const RecipeForm = ({ productId, onAddItem }: RecipeFormProps) => {
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [selectedIngredient, setSelectedIngredient] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Buscar apenas ingredientes (produtos com isDerived = false)
    async function fetchIngredients() {
      try {
        const response = await apiClient.get('/produts', {
          params: { isDerived: false }
        });
        setIngredients(response.data);
      } catch (error) {
        console.error('Error fetching ingredients:', error);
      }
    }
    fetchIngredients();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await apiClient.post('/recipe', {
        productId,
        ingredientsId: selectedIngredient,
        quantity
      });

      toast.success('Ingrediente adicionado com sucesso!');
      setSelectedIngredient('');
      setQuantity(1);
      onAddItem(); // Atualiza a lista de ingredientes
    } catch (error) {
      toast.error('Erro ao adicionar ingrediente');
      console.error('Error adding ingredient:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 bg-gray-800 rounded-lg">
      <div>
        <label className="block text-gray-300 mb-2">Ingrediente</label>
        <select
          value={selectedIngredient}
          onChange={(e) => setSelectedIngredient(e.target.value)}
          className="w-full bg-gray-700 text-white px-4 py-2 rounded"
          required
        >
          <option value="">Selecione um ingrediente</option>
          {ingredients.map((ing) => (
            <option key={ing.id} value={ing.id}>
              {ing.name} ({ing.unit})
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-gray-300 mb-2">Quantidade</label>
        <input
          type="number"
          min="0.01"
          step="0.01"
          value={quantity}
          onChange={(e) => setQuantity(parseFloat(e.target.value))}
          className="w-full bg-gray-700 text-white px-4 py-2 rounded"
          required
        />
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded disabled:opacity-50"
      >
        {isLoading ? 'Adicionando...' : 'Adicionar à receita'}
      </button>
    </form>
  );
};