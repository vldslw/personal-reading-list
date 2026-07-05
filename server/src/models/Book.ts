import { model, Schema } from 'mongoose';

export type Book = {
  title: string;
  authors: string[];
  coverUrl?: string;
  pageCount?: number;
  publishYear?: number;
  isbn13?: string;
  isbn10?: string;
  genres: string[];
  description?: string;
  publisher?: string;
  createdAt: Date;
  updatedAt: Date;
};

const bookSchema = new Schema<Book>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    authors: [
      {
        type: String,
        trim: true,
      },
    ],
    coverUrl: {
      type: String,
      trim: true,
    },
    pageCount: {
      type: Number,
      min: 1,
    },
    publishYear: {
      type: Number,
    },
    isbn13: {
      type: String,
      trim: true,
      index: true,
    },
    isbn10: {
      type: String,
      trim: true,
      index: true,
    },
    genres: [
      {
        type: String,
        trim: true,
      },
    ],
    description: {
      type: String,
    },
    publisher: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

export const BookModel = model<Book>('Book', bookSchema);
