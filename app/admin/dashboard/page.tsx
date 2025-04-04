'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

interface Student {
  id: number;
  name: string;
  email: string;
  birthdate: string;
  nif: string;
}

interface Book {
  id: number;
  title: string;
  author: string;
  published_date: string;
}

export default function AdminDashboard() {
  const { isAuthenticated, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<'students' | 'books'>('students');
  const [students, setStudents] = useState<Student[]>([]);
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);
        const [studentsRes, booksRes] = await Promise.all([
          fetch('http://localhost:8000/api/students'),
          fetch('http://localhost:8000/api/books')
        ]);

        if (!studentsRes.ok || !booksRes.ok) throw new Error('Erro ao carregar dados');

        const studentsData = await studentsRes.json();
        const booksData = await booksRes.json();

        setStudents(studentsData);
        setBooks(booksData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro desconhecido');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [isAuthenticated, router]);

  const handleDelete = async (id: number, type: 'student' | 'book') => {
    if (!confirm(`Tem certeza que deseja excluir este ${type === 'student' ? 'estudante' : 'livro'}?`)) return;

    try {
      const response = await fetch(`http://localhost:8000/api/${type}s/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error(`Erro ao excluir ${type}`);

      if (type === 'student') {
        setStudents(students.filter(s => s.id !== id));
      } else {
        setBooks(books.filter(b => b.id !== id));
      }

      alert(`${type === 'student' ? 'Estudante' : 'Livro'} excluído com sucesso!`);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Erro desconhecido');
    }
  };

  if (!isAuthenticated) return null;

  if (loading) return <div className="text-center py-8">Carregando dados...</div>;
  if (error) return <div className="text-red-500 text-center py-8">{error}</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Painel Administrativo</h1>
        <div className="space-x-4">
          <button
            onClick={logout}
            className="bg-red-500 text-white px-4 py-2 rounded"
          >
            Sair
          </button>
        </div>
      </div>

      {/* Abas de navegação */}
      <div className="flex border-b mb-6">
        <button
          className={`py-2 px-4 font-medium ${activeTab === 'students' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500'}`}
          onClick={() => setActiveTab('students')}
        >
          Estudantes
        </button>
        <button
          className={`py-2 px-4 font-medium ${activeTab === 'books' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500'}`}
          onClick={() => setActiveTab('books')}
        >
          Livros
        </button>
      </div>

      {/* Botões de adição */}
      <div className="mb-4">
        {activeTab === 'students' ? (
          <button
            onClick={() => router.push('/admin/students/create')}
            className="bg-green-500 text-white px-4 py-2 rounded mb-4"
          >
            Adicionar Estudante
          </button>
        ) : (
          <button
            onClick={() => router.push('/admin/books/create')}
            className="bg-green-500 text-white px-4 py-2 rounded mb-4"
          >
            Adicionar Livro
          </button>
        )}
      </div>

      {/* Conteúdo das abas */}
      {activeTab === 'students' ? (
        <div className="overflow-x-auto bg-white rounded-lg shadow text-black">
          <table className="min-w-full">
            <thead className="bg-gray-100 ">
              <tr>
                <th className="py-3 px-6 text-left">ID</th>
                <th className="py-3 px-6 text-left">Nome</th>
                <th className="py-3 px-6 text-left">Email</th>
                <th className="py-3 px-6 text-left">Data Nasc.</th>
                <th className="py-3 px-6 text-left">NIF</th>
                <th className="py-3 px-6 text-left">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {students.map((student) => (
                <tr key={student.id} className="hover:bg-gray-50">
                  <td className="py-4 px-6">{student.id}</td>
                  <td className="py-4 px-6">{student.name}</td>
                  <td className="py-4 px-6">{student.email}</td>
                  <td className="py-4 px-6">
                    {new Date(student.birthdate).toLocaleDateString('pt-BR')}
                  </td>
                  <td className="py-4 px-6">{student.nif}</td>
                  <td className="py-4 px-6 space-x-2">
                    <button
                      onClick={() => router.push(`/admin/students/${student.id}/edit`)}
                      className="text-blue-500 hover:text-blue-700"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleDelete(student.id, 'student')}
                      className="text-red-500 hover:text-red-700"
                    >
                      Excluir
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {students.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              Nenhum estudante cadastrado.
            </div>
          )}
        </div>
      ) : (
        <div className="overflow-x-auto bg-white rounded-lg shadow text-black">
          <table className="min-w-full">
            <thead className="bg-gray-100 text-black">
              <tr>
                <th className="py-3 px-6 text-left">ID</th>
                <th className="py-3 px-6 text-left">Título</th>
                <th className="py-3 px-6 text-left">Autor</th>
                <th className="py-3 px-6 text-left">Publicação</th>
                <th className="py-3 px-6 text-left">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {books.map((book) => (
                <tr key={book.id} className="hover:bg-gray-50">
                  <td className="py-4 px-6">{book.id}</td>
                  <td className="py-4 px-6">{book.title}</td>
                  <td className="py-4 px-6">{book.author}</td>
                  <td className="py-4 px-6">
                    {new Date(book.published_date).toLocaleDateString('pt-BR')}
                  </td>
                  <td className="py-4 px-6">
                    {book.loans?.some(loan => !loan.returned) ? (
                      <span className="text-red-500">Alugado</span>
                    ) : (
                      <span className="text-green-500">Disponível</span>
                    )}
                  </td>
                  <td className="py-4 px-6 space-x-2">
                    <button
                      onClick={() => router.push(`/admin/books/${book.id}/edit`)}
                      className="text-blue-500 hover:text-blue-700"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleDelete(book.id, 'book')}
                      className="text-red-500 hover:text-red-700"
                    >
                      Excluir
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {books.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              Nenhum livro cadastrado.
            </div>
          )}
        </div>
      )}
    </div>
  );
}