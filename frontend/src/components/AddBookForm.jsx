import { useState } from "react";

function AddBookForm() {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [genre, setGenre] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newBook = {
      title,
      author,
      genre,
      description,
    };

    try {
      const response = await fetch("http://localhost:8000/books", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newBook),
      });

      if (response.ok) {
        alert("Book added successfully!");

        setTitle("");
        setAuthor("");
        setGenre("");
        setDescription("");
      } else {
        alert("Failed to add book.");
      }
    } catch (error) {
      console.error(error);
      alert("Server error.");
    }
  };

  return (
    <div className="max-w-xl mx-auto bg-white shadow-lg rounded-lg p-6 mt-10">
      <h2 className="text-2xl font-bold mb-6 text-center">
        Add New Book
      </h2>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Book Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="border rounded w-full p-3 mb-4"
          required
        />

        <input
          type="text"
          placeholder="Author"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          className="border rounded w-full p-3 mb-4"
          required
        />

        <input
          type="text"
          placeholder="Genre"
          value={genre}
          onChange={(e) => setGenre(e.target.value)}
          className="border rounded w-full p-3 mb-4"
          required
        />

        <textarea
          rows="4"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="border rounded w-full p-3 mb-4"
          required
        />

        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white w-full py-3 rounded-lg"
        >
          Add Book
        </button>
      </form>
    </div>
  );
}

export default AddBookForm;