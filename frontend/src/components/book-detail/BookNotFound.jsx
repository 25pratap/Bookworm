function BookNotFound() {
  return (
    <div className="text-center py-20">
      <h2 className="text-3xl font-bold text-red-500">
        Book Not Found
      </h2>

      <p className="text-gray-500 mt-2">
        The requested book does not exist.
      </p>
    </div>
  );
}

export default BookNotFound;