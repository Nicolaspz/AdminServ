import { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../../contexts/AuthContext';
import OrganizationProfileForm from '../../components/Organizations/OrganizationProfileForm';
import Sidebar from '../../components/Sidebar';
import Header from '../../components/Header';

interface Organization {
  id: string;
  name: string;
  address: string;
  nif: string;
  imageLogo: string;
  
}

interface User {
  id: string;
  name: string;
  email: string;
  user_name: string;
  role: string;
  organizationId: string;
  address: string;
  imageLogo: string;
  nif: string;
  name_org: string;
    
}

function DashboardPage() {
  const { user } = useContext(AuthContext);
  const [organization, setOrganization] = useState<Organization | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user) {
      // Extrai os dados da organização do usuário
      //console.log("usuario",user);
      const orgData = {
        id: user.organizationId,
        name: user.name_org,
        address: user.address,
        nif: user.nif,
        imageLogo: user.imageLogo,
       
      };
      setOrganization(orgData);
      setIsLoading(false);
    }
  }, [user]);

  const handleUpdateSuccess = (updatedOrg: Organization) => {
    console.log('Organização atualizada:', updatedOrg);
    // Atualiza o estado local com os novos dados
    setOrganization(updatedOrg);
    // Aqui você pode atualizar o contexto se necessário
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-4">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  if (!user || !organization) {
    return (
      <div className="container mx-auto p-4">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          Dados da organização não disponíveis
        </div>
      </div>
    );
  }

  return (
    <Sidebar>
      <Header />
    <div className="container mx-auto mr-1.2 px-4 py-8 max-w-6xl">
      <OrganizationProfileForm 
        organization={organization} 
        onUpdateSuccess={handleUpdateSuccess} 
      />
      </div>
      </Sidebar>
  );
}

export default DashboardPage;