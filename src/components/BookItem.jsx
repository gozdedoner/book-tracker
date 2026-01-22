import { useState } from "react";

export default function BookItem({ book, onDelete, onToggleRead }) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = () => {
    setIsDeleting(true);

    setTimeout(() => {
      onDelete(book.id);
    }, 300);
  };

  return (
    <div
      className={`
        flex justify-between items-center
        p-4 mt-4 rounded-xl
        backdrop-blur-md
        bg-white/70 dark:bg-white/10
        text-gray-800 dark:text-gray-100
        border border-white/30 dark:border-white/10
        shadow-lg
        transition-all duration-300
        hover:shadow-xl hover:scale-[1.01]
        ${
          isDeleting
            ? "opacity-0 translate-x-10 scale-95"
            : "opacity-100 translate-x-0 scale-100"
        }
      `}
    >
      {/* Book Info */}
      <div>
        <h3
          className={`font-semibold transition-all duration-300 ${
            book.isRead
              ? "line-through text-gray-400 opacity-70"
              : "text-gray-800 dark:text-gray-100"
          }`}
        >
          {book.title}
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {book.author}
        </p>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3">
        {/* Read / Unread */}
        <button
          onClick={() => onToggleRead(book.id)}
          className={`
            w-9 h-9 rounded-full
            flex items-center justify-center
            text-lg
            transition-all duration-300
            ${
              book.isRead
                ? "bg-emerald-100 text-emerald-700 scale-110"
                : "bg-yellow-100 text-yellow-700 hover:scale-110"
            }
          `}
          title={book.isRead ? "Mark as unread" : "Mark as read"}
        >
          {book.isRead ? "✓" : "○"}
        </button>

        {/* Delete */}
        <button
          onClick={handleDelete}
          className="
            w-9 h-9 rounded-full
            flex items-center justify-center
            text-lg
            bg-red-100 text-red-600
            hover:bg-red-500 hover:text-white
            hover:scale-110
            transition-all duration-300
          "
          title="Delete book"
        >
          🗑️
        </button>
      </div>
    </div>
  );
}
