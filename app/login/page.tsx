import Link from 'next/link';

export default function LoginPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <h1 className="text-3xl font-bold mb-8">Selecione o tipo de login</h1>
      <div className="space-x-4">
        <Link 
          href="/login/admin"
          className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600"
        >
          Administrador
        </Link>
        <Link 
          href="/login/student"
          className="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600"
        >
          Aluno
        </Link>
      </div>
    </div>
  );
}