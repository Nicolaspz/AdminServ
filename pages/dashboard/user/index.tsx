import Header from "../../../components/Header";
import Head from "next/head";
import styles from './styles.module.scss';
import { FormEvent, useState, useContext, useEffect } from 'react';
import { toast, ToastContainer } from "react-toastify";

import Sidebar from "../../../components/Sidebar";
import { AuthContext } from '../../../contexts/AuthContext';
import { setupAPIClient } from "../../../services/api";
import { FiSearch, FiEdit2, FiTrash2, FiPlus, FiUser } from 'react-icons/fi';
import { ConfirmationModal } from "../../../components/ConfirmationModal";

interface User {
  id: string;
  name: string;
  email: string;
  telefone: string;
  role: string;
  user_name: string;
  created_at?: string;
  updated_at?: string;
}

export default function UserManagement() {
  const { user } = useContext(AuthContext);
  const apiClient = setupAPIClient();
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [userToDelete, setUserToDelete] = useState<string | null>(null);
  
  // Form fields
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    telefone: '',
    user_name: '',
    role: 'CLIENT',
    password: '',
    confirmPassword: ''
  });

  useEffect(() => {
    if (user?.role === "ADMIN") {
      fetchUsers();
    }
  }, [user]);

  useEffect(() => {
    if (searchTerm === "") {
      setFilteredUsers(users);
    } else {
      const filtered = users.filter(user => 
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.user_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.telefone.includes(searchTerm)
      );
      setFilteredUsers(filtered);
    }
  }, [searchTerm, users]);

  const fetchUsers = async () => {
    try {
      const response = await apiClient.get("/users", {
        params: { organizationId: user?.organizationId },
        headers: { Authorization: `Bearer ${user?.token}` },
      });
      setUsers(response.data);
      setFilteredUsers(response.data);
    } catch (error) {
      toast.error("Erro ao carregar usuários");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!userToDelete) return;
    
    try {
      await apiClient.delete(`/user?userId=${userToDelete}`, {
        headers: { Authorization: `Bearer ${user?.token}` }
      });
      toast.success('Usuário removido com sucesso!');
      fetchUsers();
    } catch (error) {
      toast.error('Erro ao remover usuário');
    } finally {
      setIsDeleteModalOpen(false);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (formData.password && formData.password !== formData.confirmPassword) {
      toast.error("As senhas não coincidem!");
      return;
    }

    try {
      if (selectedUser) {
        // Edição
        await apiClient.put(
          `/user?userId=${selectedUser.id}`,
          {
            name: formData.name,
            email: formData.email,
            telefone: formData.telefone,
            user_name: formData.user_name,
            role: formData.role,
            ...(formData.password && { password: formData.password })
          },
          { headers: { Authorization: `Bearer ${user?.token}` } }
        );
        toast.success("Usuário atualizado com sucesso!");
      } else {
        // Criação
        await apiClient.post(
          '/users',
          {
            name: formData.name,
            email: formData.email,
            telefone: formData.telefone,
            user_name: formData.user_name,
            role: formData.role,
            password: formData.password,
            organizationId: user?.organizationId
          },
          { headers: { Authorization: `Bearer ${user?.token}` } }
        );
        toast.success("Usuário criado com sucesso!");
      }
      
      fetchUsers();
      resetForm();
      setIsUserModalOpen(false);
    } catch (error) {
      toast.error("Erro ao salvar usuário");
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      telefone: '',
      user_name: '',
      role: 'CLIENT',
      password: '',
      confirmPassword: ''
    });
    setSelectedUser(null);
  };

  const openEditModal = (user: User) => {
    setSelectedUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      telefone: user.telefone,
      user_name: user.user_name,
      role: user.role,
      password: '',
      confirmPassword: ''
    });
    setIsUserModalOpen(true);
  };

  const openCreateModal = () => {
    resetForm();
    setIsUserModalOpen(true);
  };

  return (
    <>
      <Head>
        <title>Gerenciamento de Usuários - Serve Fixe</title>
      </Head>
      
      <Sidebar>
        <Header />
        
        <div className="container mx-auto px-4 py-8 max-w-7xl">
          <ToastContainer position="top-right" autoClose={5000} theme="dark" />
          
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
            <h1 className="text-2xl font-bold text-slate-200">
              <FiUser className="inline mr-2" />
              Gerenciamento de Usuários
            </h1>
            
            <div className="flex gap-4 mt-4 md:mt-0">
              <div className="relative w-full md:w-64">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiSearch className="text-slate-400" />
                </div>
                <input
                  type="text"
                  className="block w-full pl-10 pr-3 py-2 border border-slate-600 rounded-md leading-5 bg-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent sm:text-sm text-slate-200"
                  placeholder="Pesquisar usuários..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <button
                onClick={openCreateModal}
                className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md flex items-center gap-2 transition-colors"
              >
                <FiPlus /> Novo Usuário
              </button>
            </div>
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center min-h-[300px]">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : (
            <div className="bg-slate-800 shadow rounded-lg overflow-hidden border border-slate-700">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-slate-700">
                  <thead className="bg-slate-700">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                        Nome
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                        Email
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                        Telefone
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                        Usuário
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                        Perfil
                      </th>
                      <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-slate-300 uppercase tracking-wider">
                        Ações
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-slate-800 divide-y divide-slate-700">
                    {filteredUsers.length > 0 ? (
                      filteredUsers.map((user) => (
                        <tr key={user.id} className="hover:bg-slate-700/50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-slate-200">{user.name}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-slate-300">{user.email}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-slate-300">{user.telefone}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-slate-300">{user.user_name}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                              ${user.role === 'ADMIN' ? 'bg-purple-900/50 text-purple-300' : 'bg-green-900/50 text-green-300'}`}>
                              {user.role === 'ADMIN' ? 'Administrador' : 'Usuário'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <button
                              onClick={() => openEditModal(user)}
                              className="text-blue-400 hover:text-blue-300 mr-4"
                            >
                              <FiEdit2 className="inline" />
                            </button>
                            <button
                              onClick={() => {
                                setUserToDelete(user.id);
                                setIsDeleteModalOpen(true);
                              }}
                              className="text-red-400 hover:text-red-300"
                            >
                              <FiTrash2 className="inline" />
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={6} className="px-6 py-4 text-center text-sm text-slate-400">
                          Nenhum usuário encontrado
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Modal de Confirmação de Exclusão */}
        <ConfirmationModal
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          onConfirm={handleDelete}
          title="Confirmar exclusão"
          message="Tem certeza que deseja excluir este usuário? Esta ação não pode ser desfeita."
          confirmText="Excluir"
          
        />

        {/* Modal de Edição/Criação de Usuário */}
        {isUserModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-slate-800 rounded-lg shadow-xl w-full max-w-md border border-slate-700">
              <div className="p-6">
                <h2 className="text-xl font-bold text-slate-200 mb-4">
                  {selectedUser ? 'Editar Usuário' : 'Novo Usuário'}
                </h2>
                
                <form onSubmit={handleSubmit}>
                  <div className="grid gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-1">Nome</label>
                      <input
                        type="text"
                        className="w-full px-3 py-2 border border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-700 text-slate-200"
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-1">Email</label>
                      <input
                        type="email"
                        className="w-full px-3 py-2 border border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-700 text-slate-200"
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-1">Telefone</label>
                      <input
                        type="tel"
                        className="w-full px-3 py-2 border border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-700 text-slate-200"
                        value={formData.telefone}
                        onChange={(e) => setFormData({...formData, telefone: e.target.value})}
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-1">Nome de Usuário</label>
                      <input
                        type="text"
                        className="w-full px-3 py-2 border border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-700 text-slate-200"
                        value={formData.user_name}
                        onChange={(e) => setFormData({...formData, user_name: e.target.value})}
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-1">Perfil</label>
                      <select
                        className="w-full px-3 py-2 border border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-700 text-slate-200"
                        value={formData.role}
                        onChange={(e) => setFormData({...formData, role: e.target.value})}
                        required
                      >
                        <option value="ADMIN">Administrador</option>
                        <option value="CLIENT">Usuário</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-1">
                        {selectedUser ? 'Nova Senha (deixe em branco para manter atual)' : 'Senha'}
                      </label>
                      <input
                        type="password"
                        className="w-full px-3 py-2 border border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-700 text-slate-200"
                        value={formData.password}
                        onChange={(e) => setFormData({...formData, password: e.target.value})}
                        required={!selectedUser}
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-1">Confirmar Senha</label>
                      <input
                        type="password"
                        className="w-full px-3 py-2 border border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-700 text-slate-200"
                        value={formData.confirmPassword}
                        onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                        required={!!formData.password}
                      />
                    </div>
                  </div>
                  
                  <div className="flex justify-end gap-3">
                    <button
                      type="button"
                      onClick={() => setIsUserModalOpen(false)}
                      className="px-4 py-2 border border-slate-600 rounded-md text-sm font-medium text-slate-200 hover:bg-slate-700"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                    >
                      {selectedUser ? 'Salvar Alterações' : 'Criar Usuário'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </Sidebar>
    </>
  )
}