'use client';
import { useAuth } from '@/context/AuthContext';

export default function RentButton({ bookId, available }: { bookId: number, available: boolean }) {
  const { user } = useAuth();

  const handleRent = async () => {
    if (!user) {
      alert('Faça login para alugar livros');
      return;
    }

    try {
      const response = await fetch('http://localhost:8000/api/loans', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        },
        body: JSON.stringify({
          book_id: bookId,
          student_id: user.id
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erro ao alugar livro');
      }

      alert('Livro alugado com sucesso!');
      window.location.reload(); 
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Erro desconhecido');
    }
  };

  return (
    <button
      onClick={handleRent}
      disabled={!available}
      className={`px-4 py-2 rounded-md ${
        available
          ? 'bg-green-500 text-white hover:bg-green-600'
          : 'bg-gray-300 text-gray-500 cursor-not-allowed'
      }`}
    >
      {available ? 'Alugar Livro' : 'Indisponível'}
    </button>
  );
}