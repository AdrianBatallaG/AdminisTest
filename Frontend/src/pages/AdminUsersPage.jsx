import { useEffect, useMemo, useState } from 'react';
import { authService } from '../services/authService';
import { useAuth } from '../context/AuthContext';
import { AlertCircle, CheckCircle2, Shield } from 'lucide-react';

export const AdminUsersPage = () => {
  const { user: currentUser, setAuthenticatedUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [selectedRoles, setSelectedRoles] = useState({});
  const [loading, setLoading] = useState(true);
  const [savingUserId, setSavingUserId] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const roleOptions = useMemo(() => (roles.length ? roles : ['usuario', 'editor', 'admin']), [roles]);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setError('');

      try {
        const [rolesData, usersData] = await Promise.all([
          authService.getRoles(),
          authService.getAdminUsers(),
        ]);

        const loadedUsers = usersData.users || [];
        const loadedRoles = rolesData.roles || [];

        const initialSelected = loadedUsers.reduce((acc, item) => {
          acc[item.id] = item.role || 'usuario';
          return acc;
        }, {});

        setRoles(loadedRoles);
        setUsers(loadedUsers);
        setSelectedRoles(initialSelected);
      } catch (err) {
        setError(err.message || 'No se pudo cargar la administracion de usuarios.');
      }

      setLoading(false);
    };

    loadData();
  }, []);

  const handleRoleChange = (userId, role) => {
    setSelectedRoles((prev) => ({
      ...prev,
      [userId]: role,
    }));
  };

  const saveRole = async (targetUser) => {
    const nextRole = selectedRoles[targetUser.id];

    if (!nextRole || nextRole === targetUser.role) {
      return;
    }

    setSavingUserId(targetUser.id);
    setError('');
    setSuccess('');

    try {
      const response = await authService.updateUserRole(targetUser.id, nextRole);
      const updatedUser = response.user;

      setUsers((prev) => prev.map((item) => (item.id === updatedUser.id ? updatedUser : item)));
      setSelectedRoles((prev) => ({
        ...prev,
        [updatedUser.id]: updatedUser.role,
      }));

      if (currentUser?.id === updatedUser.id) {
        setAuthenticatedUser(updatedUser);
      }

      setSuccess(`Rol actualizado para ${updatedUser.name}.`);
    } catch (err) {
      setError(err.message || 'No se pudo actualizar el rol.');
    }

    setSavingUserId(null);
  };

  if (loading) {
    return (
      <div className="card">
        <p className="text-gray-600">Cargando usuarios...</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="card">
        <div className="flex items-center gap-3 mb-3">
          <div className="p-2 rounded-md bg-sage-100 text-sage-700">
            <Shield size={20} />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Panel Admin de Roles</h1>
            <p className="text-sm text-gray-600">Asciende o desciende de nivel a cualquier usuario.</p>
          </div>
        </div>

        <p className="text-sm text-gray-700">
          Roles disponibles: <span className="font-medium">{roleOptions.join(', ')}</span>.
        </p>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
          <AlertCircle size={18} className="text-red-600 mt-0.5" />
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}

      {success && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg flex items-start gap-2">
          <CheckCircle2 size={18} className="text-green-600 mt-0.5" />
          <p className="text-sm text-green-800">{success}</p>
        </div>
      )}

      <div className="card overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200 text-left">
              <th className="py-3 pr-3">Usuario</th>
              <th className="py-3 pr-3">Correo</th>
              <th className="py-3 pr-3">Verificado</th>
              <th className="py-3 pr-3">Rol actual</th>
              <th className="py-3 pr-3">Nuevo rol</th>
              <th className="py-3">Accion</th>
            </tr>
          </thead>
          <tbody>
            {users.map((item) => {
              const currentRole = item.role || 'usuario';
              const nextRole = selectedRoles[item.id] || currentRole;
              const isSaving = savingUserId === item.id;

              return (
                <tr key={item.id} className="border-b border-gray-100">
                  <td className="py-3 pr-3 font-medium">{item.name}</td>
                  <td className="py-3 pr-3 text-gray-600">{item.email}</td>
                  <td className="py-3 pr-3">
                    {item.email_verified_at ? (
                      <span className="text-green-700">Si</span>
                    ) : (
                      <span className="text-amber-700">No</span>
                    )}
                  </td>
                  <td className="py-3 pr-3 capitalize">{currentRole}</td>
                  <td className="py-3 pr-3">
                    <select
                      className="input-field py-2"
                      value={nextRole}
                      onChange={(event) => handleRoleChange(item.id, event.target.value)}
                      disabled={isSaving}
                    >
                      {roleOptions.map((role) => (
                        <option key={role} value={role}>
                          {role}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="py-3">
                    <button
                      type="button"
                      onClick={() => saveRole(item)}
                      disabled={isSaving || nextRole === currentRole}
                      className="btn-primary px-4 py-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSaving ? 'Guardando...' : 'Actualizar'}
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};