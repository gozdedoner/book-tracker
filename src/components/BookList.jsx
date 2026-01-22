import BookItem from "./BookItem";

export default function BookList({ books, onDelete, onToggleRead }) {
  return (
    <div className="mt-6 space-y-3 transition-all will-change-transform">
      {books.map((book) => (
        <div key={book.id} className="transition-all duration-300 ease-out">
          <BookItem
            book={book}
            onDelete={onDelete}
            onToggleRead={onToggleRead}
          />
        </div>
      ))}
    </div>
  );
}
