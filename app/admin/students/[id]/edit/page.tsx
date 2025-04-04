'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import StudentForm from '@/components/StudentForm';

export default function EditStudentPage() {
  const params = useParams();
  const [student, setStudent] = useState(null);

  useEffect(() => {
    const fetchStudent = async () => {
      const response = await fetch(`http://localhost:8000/api/students/${params.id}`);
      const data = await response.json();
      setStudent(data);
    };

    fetchStudent();
  }, [params.id]);

  if (!student) return <div>Carregando...</div>;

  return (
    <div className="py-8">
      <StudentForm initialData={student} />
    </div>
  );
}