function RecommendedBooks({ books }) {
  return (
    <div className="mt-10">
      <h2 className="text-2xl font-bold mb-4">
        Recommended Books
      </h2>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {books.map((book) => (
          <div
            key={book.id}
            className="border rounded-lg p-4 shadow"
          >
            <img
              src={
                book.image ||
                "https://via.placeholder.com/150x220?text=Book"
              }
              alt={book.title}
              className="w-full h-48 object-cover rounded"
            />

            <h3 className="font-semibold mt-3">
              {book.title}
            </h3>

            <p className="text-gray-500 text-sm">
              {book.author}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default RecommendedBooks;