import Header from "../../components/Header";
import Head from "next/head";
import styles from './styles.module.scss';
import { FormEvent, useState, useContext, useEffect } from 'react';
import { toast, ToastContainer } from "react-toastify";
import { canSSRAuth } from "../../utils/canSSRAuth";
import Sidebar from "../../components/Sidebar";
import { AuthContext } from '../../contexts/AuthContext';
import { setupAPIClient } from "../../services/api";
import { FiSearch } from 'react-icons/fi';
import { ConfirmationModal } from "../../components/ConfirmationModal"; 

interface User {
  id: string;
  name: string;
  email?: string;
  telefone: string;
  tipo_pagamento?: string;
  role: string;
  user_name: string;
}

export default function User(){
  const { user, signOut } = useContext(AuthContext);
  const apiClient = setupAPIClient();
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [newPassword, setNewPassword] = useState<string>("");
  const [newPasswordrepeat, setNewPasswordrepeat] = useState<string>("");
  const [newPhone, setNewPhone] = useState<string>("");
  const [newPayment, setNewPayment] = useState<string>("");
  const [newName, setNewName] = useState<string>("");
  const [newEmail, setNewEmail] = useState<string>("");
  const [newRole, setNewRole] = useState<string>("");
  const [newUsername, setNewUsername] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userToDeactivate, setUserToDeactivate] = useState<string | null>(null);

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
        user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.user_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.telefone.includes(searchTerm)
      );
      setFilteredUsers(filtered);
    }
  }, [searchTerm, users]);

  const fetchUsers = async () => {
    try {
      const response = await apiClient.get("/all_users", {
        headers: { Authorization: `Bearer ${user?.token}` },
      });
      setUsers(response.data);
      setFilteredUsers(response.data);
      
    } catch (error) {
      toast.error("Não foi possível carregar os usuários.");
    }
    finally {
    setIsLoading(false); // Desativa o loading em qualquer caso
  }
  };

  const handleDeactivate = async () => {
    if (!userToDeactivate) return;
    
    try {
      await apiClient.put(
        '/user/deactivate',
        { userId: userToDeactivate },
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      toast.success('Usuário desativado!');
      fetchUsers();
    } catch (error) {
      toast.error('Erro ao desativar usuário.');
    }
  };
  const handleUpdateUser = async () => {
    if (!selectedUser) return;
    if (newPassword && newPassword !== newPasswordrepeat) {
      toast.error("As senhas não coincidem!");
      return;
    }
    
    const updatedData: any = {};
    
    if (newPhone.trim()) updatedData.telefone = newPhone;
    if (newPayment.trim()) updatedData.tipo_pagamento = newPayment;
    if (newPassword.trim()) updatedData.password = newPassword;
    if (user?.role === "ADMIN") {
      if (newName.trim()) updatedData.name = newName;
      if (newEmail.trim()) updatedData.email = newEmail;
      if (newRole.trim()) updatedData.role = newRole;
      if (newUsername.trim()) updatedData.user_name = newUsername;
    }

    try {
      await apiClient.put(
        `/user?userId=${selectedUser.id}`,
        updatedData,
        { headers: { Authorization: `Bearer ${user?.token}` } }
      );

      toast.success("Usuário atualizado com sucesso!");
      fetchUsers();
      setModalVisible(false);
      setNewPassword("");
      setNewPasswordrepeat("");
    } catch (error) {
      toast.error("Não foi possível atualizar o usuário.");
    }
  };
  

  return(
    <>
      <Head>
        <title>Usuários - RDB Transportes </title>
      </Head>
      
      <Sidebar>
        <Header />
        
        <div className="container mx-auto px-4 py-8 max-w-6xl">
        <ToastContainer position="top-right" autoClose={5000} />
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">
            {user?.role === "ADMIN" ? "Gerenciamento de Usuários" : "Meu Perfil"}
          </h1>
          
          {user?.role === "ADMIN" && (
            <div className="relative mt-4 md:mt-0 w-full md:w-64">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiSearch className="text-gray-400" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 sm:text-sm"
                placeholder="Pesquisar usuários..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          )}
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center min-h-[300px] gap-4">
            <div className="w-12 h-12 border-4 border-gray-200 border-t-green-500 rounded-full animate-spin"></div>
            <p className="text-gray-600">Carregando usuários...</p>
          </div>
        ) : (
          <>
            {user?.role === "ADMIN" ? (
              <>
                {filteredUsers.length === 0 ? (
                  <div className="bg-white rounded-lg shadow-md p-6 text-center">
                    {searchTerm ? (
                      <p className="text-gray-600">Nenhum usuário encontrado para "{searchTerm}"</p>
                    ) : (
                      <p className="text-gray-600">Nenhum usuário cadastrado</p>
                    )}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredUsers.map((item) => (
                      <div key={item.id} className="bg-white rounded-lg shadow-md p-6">
                        <div className="mb-4">
                          <h3 className="text-xl font-semibold text-gray-800">{item.name}</h3>
                          <p className="text-gray-600">{item.email}</p>
                          <p className="text-sm text-gray-500 mt-1">
                            {item.role === "ADMIN" ? "Administrador" : "Cliente"}
                          </p>
                          <p className="text-sm text-gray-500">Tel: {item.telefone}</p>
                        </div>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => { 
                              setSelectedUser(item);
                              setNewPhone(item.telefone);
                              setNewUsername(item.user_name);
                              setNewPayment(item.tipo_pagamento || "");
                              setNewName(item.name);
                              setNewEmail(item.email || "");
                              setNewRole(item.role);
                              setModalVisible(true);
                            }}
                            className="w-full bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded transition duration-200"
                          >
                            Editar
                          </button>
                          <button
                            onClick={() => {
                              setUserToDeactivate(item.id);
                              setIsModalOpen(true);
                            }}
                            className="w-full bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded transition duration-200"
                          >
                            Desativar
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <button
                onClick={() => {
                  setSelectedUser({
                    id: user.id,
                    name: user.name || '',
                    email: user.email || '',
                    telefone: user.telefone || '',
                    role: user.role || 'CLIENT',
                    user_name: user.user_name || ''
                  });
                  setNewPhone(user?.telefone || "");
                  setNewUsername(user?.user_name || "");
                  setModalVisible(true);
                }}
                className="bg-green-500 hover:bg-green-600 text-white py-2 px-6 rounded transition duration-200"
              >
                Editar Meu Perfil
              </button>
            )}
          </>
        )}

        {/* Modal de Confirmação de Desativação */}
        <ConfirmationModal
          isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleDeactivate}
        title="Desativar usuário?"
        message="O usuário perderá acesso ao sistema. Deseja continuar?"
        confirmText="Desativar"
        />

        {/* Modal de Edição (existente) */}
        {modalVisible && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                {user?.role === "ADMIN" ? "Editar Usuário" : "Editar Perfil"}
              </h2>
              
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-medium mb-1">
                  Nome
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Nome"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-medium mb-1">
                  Usuário
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Username"
                  value={newUsername}
                  onChange={(e) => setNewUsername(e.target.value)}
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-medium mb-1">
                  Telefone
                </label>
                <input
                  type="tel"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Telefone"
                  value={newPhone}
                  onChange={(e) => setNewPhone(e.target.value)}
                />
              </div>
              
              {user?.role === "ADMIN" && (
                <>
                  <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-medium mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                      placeholder="Email"
                      value={newEmail}
                      onChange={(e) => setNewEmail(e.target.value)}
                    />
                  </div>
                  
                  <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-medium mb-1">
                      Perfil
                    </label>
                    <select
                      value={newRole}
                      onChange={(e) => setNewRole(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    >
                      <option value="ADMIN">Administrador</option>
                      <option value="CLIENT">Cliente</option>
                    </select>
                  </div>
                  
                  <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-medium mb-1">
                      Tipo de Pagamento
                    </label>
                    <select
                      value={newPayment}
                      onChange={(e) => setNewPayment(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    >
                      <option value="">Selecionar forma de Pagamento</option>
                      <option value="CONTA_3DIAS">CONTA 3 DIAS</option>
                      <option value="CONTA_7DIAS">CONTA 7 DIAS</option>
                      <option value="CONTA_15DIAS">CONTA 15 DIAS</option>
                      <option value="CONTA_30DIAS">CONTA 30 DIAS</option>
                      <option value="CONTA_24H">CONTA 24H</option>
                    </select>
                  </div>
                </>
              )}
              
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-medium mb-1">
                  Nova Senha
                </label>
                <input
                  type="password"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Nova Senha"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
              </div>
              
              <div className="mb-6">
                <label className="block text-gray-700 text-sm font-medium mb-1">
                  Repetir Senha
                </label>
                <input
                  type="password"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Repetir Senha"
                  value={newPasswordrepeat}
                  onChange={(e) => setNewPasswordrepeat(e.target.value)}
                />
              </div>
              
              <div className="flex gap-3">
                <button
                  onClick={handleUpdateUser}
                  className="flex-1 bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded transition duration-200"
                >
                  Salvar
                </button>
                <button
                  onClick={() => setModalVisible(false)}
                  className="flex-1 bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded transition duration-200"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
          </div>
        )}
      </div>
      </Sidebar>
    </>
  )
}

export const getServerSideProps = canSSRAuth(async (ctx) => {
  return {
    props:{}
  }
})