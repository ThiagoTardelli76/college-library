'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface BookFormProps {
  initialData?: {
    id?: number;
    title: string;
    author: string;
    published_date: string;
  };
}

export default function BookForm({ initialData }: BookFormProps) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    published_date: ''
  });
  const [error, setError] = useState('');

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title,
        author: initialData.author,
        published_date: initialData.published_date.split('T')[0]
      });
    }
  }, [initialData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Envia no formato YYYY-MM-DD que o input date já fornece
      const response = await fetch('http://localhost:8000/api/books', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: formData.title,
          author: formData.author,
          published_date: formData.published_date // Já está no formato correto
        }),
      });
  
      if (!response.ok) throw new Error('Erro ao salvar livro');
      router.push('/admin/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
    }
  };


  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md text-black">
      <h2 className="text-xl font-semibold mb-4">
        {initialData?.id ? 'Editar Livro' : 'Adicionar Livro'}
      </h2>
      {error && <div className="text-red-500 mb-4">{error}</div>}
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Título</label>
          <input
            type="text"
            className="w-full px-3 py-2 border rounded"
            value={formData.title}
            onChange={(e) => setFormData({...formData, title: e.target.value})}
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Autor</label>
          <input
            type="text"
            className="w-full px-3 py-2 border rounded"
            value={formData.author}
            onChange={(e) => setFormData({...formData, author: e.target.value})}
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Data de Publicação</label>
          <input
            type="date"
            className="w-full px-3 py-2 border rounded"
            value={formData.published_date}
            onChange={(e) => setFormData({...formData, published_date: e.target.value})}
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
