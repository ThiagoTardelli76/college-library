'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import BookTable from '@/components/books/BookTable';
import BookForm from '@/components/books/BookForm';

interface Book {
  id: number;
  title: string;
  author: string;
  published_date: string;
}

export default function BooksPage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [currentBook, setCurrentBook] = useState<Book | null>(null);
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    } else {
      fetchBooks();
    }
  }, [isAuthenticated, router]);

  const fetchBooks = async () => {
    try {
      const response = await api.get('/books');
      setBooks(response.data);
      setLoading(false);
    } catch (error) {
      toast.error('Erro ao carregar livros');
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await api.delete(`/books/${id}`);
      toast.success('Livro removido com sucesso');
      fetchBooks();
    } catch (error) {
      toast.error('Erro ao remover livro');
    }
  };

  const handleSubmit = async (data: any) => {
    try {
      if (currentBook) {
        await api.put(`/books/${currentBook.id}`, data);
        toast.success('Livro atualizado com sucesso');
      } else {
        await api.post('/books', data);
        toast.success('Livro adicionado com sucesso');
      }
      setIsFormOpen(false);
      setCurrentBook(null);
      fetchBooks();
    } catch (error) {
      toast.error('Erro ao salvar livro');
    }
  };

  if (loading) {
    return <div>Carregando...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Livros</h1>
        <button
          onClick={() => {
            setCurrentBook(null);
            setIsFormOpen(true);
          }}
          className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
        >
          Adicionar Livro
        </button>
      </div>

      <BookTable 
        books={books} 
        onEdit={(book) => {
          setCurrentBook(book);
          setIsFormOpen(true);
        }}
        onDelete={handleDelete}
      />

      <BookForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleSubmit}
        initialData={currentBook}
      />
    </div>
  );
}