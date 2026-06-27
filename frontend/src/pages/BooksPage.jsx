import { useEffect, useState, useContext } from "react";
import BookCard from "../components/BookCard";
import { AuthContext } from "../context/AuthContext";

function BooksPage() {
  const [books, setBooks] = useState([]);
  const { token } = useContext(AuthContext);

  useEffect(() => {
    if (!token) return;

    fetch("http://localhost:8000/books", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => setBooks(data))
      .catch((error) => console.error("Error fetching books:", error));
  }, [token]);

  return (
    <div className="p-8">
      <h1 className="text-4xl font-bold mb-6">Books Collection</h1>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {books.map((book) => (
          <BookCard
            key={book.id}
            id={book.id}
            title={book.title}
            author={book.author}
          />
        ))}
      </div>
    </div>
  );
}

export default BooksPage;