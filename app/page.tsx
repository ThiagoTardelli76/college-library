'use client';
import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';

interface Book {
  id: number;
  title: string;
  author: string;
  is_available: boolean;
}

export default function HomePage() {
  const { user, isAuthenticated, login, logout } = useAuth();
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBooks = async () => {
      const res = await fetch('http://localhost:8000/api/books');
      const data = await res.json();
      setBooks(data);
      setLoading(false);
    };
    fetchBooks();
  }, []);

  const handleRent = async (bookId: number) => {
    try {
      const response = await fetch('http://localhost:8000/api/books/rent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        },
        body: JSON.stringify({ book_id: bookId })
      });
  
      const data = await response.json();
  
      if (!response.ok) {
        throw new Error(data.error || 'Erro ao alugar livro');
      }
  
      // Atualiza o estado local
      setBooks(books.map(book => 
        book.id === bookId ? { ...book, is_rented: true } : book
      ));
      
      alert('Livro alugado com sucesso!');
    } catch (error) {
      console.error('Erro detalhado:', error);
      alert(error instanceof Error ? error.message : 'Erro desconhecido');
    }
  };

  if (loading) return <div>Carregando...</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Livros Disponíveis</h1>
        {!isAuthenticated ? (
          <Link href="/login/student" className="bg-blue-500 text-white px-4 py-2 rounded">
            Login do Aluno
          </Link>
        ) : (
          <div className="flex items-center space-x-4">
            <span>Olá, {user?.name}</span>
            <button onClick={logout} className="bg-red-500 text-white px-4 py-2 rounded">
              Sair
            </button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {books.map(book => (
          <div key={book.id} className="border p-4 rounded-lg">
            <h3 className="font-bold text-lg">{book.title}</h3>
            <p className="text-gray-600">{book.author}</p>
            <div className="mt-4 flex justify-between items-center">
              <span className={`px-2 py-1 rounded text-sm ${
                book.is_available 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-red-100 text-red-800'
              }`}>
                {book.is_available ? 'Disponível' : 'Alugado'}
              </span>
              <button
                onClick={() => handleRent(book.id)}
                disabled={!book.is_available || !isAuthenticated}
                className={`px-3 py-1 rounded ${
                  !book.is_available || !isAuthenticated
                    ? 'bg-gray-300 cursor-not-allowed'
                    : 'bg-blue-500 text-white hover:bg-blue-600'
                }`}
              >
                Alugar
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}