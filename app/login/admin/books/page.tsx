'use client';
import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';

interface Book {
  id: number;
  title: string;
  is_available: boolean;
  loans: {
    id: number;
    student: {
      name: string;
    };
    issue_date: string;
  }[];
}

export default function AdminBooksPage() {
  const [books, setBooks] = useState<Book[]>([]);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    const fetchBooks = async () => {
      const res = await fetch('http://localhost:8000/api/books');
      const data = await res.json();
      setBooks(data);
    };
    fetchBooks();
  }, []);

  const handleReturn = async (loanId: number) => {
    try {
      const res = await fetch(`http://localhost:8000/api/loans/${loanId}/return`, {
        method: 'PUT',
      });

      if (!res.ok) throw new Error('Falha na devolução');
      
      // Atualiza localmente
      setBooks(books.map(book => {
        if (book.loans?.[0]?.id === loanId) {
          return { ...book, is_available: true, loans: [] };
        }
        return book;
      }));
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Erro');
    }
  };

  if (!isAuthenticated) return null;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Gerenciar Livros</h1>
      
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr>
              <th>Título</th>
              <th>Status</th>
              <th>Alugado por</th>
              <th>Data do Empréstimo</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {books.map(book => (
              <tr key={book.id}>
                <td>{book.title}</td>
                <td>
                  <span className={`px-2 py-1 rounded ${
                    book.is_available ? 'bg-green-100' : 'bg-red-100'
                  }`}>
                    {book.is_available ? 'Disponível' : 'Alugado'}
                  </span>
                </td>
                <td>{book.loans?.[0]?.student.name || '-'}</td>
                <td>{book.loans?.[0]?.issue_date ? new Date(book.loans[0].issue_date).toLocaleDateString() : '-'}</td>
                <td>
                  {!book.is_available && (
                    <button
                      onClick={() => handleReturn(book.loans[0].id)}
                      className="bg-blue-500 text-white px-3 py-1 rounded"
                    >
                      Marcar como devolvido
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}