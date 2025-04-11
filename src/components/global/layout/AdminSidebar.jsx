import { NavLink } from 'react-router-dom';

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const navItems = [
    { name: 'Equipes', path: '/admin/equipes', icon: '🏎️' },
    { name: 'Pilotos', path: '/admin/pilotos', icon: '👤' },
    { name: 'Temporadas', path: '/admin/temporadas', icon: '📅' },
    { name: 'Corridas', path: '/admin/corridas', icon: '🏁' },
    { name: 'Resultados', path: '/admin/resultados', icon: '🏆' },
    { name: 'Usuários', path: '/admin/usuarios', icon: '👥' },
  ];

  return (
    <aside className={`bg-gray-800 text-white fixed h-full transition-all duration-300 ${isOpen ? 'w-64' : 'w-20'}`}>
      <div className="p-4 flex items-center justify-between border-b border-gray-700">
        {isOpen ? (
          <h1 className="text-xl font-bold">F1 Admin</h1>
        ) : (
          <span className="text-xl">🏎️</span>
        )}
      </div>

      <nav className="mt-6">
        <ul>
          {navItems.map((item) => (
            <li key={item.path} className="px-3 py-2">
              <NavLink
                to={item.path}
                className={({ isActive }) => 
                  `flex items-center p-2 rounded-lg transition-colors ${isActive ? 'bg-gray-700' : 'hover:bg-gray-700'}`
                }
              >
                <span className="text-xl mr-3">{item.icon}</span>
                {isOpen && <span>{item.name}</span>}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {/* Collapse Button */}
      <div className="absolute bottom-4 w-full px-3">
        <button
          onClick={toggleSidebar}
          className="w-full flex items-center justify-center p-2 rounded-lg bg-gray-700 hover:bg-gray-600 transition-colors"
        >
          {isOpen ? (
            <>
              <span className="mr-2">↩</span> Recolher
            </>
          ) : (
            <span>↪</span>
          )}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;