function BookInfo({ book }) {
  return (
    <div>
      <h1 className="text-3xl font-bold">{book.title}</h1>

      <p className="text-gray-600 mt-2">
        <strong>Author:</strong> {book.author}
      </p>

      <p className="text-gray-600">
        <strong>Genre:</strong> {book.genre}
      </p>

      <p className="mt-4">{book.description}</p>
    </div>
  );
}

export default BookInfo;