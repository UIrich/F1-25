import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:3000/api';

function UsuariosCRUD() {
  const [usuarios, setUsuarios] = useState([]);
  const [formData, setFormData] = useState({
    nome_usuario: '',
    email_usuario: '',
    senha_usuario: ''
  });
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchUsuarios();
  }, []);

  const fetchUsuarios = async () => {
    try {
      const response = await axios.get(`${API_URL}/usuarios`);
      setUsuarios(response.data);
      setLoading(false);
    } catch (err) {
      setError('Erro ao carregar usuários');
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await axios.put(`${API_URL}/usuarios/${editingId}`, formData);
      } else {
        await axios.post(`${API_URL}/usuarios`, formData);
      }
      fetchUsuarios();
      resetForm();
    } catch (err) {
      setError(err.response?.data?.erro || 'Erro ao salvar usuário');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Tem certeza que deseja excluir este usuário?')) {
      try {
        await axios.delete(`${API_URL}/usuarios/${id}`);
        fetchUsuarios();
      } catch (err) {
        setError('Erro ao excluir usuário');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      nome_usuario: '',
      email_usuario: '',
      senha_usuario: ''
    });
    setEditingId(null);
  };

  if (loading) return <div className="p-4">Carregando...</div>;
  if (error) return <div className="p-4 text-red-500">{error}</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Gerenciamento de Usuários</h1>
      
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <h2 className="text-xl font-semibold mb-4">
          {editingId ? `Editando Usuário #${editingId}` : 'Novo Usuário'}
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nome*</label>
              <input
                type="text"
                className="w-full p-2 border rounded"
                value={formData.nome_usuario}
                onChange={(e) => setFormData({...formData, nome_usuario: e.target.value})}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email*</label>
              <input
                type="email"
                className="w-full p-2 border rounded"
                value={formData.email_usuario}
                onChange={(e) => setFormData({...formData, email_usuario: e.target.value})}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {editingId ? 'Nova Senha' : 'Senha*'}
              </label>
              <input
                type="password"
                className="w-full p-2 border rounded"
                value={formData.senha_usuario}
                onChange={(e) => setFormData({...formData, senha_usuario: e.target.value})}
                required={!editingId}
              />
            </div>
          </div>
          
          <div className="flex justify-end space-x-2">
            {editingId && (
              <button
                type="button"
                onClick={resetForm}
                className="px-4 py-2 bg-gray-500 text-white rounded"
              >
                Cancelar
              </button>
            )}
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded"
            >
              {editingId ? 'Atualizar' : 'Cadastrar'}
            </button>
          </div>
        </form>
      </div>
      
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <table className="min-w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-3 text-left">ID</th>
              <th className="px-6 py-3 text-left">Nome</th>
              <th className="px-6 py-3 text-left">Email</th>
              <th className="px-6 py-3 text-left">Cadastro</th>
              <th className="px-6 py-3 text-left">Ações</th>
            </tr>
          </thead>
          <tbody>
            {usuarios.map((usuario) => (
              <tr key={usuario.id_usuario} className="border-t hover:bg-gray-50">
                <td className="px-6 py-4">{usuario.id_usuario}</td>
                <td className="px-6 py-4">{usuario.nome_usuario}</td>
                <td className="px-6 py-4">{usuario.email_usuario}</td>
                <td className="px-6 py-4">
                  {new Date(usuario.cadastro_usuario).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 space-x-2">
                  <button
                    onClick={() => {
                      setFormData({
                        nome_usuario: usuario.nome_usuario,
                        email_usuario: usuario.email_usuario,
                        senha_usuario: ''
                      });
                      setEditingId(usuario.id_usuario);
                    }}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleDelete(usuario.id_usuario)}
                    className="text-red-600 hover:text-red-800"
                  >
                    Excluir
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default UsuariosCRUD;