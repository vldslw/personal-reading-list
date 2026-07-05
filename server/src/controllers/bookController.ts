import type { Request, Response } from 'express';
import { BookModel } from '../models/Book.js';

export const getBooks = async (req: Request, res: Response): Promise<void> => {
  try {
    const { query, limit = '20', page = '1' } = req.query;
    
    const filter: any = {};
    if (query) {
      filter.$or = [
        { title: { $regex: query, $options: 'i' } },
        { authors: { $regex: query, $options: 'i' } }
      ];
    }

    const limitNum = parseInt(limit as string, 10);
    const pageNum = parseInt(page as string, 10);
    const skip = (pageNum - 1) * limitNum;

    const books = await BookModel.find(filter)
      .skip(skip)
      .limit(limitNum)
      .sort({ createdAt: -1 });

    const total = await BookModel.countDocuments(filter);

    res.status(200).json({
      data: books,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(total / limitNum)
      }
    });
  } catch (error: any) {
    console.error('Error fetching books:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const getBookById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const book = await BookModel.findById(id);
    if (!book) {
      res.status(404).json({ error: 'Book not found' });
      return;
    }

    res.status(200).json({ data: book });
  } catch (error: any) {
    console.error(`Error fetching book with id ${req.params.id}:`, error);
    if (error.name === 'CastError') {
      res.status(404).json({ error: 'Book not found' });
      return;
    }
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
