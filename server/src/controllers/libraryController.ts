import type { Request, Response } from 'express';
import { LibraryItemModel } from '../models/LibraryItem.js';

export const getLibraryItems = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = res.locals.userId;
    const { status, shelfId } = req.query;

    const filter: any = { userId };
    if (status) filter.status = status;
    if (shelfId) filter.shelfIds = shelfId;

    const items = await LibraryItemModel.find(filter)
      .populate('bookId')
      .sort({ updatedAt: -1 });

    res.status(200).json({ data: items });
  } catch (error: any) {
    console.error('Error fetching library items:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const addBookToLibrary = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = res.locals.userId;
    const { bookId, status = 'want-to-read', shelfIds = [] } = req.body;

    if (!bookId) {
      res.status(400).json({ error: 'bookId is required' });
      return;
    }

    const newItem = new LibraryItemModel({
      userId,
      bookId,
      status,
      shelfIds
    });

    await newItem.save();
    res.status(201).json({ data: newItem });
  } catch (error: any) {
    console.error('Error adding book to library:', error);
    if (error.code === 11000) {
      res.status(409).json({ error: 'This book is already in your library' });
      return;
    }
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const updateLibraryItem = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = res.locals.userId;
    const { id } = req.params;
    const { status, shelfIds, progress, rating, notes } = req.body;

    const updateData: any = {};
    if (status !== undefined) updateData.status = status;
    if (shelfIds !== undefined) updateData.shelfIds = shelfIds;
    if (progress !== undefined) updateData.progress = progress;
    if (rating !== undefined) updateData.rating = rating;
    if (notes !== undefined) updateData.notes = notes;

    // If status changes to read, we might want to auto-set dateFinished later 

    const item = await LibraryItemModel.findOneAndUpdate(
      { _id: id, userId },
      updateData,
      { new: true, runValidators: true }
    );

    if (!item) {
      res.status(404).json({ error: 'Library item not found or not owned by user' });
      return;
    }

    res.status(200).json({ data: item });
  } catch (error: any) {
    console.error(`Error updating library item ${req.params.id}:`, error);
    if (error.name === 'CastError') {
      res.status(404).json({ error: 'Library item not found' });
      return;
    }
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const removeBookFromLibrary = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = res.locals.userId;
    const { id } = req.params;

    const item = await LibraryItemModel.findOneAndDelete({ _id: id, userId });

    if (!item) {
      res.status(404).json({ error: 'Library item not found or not owned by user' });
      return;
    }

    res.status(200).json({ message: 'Book removed from library successfully' });
  } catch (error: any) {
    console.error(`Error removing library item ${req.params.id}:`, error);
    if (error.name === 'CastError') {
      res.status(404).json({ error: 'Library item not found' });
      return;
    }
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
