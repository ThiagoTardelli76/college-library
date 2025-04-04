export default function StudentLoginPage() {
    const { login } = useAuth();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
  
    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      await login('student', { name, email });
    };
  
    return (
      <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Login do Aluno</h2>
        <form onSubmit={handleSubmit}>
          {/* Campos de nome e email */}
          <button type="submit" className="w-full bg-blue-500 text-white py-2 px-4 rounded">
            Entrar
          </button>
        </form>
      </div>
    );
  }