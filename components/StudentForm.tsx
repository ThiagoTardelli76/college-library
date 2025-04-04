'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface StudentFormProps {
  initialData?: {
    id?: number;
    name: string;
    email: string;
    birthdate: string;
    nif: string;
  };
}

export default function StudentForm({ initialData }: StudentFormProps) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    birthdate: '',
    nif: ''
  });
  const [error, setError] = useState('');

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name,
        email: initialData.email,
        birthdate: initialData.birthdate.split('T')[0],
        nif: initialData.nif
      });
    }
  }, [initialData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Converter a data para o formato esperado pelo backend (d/m/Y)
      const formattedData = {
        ...formData,
        birthdate: formData.birthdate.split('-').reverse().join('/')
      };
  
      const response = await fetch('http://localhost:8000/api/students', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formattedData),
      });
  
      const data = await response.json();
  
      if (!response.ok) {
        // Se for erro de validação (422), mostra os erros específicos
        if (response.status === 422 && data.errors) {
          const errorMessages = Object.values(data.errors).flat().join('\n');
          throw new Error(errorMessages);
        }
        throw new Error(data.message || 'Erro ao cadastrar estudante');
      }
  
      router.push('/admin/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
    }
  };
  

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md text-black">
      <h2 className="text-xl font-semibold mb-4">
        {initialData?.id ? 'Editar Estudante' : 'Adicionar Estudante'}
      </h2>
      {error && <div className="text-red-500 mb-4">{error}</div>}
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Nome Completo</label>
          <input
            type="text"
            className="w-full px-3 py-2 border rounded"
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Email</label>
          <input
            type="email"
            className="w-full px-3 py-2 border rounded"
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Data de Nascimento</label>
          <input
            type="date"
            className="w-full px-3 py-2 border rounded"
            value={formData.birthdate}
            onChange={(e) => setFormData({...formData, birthdate: e.target.value})}
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 mb-2">NIF</label>
          <input
            type="text"
            className="w-full px-3 py-2 border rounded"
            value={formData.nif}
            onChange={(e) => setFormData({...formData, nif: e.target.value})}
            required
          />
        </div>

        <div className="flex justify-end space-x-2">
          <button
            type="button"
            onClick={() => router.push('/admin/dashboard')}
            className="px-4 py-2 border rounded"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Salvar
          </button>
        </div>
      </form>
    </div>
  );
}