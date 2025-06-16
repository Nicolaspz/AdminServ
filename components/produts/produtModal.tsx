import { useState, ChangeEvent, FormEvent } from 'react';
import { FaTimes } from 'react-icons/fa';

interface ProductFormData {
  name: string;
  price: number;
  description: string;
  file: File | null;
  categoryId: string;
  organizational: string;  // Nome exato do campo requerido pela API
  unit: string;
  isDerived: boolean;
}

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: ProductFormData) => void;
  categories: Array<{ id: string; name: string }>;
  organizationId: string; // Adicione esta prop
}

export function ProductModal({ 
  isOpen, 
  onClose, 
  onSubmit, 
  categories,
  organizationId 
}: ProductModalProps) {
  const [formData, setFormData] = useState<ProductFormData>({
    name: '',
    price: 0,
    description: '',
    file: null,
    categoryId: '',
    organizational: organizationId, // Use o valor da prop
    unit: 'un',
    isDerived: false,
  });

  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'price' ? parseFloat(value) || 0 : value,
    }));
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFormData(prev => ({ ...prev, file }));
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        {/* ... (restante do código do modal permanece igual) ... */}
      </div>
    </div>
  );
}