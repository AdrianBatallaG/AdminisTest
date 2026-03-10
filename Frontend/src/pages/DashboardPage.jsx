import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LayoutDashboard, Shield, FileText, PenSquare } from 'lucide-react';

const roleLabels = {
  usuario: 'Usuario',
  editor: 'Editor',
  admin: 'Administrador',
};

export const DashboardPage = () => {
  const { user } = useAuth();

  const quickActions = [
    {
      title: 'Solicitudes',
      description: 'Gestiona solicitudes y tramites disponibles para tu cuenta.',
      icon: FileText,
      link: '/solicitudes',
      roles: ['usuario', 'editor', 'admin'],
    },
    {
      title: 'Obituario',
      description: 'Administra contenido del obituario parroquial.',
      icon: PenSquare,
      link: '/obituario',
      roles: ['editor', 'admin'],
    },
    {
      title: 'Gestion de usuarios',
      description: 'Sube o baja de rol a cualquier usuario del sistema.',
      icon: Shield,
      link: '/admin/usuarios',
      roles: ['admin'],
    },
  ];

  return (
    <div className="space-y-6">
      <div className="card">
        <div className="flex items-center gap-4 mb-4">
          <div className="p-3 rounded-lg bg-sage-100 text-sage-700">
            <LayoutDashboard size={28} />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Panel principal</h1>
            <p className="text-sm text-gray-600">Bienvenido, {user?.name}. Rol actual: {roleLabels[user?.role] || 'Usuario'}.</p>
          </div>
        </div>
        <p className="text-gray-700">
          Desde este panel puedes ver acciones disponibles segun tu rol. El menu lateral se ajusta automaticamente con tus permisos.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {quickActions
          .filter((action) => action.roles.includes(user?.role))
          .map((action) => {
            const Icon = action.icon;

            return (
              <Link key={action.title} to={action.link} className="card hover:shadow-lg transition-all group">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 rounded-md bg-sage-100 text-sage-700 group-hover:bg-sage-200 transition-colors">
                    <Icon size={20} />
                  </div>
                  <h2 className="text-lg font-semibold">{action.title}</h2>
                </div>
                <p className="text-sm text-gray-600">{action.description}</p>
              </Link>
            );
          })}
      </div>
    </div>
  );
};