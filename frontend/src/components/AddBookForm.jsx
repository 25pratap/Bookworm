import { useState } from "react";

function AddBookForm() {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [genre, setGenre] = useState("");
  const [price,setPrice] =useState("");
  const [description, setDescription] = useState("");
  const [cover, setCover] = useState("");
  const [loading, setLoading] = useState(false);
  const [publicationDate, setPublicationDate] = useState("");
  const [pages, setPages] = useState("");
  const [stock, setStock] = useState("");


  const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);

  const newBook = {
    title,
    author,
    genre,
    description,
    cover,
    price: Number(price),
    publication_date: Number(publicationDate),
    pages: Number(pages),
    stock: Number(stock),
  };

  try {
    const token = localStorage.getItem("token");

    const response = await fetch("http://localhost:8000/books", {
    method: "POST",
    headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(newBook),
    });

    if (response.ok) {
      toast.success("Book added successfully!");

      setTitle("");
      setAuthor("");
      setGenre("");
      setPrice("");
      setPublicationDate("");
      setPages("");
      setStock("");
      setDescription("");
      setCover("");
    } else {
      const error = await response.json();
      toast.error(error.detail || "Failed to add book.");
    }
  } catch (error) {
    console.error(error);
    toast.error("Server error.");
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-center py-10 px-4">
      <div className="w-full max-w-2xl bg-white rounded-xl shadow-lg p-8">

        <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">
          Add New Book
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">

          <input
            type="text"
            placeholder="Book Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none"
            required
          />

          <input
            type="text"
            placeholder="Author"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none"
            required
          />

          <input
            type="text"
            placeholder="Genre"
            value={genre}
            onChange={(e) => setGenre(e.target.value)}
            className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none"
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

          <textarea
            rows="5"
            placeholder="Book Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none resize-none"
            required
          />

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-lg text-white font-semibold transition ${
              loading
                ? "bg-gray-500 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {loading ? "Adding Book..." : "Add Book"}
          </button>

        </form>
      </div>
    </div>
  );
}

export default AddBookForm;