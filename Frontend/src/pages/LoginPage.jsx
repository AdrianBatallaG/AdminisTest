import { useMemo, useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogIn, Mail, Lock, AlertCircle, Send, CheckCircle2 } from 'lucide-react';

export const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');
  const [loading, setLoading] = useState(false);
  const [sendingVerification, setSendingVerification] = useState(false);
  const [showResend, setShowResend] = useState(false);
  const { login, resendVerificationEmail } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const locationMessage = useMemo(() => location.state?.message || '', [location.state]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setInfo('');
    setShowResend(false);
    setLoading(true);

    const result = await login(email, password);

    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.error || 'Error al iniciar sesion');
      if (result.code === 'EMAIL_NOT_VERIFIED') {
        setShowResend(true);
      }
    }

    setLoading(false);
  };

  const handleResendVerification = async () => {
    setSendingVerification(true);
    setError('');
    setInfo('');

    const result = await resendVerificationEmail(email);

    if (result.success) {
      setInfo(result.message || 'Correo de verificacion reenviado.');
    } else {
      setError(result.error || 'No se pudo reenviar el correo de verificacion.');
    }

    setSendingVerification(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 p-4">
      <div className="card max-w-md w-full">
        <div className="text-center mb-8">
          <img
            src="/images/logo.png"
            alt="Parroquia San Francisco de Asis"
            className="h-24 w-auto mx-auto mb-4"
          />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Iniciar Sesion</h1>
          <p className="text-gray-600">Parroquia San Francisco de Asis - Calderon</p>
        </div>

        {locationMessage && (
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg flex items-start gap-3">
            <CheckCircle2 className="text-blue-500 flex-shrink-0 mt-0.5" size={20} />
            <p className="text-sm text-blue-800">{locationMessage}</p>
          </div>
        )}

        {info && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-start gap-3">
            <CheckCircle2 className="text-green-500 flex-shrink-0 mt-0.5" size={20} />
            <p className="text-sm text-green-800">{info}</p>
          </div>
        )}

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
            <AlertCircle className="text-red-500 flex-shrink-0 mt-0.5" size={20} />
            <p className="text-sm text-red-800">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Correo Electronico
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                id="email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="input-field pl-10"
                placeholder="correo@ejemplo.com"
                required
              />
            </div>
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              Contrasena
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                id="password"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="input-field pl-10"
                placeholder="********"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full btn-primary flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                <span>Iniciando sesion...</span>
              </>
            ) : (
              <>
                <LogIn size={20} />
                <span>Iniciar Sesion</span>
              </>
            )}
          </button>
        </form>

        {showResend && (
          <button
            type="button"
            onClick={handleResendVerification}
            disabled={sendingVerification || !email}
            className="mt-4 w-full btn-secondary flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {sendingVerification ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-sage-700"></div>
                <span>Reenviando...</span>
              </>
            ) : (
              <>
                <Send size={18} />
                <span>Reenviar verificacion</span>
              </>
            )}
          </button>
        )}

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            No tienes una cuenta?{' '}
            <Link to="/register" className="text-primary-600 hover:text-primary-700 font-medium">
              Registrate aqui
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};