'use client';
import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import RentButton from '@/components/RentButton';

interface Book {
  id: number;
  title: string;
  author: string;
  published_date: string;
  is_rented: boolean;
}

export default function StudentDashboard() {
  const { user, isAuthenticated } = useAuth();
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login/student');
      return;
    }

    const fetchBooks = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/books');
        const data = await response.json();
        setBooks(data);
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, [isAuthenticated, router]);

  if (loading) return <div>Carregando livros...</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Olá, {user?.name}! Livros Disponíveis</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {books.map((book) => (
          <div key={book.id} className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-2">{book.title}</h2>
            <p className="text-gray-600 mb-2">Autor: {book.author}</p>
            <p className="text-gray-600 mb-4">
              Publicação: {new Date(book.published_date).toLocaleDateString('pt-BR')}
            </p>
            
            <RentButton bookId={book.id} available={!book.is_rented} />
            
            {book.is_rented && (
              <p className="text-red-500 mt-2 text-sm">Este livro está alugado</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}