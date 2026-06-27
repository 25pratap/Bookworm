import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

function EditBookPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [genre, setGenre] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    fetch(`http://localhost:8000/books/${id}`)
      .then((response) => response.json())
      .then((data) => {
        setTitle(data.title);
        setAuthor(data.author);
        setGenre(data.genre);
        setDescription(data.description);
      })
      .catch((error) => console.error(error));
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const updatedBook = {
      title,
      author,
      genre,
      description,
    };

    const response = await fetch(
      `http://localhost:8000/books/${id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedBook),
      }
    );

    const data = await response.json();

    alert(data.message);

    navigate("/books");
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-xl mx-auto bg-white rounded-xl shadow-lg p-8">

        <h1 className="text-3xl font-bold mb-6 text-center">
          Edit Book
        </h1>

        <form onSubmit={handleSubmit}>

          <input
            type="text"
            placeholder="Title"
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
            rows="5"
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="border rounded w-full p-3 mb-4"
            required
          />

          <button
            type="submit"
            className="bg-yellow-500 hover:bg-yellow-600 text-white w-full py-3 rounded-lg"
          >
            Update Book
          </button>

        </form>

      </div>
    </div>
  );
}

export default EditBookPage;