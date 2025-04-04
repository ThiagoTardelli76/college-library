'use client';
import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import RentButton from '@/components/RentButton';

interface Book {
  id: number;
  title: string;
  author: string;
  published_date: string;
  available: boolean;
}

export default function HomePage() {
  const { user, isAuthenticated } = useAuth();
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBooks = async () => {
      const response = await fetch('http://localhost:8000/api/books/available');
      const data = await response.json();
      setBooks(data);
      setLoading(false);
    };
    fetchBooks();
  }, []);

  if (loading) return <div className="text-center py-8">Carregando livros...</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Livros Disponíveis</h1>
      
      {!isAuthenticated && (
        <div className="mb-6 p-4 bg-yellow-100 rounded-lg">
          <p className="text-yellow-800">
            Faça login como estudante para alugar livros. 
            <a href="/login/student" className="ml-2 text-blue-600 hover:underline">
              Clique aqui para entrar
            </a>
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {books.map((book) => (
          <div key={book.id} className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-2">{book.title}</h2>
            <p className="text-gray-600 mb-2">Autor: {book.author}</p>
            <p className="text-gray-600 mb-4">
              Publicação: {new Date(book.published_date).toLocaleDateString('pt-BR')}
            </p>
            
            <RentButton bookId={book.id} available={book.available} />
            
            {user?.type === 'student' && !book.available && (
              <p className="mt-2 text-sm text-gray-500">
                Você já alugou este livro
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}