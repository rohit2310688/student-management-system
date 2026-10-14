"use client";

import { useEffect, useState } from "react";

type Student = {
  id: number;
  name: string;
  rollNumber: string;
  department: string;
  semester: string;
};

export default function Home() {
  const [students, setStudents] = useState<Student[]>([]);
  const [name, setName] = useState("");
  const [rollNumber, setRollNumber] = useState("");
  const [department, setDepartment] = useState("EEE");
  const [semester, setSemester] = useState("1");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function loadStudents() {
    try {
      const response = await fetch("/api/students");
      if (!response.ok) throw new Error("Could not load students.");
      setStudents(await response.json());
      setError("");
    } catch {
      setError("Could not load students. Check that the database and API are running.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadStudents();
  }, []);

  const filteredStudents = students.filter((student) => {
    const query = searchTerm.trim().toLowerCase();
    return (
      student.name.toLowerCase().includes(query) ||
      student.rollNumber.toLowerCase().includes(query) ||
      student.department.toLowerCase().includes(query) ||
      student.semester.includes(query)
    );
  });

  function resetForm() {
    setName("");
    setRollNumber("");
    setDepartment("EEE");
    setSemester("1");
    setEditingId(null);
  }

  async function saveStudent(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const cleanName = name.trim();
    const cleanRoll = rollNumber.trim();

    if (!cleanName || !cleanRoll) {
      alert("Please enter the student name and roll number.");
      return;
    }

    if (
      students.some(
        (student) =>
          student.rollNumber.toLowerCase() === cleanRoll.toLowerCase() &&
          student.id !== editingId
      )
    ) {
      alert("This roll number already exists.");
      return;
    }

    setSaving(true);
    setError("");

    try {
      const response = await fetch(
        editingId === null ? "/api/students" : `/api/students/${editingId}`,
        {
          method: editingId === null ? "POST" : "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: cleanName,
            rollNumber: cleanRoll,
            department,
            semester,
          }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Could not save student.");
      }

      await loadStudents();
      resetForm();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save student.");
    } finally {
      setSaving(false);
    }
  }

  function editStudent(student: Student) {
    setEditingId(student.id);
    setName(student.name);
    setRollNumber(student.rollNumber);
    setDepartment(student.department);
    setSemester(student.semester);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function deleteStudent(id: number) {
    if (!window.confirm("Are you sure you want to delete this student?")) {
      return;
    }

    setError("");

    try {
      const response = await fetch(`/api/students/${id}`, {
        method: "DELETE",
      });

      const result = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(result.error || "Could not delete student.");

      setStudents((previous) => previous.filter((student) => student.id !== id));
      if (editingId === id) resetForm();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not delete student.");
    }
  }

  return (
    <main className="min-h-screen bg-gray-100 p-6 md:p-10">
      <div className="mx-auto max-w-7xl">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Student Management System
          </h1>
          <p className="mt-2 text-gray-600">Manage student records easily.</p>
        </header>

        {error && (
          <div role="alert" className="mb-5 rounded-lg bg-red-100 p-4 text-red-800">
            {error}
          </div>
        )}

        <section className="mb-8 grid gap-5 md:grid-cols-3">
          <div className="rounded-xl bg-white p-6 shadow-sm">
            <p className="text-sm text-gray-500">Total Students</p>
            <p className="mt-2 text-3xl font-bold">{students.length}</p>
          </div>
          <div className="rounded-xl bg-white p-6 shadow-sm">
            <p className="text-sm text-gray-500">Departments</p>
            <p className="mt-2 text-3xl font-bold">
              {new Set(students.map((student) => student.department)).size}
            </p>
          </div>
          <div className="rounded-xl bg-white p-6 shadow-sm">
            <p className="text-sm text-gray-500">Current Status</p>
            <p className="mt-2 text-2xl font-bold">
              {editingId !== null ? "Editing Student" : "Ready"}
            </p>
          </div>
        </section>

        <section className="mb-8 rounded-xl bg-white p-6 shadow-sm">
          <h2 className="mb-5 text-xl font-semibold">
            {editingId !== null ? "Edit Student" : "Add New Student"}
          </h2>

          <form onSubmit={saveStudent} className="grid gap-4 md:grid-cols-2">
            <div>
              <label htmlFor="studentName" className="mb-2 block text-sm font-medium text-gray-700">
                Student Name
              </label>
              <input
                id="studentName"
                className="w-full rounded-lg border border-gray-300 p-3"
                placeholder="Enter student name"
                value={name}
                onChange={(event) => setName(event.target.value)}
                required
              />
            </div>

            <div>
              <label htmlFor="rollNumber" className="mb-2 block text-sm font-medium text-gray-700">
                Roll Number
              </label>
              <input
                id="rollNumber"
                className="w-full rounded-lg border border-gray-300 p-3"
                placeholder="Enter roll number"
                value={rollNumber}
                onChange={(event) => setRollNumber(event.target.value)}
                required
              />
            </div>

            <div>
              <label htmlFor="department" className="mb-2 block text-sm font-medium text-gray-700">
                Department
              </label>
              <select
                id="department"
                className="w-full rounded-lg border border-gray-300 p-3"
                value={department}
                onChange={(event) => setDepartment(event.target.value)}
              >
                <option value="EEE">EEE</option>
                <option value="CSE">CSE</option>
                <option value="ECE">ECE</option>
                <option value="ME">Mechanical</option>
                <option value="Civil">Civil</option>
              </select>
            </div>

            <div>
              <label htmlFor="semester" className="mb-2 block text-sm font-medium text-gray-700">
                Semester
              </label>
              <select
                id="semester"
                className="w-full rounded-lg border border-gray-300 p-3"
                value={semester}
                onChange={(event) => setSemester(event.target.value)}
              >
                {Array.from({ length: 8 }, (_, index) => (
                  <option key={index + 1} value={String(index + 1)}>
                    Semester {index + 1}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-wrap gap-3 md:col-span-2">
              <button
                type="submit"
                disabled={saving}
                className="rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
              >
                {saving ? "Saving..." : editingId !== null ? "Update Student" : "+ Add Student"}
              </button>

              {editingId !== null && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="rounded-lg border border-gray-300 px-6 py-3 hover:bg-gray-100"
                >
                  Cancel Edit
                </button>
              )}
            </div>
          </form>
        </section>

        <section className="rounded-xl bg-white p-6 shadow-sm">
          <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="text-xl font-semibold">Student Records</h2>
            <input
              type="search"
              placeholder="Search name, roll no., department..."
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              className="w-full rounded-lg border border-gray-300 p-3 sm:max-w-md"
            />
          </div>

          <p className="mb-4 text-sm text-gray-500">
            {loading
              ? "Loading students..."
              : `Showing ${filteredStudents.length} of ${students.length} students`}
          </p>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b bg-gray-50 text-sm text-gray-600">
                  <th className="p-3">Name</th>
                  <th className="p-3">Roll Number</th>
                  <th className="p-3">Department</th>
                  <th className="p-3">Semester</th>
                  <th className="p-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredStudents.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-gray-500">
                      {loading ? "Loading..." : students.length === 0
                        ? "No students added yet."
                        : "No matching students found."}
                    </td>
                  </tr>
                ) : (
                  filteredStudents.map((student) => (
                    <tr key={student.id} className="border-b last:border-0 hover:bg-gray-50">
                      <td className="p-3 font-medium">{student.name}</td>
                      <td className="p-3">{student.rollNumber}</td>
                      <td className="p-3">{student.department}</td>
                      <td className="p-3">{student.semester}</td>
                      <td className="p-3">
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => editStudent(student)}
                            className="rounded-md bg-blue-100 px-3 py-2 text-sm text-blue-700 hover:bg-blue-200"
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            onClick={() => void deleteStudent(student.id)}
                            className="rounded-md bg-red-100 px-3 py-2 text-sm text-red-700 hover:bg-red-200"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>

        <footer className="mt-8 text-center text-sm text-gray-500">
          Student Management System | Built with Next.js and Tailwind CSS
        </footer>
      </div>
    </main>
  );
}
