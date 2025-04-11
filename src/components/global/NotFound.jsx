import { Link } from 'react-router-dom';

function NotFoundPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 text-gray-800 p-4">
      <div className="text-center max-w-md">
        <h1 className="text-9xl font-bold text-indigo-600 mb-4">404</h1>
        <h2 className="text-2xl font-semibold mb-2">Página não encontrada</h2>
        <p className="mb-6">
          Oops! A página que você está procurando não existe ou foi movida.
        </p>
        <Link
          to="/"
          className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
        >
          Voltar para a página inicial
        </Link>
      </div>
    </div>
  );
}

export default NotFoundPage;