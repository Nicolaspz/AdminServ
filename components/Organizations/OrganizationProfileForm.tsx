import { useState, useRef, ChangeEvent, FormEvent, useContext } from 'react';
import { toast } from 'react-toastify';
import { AuthContext } from '../../contexts/AuthContext';
import { setupAPIClient } from "../../services/api";
import { API_BASE_URL } from '../../config';

interface Organization {
  id: string;
  name: string;
  address: string;
  nif: string;
  imageLogo?: string | null;
}

interface OrganizationProfileFormProps {
  organization: Organization;
  onUpdateSuccess?: (updatedOrg: Organization) => void;
}

const OrganizationProfileForm = ({ organization, onUpdateSuccess }: OrganizationProfileFormProps) => {
  const [formData, setFormData] = useState<Organization>(organization);
  const [preview, setPreview] = useState<string | null>(organization.imageLogo || null);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const apiClient = setupAPIClient();
  const { user } = useContext(AuthContext);
  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      const file = e.target.files[0];
      
      // Cria preview da nova imagem
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);

      // Atualiza o estado com o novo arquivo
      setFormData(prev => ({ ...prev, imageLogo: file.name }));
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name);
      formDataToSend.append('address', formData.address);
      formDataToSend.append('nif', formData.nif);

      if (fileInputRef.current?.files?.[0]) {
        formDataToSend.append('imageLogo', fileInputRef.current.files[0]);
      }

      const response = await apiClient.put(
        `/organization/${organization.id}`, 
        formDataToSend,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${user.token}`
          }
        }
      );

      toast.success('Organização atualizada com sucesso!');
      onUpdateSuccess?.(response.data);
    } catch (error) {
      console.error('Erro completo:', error);
      const errorMessage = error.response?.data?.error || 
                         error.response?.data?.message || 
                         error.message ||
                         'Erro ao atualizar organização';
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
};

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center">Perfil da Organização</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Campo de Imagem */}
        <div className="flex flex-col items-center">
          <div className="w-32 h-32 mb-4 rounded-full overflow-hidden border-2 border-gray-200">
            {preview ? (
              <img  
                src={preview.startsWith('data:') ? preview : `${API_BASE_URL}/tmp/${formData.imageLogo}`} 
                alt="Logo da organização" 
                className="w-full h-full object-cover" 
              />
            ) : (
              <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                <span className="text-gray-400">Sem logo</span>
              </div>
            )}
          </div>
          
          <label className="cursor-pointer bg-blue-50 text-blue-700 px-4 py-2 rounded-md hover:bg-blue-100">
            Alterar Logo
            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
          </label>
        </div>

        {/* Campos do formulário */}
        <div className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Nome
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
              disabled={isLoading}
            />
          </div>

          <div>
            <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
              Endereço
            </label>
            <input
              type="text"
              id="address"
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
              disabled={isLoading}
            />
          </div>

          <div>
            <label htmlFor="nif" className="block text-sm font-medium text-gray-700 mb-1">
              NIF
            </label>
            <input
              type="text"
              id="nif"
              name="nif"
              value={formData.nif}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
              disabled={isLoading}
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isLoading ? 'Atualizando...' : 'Atualizar Dados'}
        </button>
      </form>
    </div>
  );
};

export default OrganizationProfileForm;