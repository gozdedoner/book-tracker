import { useState } from "react";

export default function BookForm({ onAddBook }) {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!title || !author) return;

    onAddBook({
      id: Date.now(),
      title,
      author,
      isRead: false,
    });

    setTitle("");
    setAuthor("");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white dark:bg-gray-800
text-gray-800 dark:text-gray-100
rounded-xl shadow p-6 transition-colors"
    >
      <h2 className="text-lg font-semibold mb-4">Add New Book</h2>

      <input
        type="text"
        placeholder="Book title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full border border-gray-300 dark:border-gray-600
bg-white dark:bg-gray-700
text-gray-800 dark:text-gray-100
rounded px-3 py-2 transition-colors"
      />

      <input
        type="text"
        placeholder="Author"
        value={author}
        onChange={(e) => setAuthor(e.target.value)}
        className="w-full border border-gray-300 dark:border-gray-600
bg-white dark:bg-gray-700
text-gray-800 dark:text-gray-100
rounded px-3 py-2 transition-colors"
      />

      <button
        type="submit"
        className="w-full bg-pink-500 text-white py-2 rounded hover:bg-pink-600 transition"
      >
        Add Book
      </button>
    </form>
  );
}
