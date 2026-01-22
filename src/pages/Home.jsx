import { useState, useEffect, useRef } from "react";
import BookForm from "../components/BookForm";
import BookList from "../components/BookList";

/*  Count Up Hook */
function useCountUp(target, duration = 600) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const increment = Math.max(1, Math.floor(target / (duration / 16)));

    const timer = setInterval(() => {
      start += increment;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(start);
      }
    }, 16);

    return () => clearInterval(timer);
  }, [target, duration]);

  return count;
}

export default function Home() {
  const [books, setBooks] = useState([]);
  const [filter, setFilter] = useState("all");
  const [theme, setTheme] = useState("light");
  const [search, setSearch] = useState("");
  const [lastDeleted, setLastDeleted] = useState(null);
  const [showUndo, setShowUndo] = useState(false);
  const [showCelebrate, setShowCelebrate] = useState(false);


  const isFirstRender = useRef(true);

  /*  STATS */
  const totalCount = books.length;
  const readCount = books.filter((b) => b.isRead).length;
  const unreadCount = books.filter((b) => !b.isRead).length;

  const animatedTotal = useCountUp(totalCount);
  const animatedRead = useCountUp(readCount);
  const animatedUnread = useCountUp(unreadCount);
  const allRead =
  books.length > 0 && books.every((book) => book.isRead);


  //  Add book
  const addBook = (newBook) => {
    setBooks((prev) => [...prev, newBook]);
  };

  //  Delete book
  const deleteBook = (id) => {
    const bookToDelete = books.find((b) => b.id === id);

    setBooks((prev) => prev.filter((book) => book.id !== id));
    setLastDeleted(bookToDelete);
    setShowUndo(true);

    setTimeout(() => {
      setShowUndo(false);
      setLastDeleted(null);
    }, 5000);
  };

  //  Toggle read
  const toggleRead = (id) => {
  setBooks((prev) => {
    const updated = prev.map((book) =>
      book.id === id ? { ...book, isRead: !book.isRead } : book
    );

    // 🎉 Hepsi okunduysa kutla
    const allReadNow =
      updated.length > 0 && updated.every((b) => b.isRead);

    if (allReadNow) {
      setShowCelebrate(true);
      setTimeout(() => setShowCelebrate(false), 3000);
    }

    return updated;
  });
};


  //  Filter + Search
  const filteredBooks = books.filter((book) => {
    const matchesFilter =
      filter === "all" ||
      (filter === "read" && book.isRead) ||
      (filter === "unread" && !book.isRead);

    const title = book.title?.toLowerCase() || "";
    const author = book.author?.toLowerCase() || "";

    return (
      matchesFilter &&
      (title.includes(search.toLowerCase()) ||
        author.includes(search.toLowerCase()))
    );
  });

  //  Load books
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("books"));
    if (Array.isArray(saved)) setBooks(saved);
  }, []);

  //  Save books
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    localStorage.setItem("books", JSON.stringify(books));
  }, [books]);

  //  Theme
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) setTheme(savedTheme);
  }, []);

  useEffect(() => {
    localStorage.setItem("theme", theme);
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  return (
    <div
      className="
        min-h-screen
        px-4 py-6
        sm:px-6
        lg:px-0
        transition-colors
        bg-gradient-to-br
        from-gray-100 via-gray-50 to-gray-200
        dark:from-gray-900 dark:via-gray-800 dark:to-gray-900
      "
    >
      <div
        className="
          max-w-xl
          sm:max-w-2xl
          lg:max-w-3xl
          mx-auto
        "
      >
        {/* Header */}
        <div
          className="
            flex flex-col gap-4
            sm:flex-row sm:items-center sm:justify-between
            mb-8
          "
        >
          <h1 className="text-3xl font-bold text-pink-600 dark:text-pink-400">
            Book Tracker
          </h1>

          <button
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
            className="
              px-4 py-2 rounded-lg
              bg-gray-200 dark:bg-gray-700
              hover:scale-105 transition
            "
          >
            {theme === "light" ? "🌙 Dark" : "☀️ Light"}
          </button>
        </div>

        {/* Add Book */}
        <BookForm onAddBook={addBook} />

        {/*  Stats */}
        <div
          className="
            grid gap-4 mt-6
            grid-cols-1
            sm:grid-cols-2
            lg:grid-cols-3
          "
        >
          <Stat label="Total" value={animatedTotal} />
          <Stat label="Read" value={animatedRead} color="emerald" />
          <Stat label="Unread" value={animatedUnread} color="yellow" />
        </div>

        {/* Search */}
        <input
          className="
            w-full mt-6
            px-4 py-3
            text-base sm:text-sm
            rounded-xl
            bg-white/70 dark:bg-white/10
            text-gray-800 dark:text-gray-100
            placeholder:text-gray-500 dark:placeholder:text-gray-400
            focus:outline-none focus:ring-2 focus:ring-pink-400
          "
          placeholder="Search by title or author..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {/* Filters */}
        <div
          className="
            flex gap-2 mt-6
            overflow-x-auto
            pb-2
          "
        >
          {["all", "read", "unread"].map((t) => (
            <button
              key={t}
              onClick={() => setFilter(t)}
              className={`px-4 py-2 rounded-lg transition ${
                filter === t
                  ? "bg-pink-500 text-white"
                  : "bg-white dark:bg-gray-700 dark:text-gray-100"
              }`}
            >
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>

        {/* Empty State */}
        {filteredBooks.length === 0 && (
          <div className="mt-20 flex flex-col items-center text-center animate-fade-in">
            {/* Icon */}
            <div
              className="
        w-20 h-20 mb-6
        rounded-full
        flex items-center justify-center
        text-4xl
        bg-pink-100/70 dark:bg-pink-400/10
        text-pink-500
        shadow-lg
        animate-pulse
      "
            >
              📚
            </div>

            {/* Title */}
            <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
              {books.length === 0 && search === "" && "Your library is empty"}
              {books.length === 0 && search !== "" && "No books to search"}
              {books.length > 0 && search !== "" && "No results found"}
            </h3>

            {/* Subtitle */}
            <p className="mt-2 text-gray-500 dark:text-gray-400 max-w-sm">
              {books.length === 0 && search === "" && (
                <>
                  Start building your personal reading list by adding your first
                  book.
                </>
              )}

              {books.length === 0 && search !== "" && (
                <>Add at least one book to enable search.</>
              )}

              {books.length > 0 && search !== "" && (
                <>
                  No results found for{" "}
                  <span className="font-medium">“{search}”</span>.
                  <br />
                  Try a different keyword 🔍
                </>
              )}
            </p>

            {/* Hint */}
            {books.length === 0 && search === "" && (
              <span
                className="
          mt-6 px-4 py-2 rounded-full
          text-sm
          bg-white/60 dark:bg-white/10
          border border-white/30 dark:border-white/10
          backdrop-blur-md
          text-gray-600 dark:text-gray-300
        "
              >
                Tip: Track what you’ve read ✔️
              </span>
            )}
          </div>
        )}

        {/* Book List */}
        {filteredBooks.length > 0 && (
          <BookList
            books={filteredBooks}
            onDelete={deleteBook}
            onToggleRead={toggleRead}
          />
        )}
      </div>

      {/* Undo Delete */}
      {showUndo && lastDeleted && (
        <div
          className="
      fixed bottom-6 left-1/2 -translate-x-1/2
      bg-gray-900 text-white
      px-5 py-3 rounded-xl
      shadow-xl
      flex items-center gap-4
      animate-fade-in
      z-50
    "
        >
          <span className="text-sm">“{lastDeleted.title}” deleted</span>

          <button
            onClick={() => {
              setBooks((prev) => [...prev, lastDeleted]);
              setShowUndo(false);
              setLastDeleted(null);
            }}
            className="
        px-3 py-1 rounded-lg
        bg-pink-500 hover:bg-pink-600
        text-sm
        transition
      "
          >
            Undo
          </button>
        </div>
      )}

      {showCelebrate && (
  <div
    className="
      fixed inset-0
      flex items-center justify-center
      bg-black/40 backdrop-blur-sm
      z-50
      animate-fade-in
    "
  >
    <div
      className="
        bg-white dark:bg-gray-900
        rounded-2xl
        px-8 py-6
        text-center
        shadow-2xl
        animate-scale-in
      "
    >
      <div className="text-5xl mb-4">🎉</div>
      <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
        All books completed!
      </h2>
      <p className="mt-2 text-gray-500 dark:text-gray-400">
        You’ve finished your entire reading list 👏
      </p>
    </div>
  </div>
)}

    </div>
  );
}

/* 🔹 Stat Card */
function Stat({ label, value, color = "gray" }) {
  const colorMap = {
    gray: "text-gray-700 dark:text-gray-200",
    emerald: "text-emerald-600 dark:text-emerald-400",
    yellow: "text-yellow-600 dark:text-yellow-400",
  };

  return (
    <div className="rounded-xl p-4 text-center bg-white/70 dark:bg-white/10 shadow">
      <p className="text-sm opacity-70">{label}</p>
      <p className={`text-2xl font-bold ${colorMap[color]}`}>{value}</p>
    </div>
  );
}
