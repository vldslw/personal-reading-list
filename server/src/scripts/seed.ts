import fs from 'node:fs';
import path from 'node:path';
import { connectToDatabase } from '../config/db.js';
import { BookModel } from '../models/Book.js';

const seed = async () => {
  await connectToDatabase();

  await BookModel.deleteMany({});

  const dataPath = path.join(
    import.meta.dirname,
    '../../data/sample-books.json',
  );
  const rawData = fs.readFileSync(dataPath, 'utf-8');
  const booksData = JSON.parse(rawData);

  const formattedBooks = booksData.map((book: any) => ({
    title: book.title,
    authors: [book.author],
    coverUrl: book.coverUrl,
    pageCount: book.pageCount,
    publishYear: book.publishedDate ? parseInt(book.publishedDate) : undefined,
    isbn13: book.isbn13,
    isbn10: book.isbn10,
    genres: book.genres || [],
    description: book.description,
    publisher: book.publisher,
  }));

  await BookModel.insertMany(formattedBooks);

  console.log('Seed complete');
  process.exit(0);
};

seed().catch((err) => {
  console.error('Seed failed', err);
  process.exit(1);
});
