import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

function EditBookPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [genre, setGenre] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [cover, setCover] = useState("");
  const [publicationDate, setPublicationDate] = useState("");
  const [pages, setPages] = useState("");
  const [stock, setStock] = useState("");

  useEffect(() => {
    fetch(`http://localhost:8000/books/${id}`)
      .then((response) => response.json())
      .then((data) => {
        setTitle(data.title);
        setAuthor(data.author);
        setGenre(data.genre);
        setDescription(data.description);
        setPrice(data.price);
        setCover(data.cover || "");
        setPublicationDate(data.publication_date);
        setPages(data.pages || "");
        setStock(data.stock || "");
      })
      .catch((error) => 
        console.error(error));
        toast.error("Failed to load book details"); 
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const updatedBook = {
      title,
      author,
      genre,
      description,
      price: Number(price),
      cover,
      publication_date: Number(publicationDate),
      pages: Number(pages),
      stock: Number(stock),
    };
    const token=localStorage.getItem("token");

    const response = await fetch(
      `http://localhost:8000/books/${id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updatedBook),
      }
    );

   const data = await response.json();

if (!response.ok) {

  toast.error(data.detail || "Failed to update book");

  return;

}

toast.success(data.message || "Book updated successfully!");

setTimeout(() => {
  navigate("/admin/managebooks");
}, 1500);
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
            <input
            type="number"
            placeholder="Price (Rs.)"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none"
            required
          />
          <input
            type="number"
            value={publicationDate}
            onChange={(e) => setPublicationDate(e.target.value)}
            min="1000"
            max="9999"
            placeholder="Publication Year"
            className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none"
            />

           <input
            type="number"
            placeholder="Number of Pages"
            value={pages}
            onChange={(e) => setPages(e.target.value)}
            className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none"
            />

           <input
            type="number"
            placeholder="Stock Quantity"
            value={stock}
            onChange={(e) => setStock(e.target.value)}
            className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none"
            />

          <input
            type="text"
            placeholder="Cover Image URL (Optional)"
            value={cover}
            onChange={(e) => setCover(e.target.value)}
            className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none"
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