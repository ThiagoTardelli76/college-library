'use client';
import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';

interface Book {
  id: number;
  title: string;
  author: string;
  is_rented: boolean;
  student_id?: number | null;
  student_name?: string;
}

export default function AdminBooks() {
  const { isAuthenticated } = useAuth();
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchBooks = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/books');
      if (!response.ok) throw new Error('Erro ao carregar livros');
      const data = await response.json();
      setBooks(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchBooks();
    }
  }, [isAuthenticated]);

  const handleReturn = async (bookId: number) => {
    if (!confirm('Deseja marcar este livro como disponível?')) return;
    
    try {
      const response = await fetch(`http://localhost:8000/api/books/${bookId}/return`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erro ao liberar livro');
      }

      // Atualiza o estado local sem precisar recarregar tudo
      setBooks(books.map(book => 
        book.id === bookId ? { ...book, is_rented: false, student_id: null } : book
      ));
      
      alert('Livro liberado com sucesso!');
    } catch (err) {
      console.error('Erro ao liberar livro:', err);
      alert(err instanceof Error ? err.message : 'Erro desconhecido');
    }
  };

  if (!isAuthenticated) return <div>Redirecionando para login...</div>;
  if (loading) return <div>Carregando livros...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Livros Alugados</h1>
      
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded-lg overflow-hidden">
          <thead className="bg-gray-800 text-white">
            <tr>
              <th className="py-3 px-4 text-left">Título</th>
              <th className="py-3 px-4 text-left">Autor</th>
              <th className="py-3 px-4 text-left">Status</th>
              <th className="py-3 px-4 text-left">Alugado por</th>
              <th className="py-3 px-4 text-left">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {books.filter(book => book.is_rented).map(book => (
              <tr key={book.id} className="hover:bg-gray-50">
                <td className="py-4 px-4">{book.title}</td>
                <td className="py-4 px-4">{book.author}</td>
                <td className="py-4 px-4">
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    book.is_rented ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                  }`}>
                    {book.is_rented ? 'Alugado' : 'Disponível'}
                  </span>
                </td>
                <td className="py-4 px-4">
                  {book.student_id ? `ID: ${book.student_id}` : '-'}
                </td>
                <td className="py-4 px-4">
                  <button
                    onClick={() => handleReturn(book.id)}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded"
                  >
                    Liberar Livro
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {books.filter(book => book.is_rented).length === 0 && (
          <div className="text-center py-8 text-gray-500">
            Nenhum livro alugado no momento.
          </div>
        )}
      </div>
    </div>
  );
}