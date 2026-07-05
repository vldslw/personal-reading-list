import type { Request, Response } from 'express';
import { ShelfModel } from '../models/Shelf.js';

export const getShelves = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = res.locals.userId;
    
    const shelves = await ShelfModel.find({ userId }).sort({ createdAt: -1 });
    
    res.status(200).json({ data: shelves });
  } catch (error: any) {
    console.error('Error fetching shelves:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const createShelf = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = res.locals.userId;
    const { name, description, isPublic } = req.body;

    if (!name) {
      res.status(400).json({ error: 'Shelf name is required' });
      return;
    }

    const newShelf = new ShelfModel({
      userId,
      name,
      description,
      isPublic
    });

    await newShelf.save();
    res.status(201).json({ data: newShelf });
  } catch (error: any) {
    console.error('Error creating shelf:', error);
    if (error.code === 11000) { // MongoDB duplicate key error
      res.status(409).json({ error: 'A shelf with this name already exists' });
      return;
    }
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const updateShelf = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = res.locals.userId;
    const { id } = req.params;
    const { name, description, isPublic } = req.body;

    const shelf = await ShelfModel.findOneAndUpdate(
      { _id: id, userId }, 
      { name, description, isPublic },
      { new: true, runValidators: true }
    );

    if (!shelf) {
      res.status(404).json({ error: 'Shelf not found or not owned by user' });
      return;
    }

    res.status(200).json({ data: shelf });
  } catch (error: any) {
    console.error(`Error updating shelf ${req.params.id}:`, error);
    if (error.code === 11000) {
      res.status(409).json({ error: 'A shelf with this name already exists' });
      return;
    }
    if (error.name === 'CastError') {
      res.status(404).json({ error: 'Shelf not found' });
      return;
    }
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const deleteShelf = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = res.locals.userId;
    const { id } = req.params;

    const shelf = await ShelfModel.findOneAndDelete({ _id: id, userId });

    if (!shelf) {
      res.status(404).json({ error: 'Shelf not found or not owned by user' });
      return;
    }

    res.status(200).json({ message: 'Shelf deleted successfully' });
  } catch (error: any) {
    console.error(`Error deleting shelf ${req.params.id}:`, error);
    if (error.name === 'CastError') {
      res.status(404).json({ error: 'Shelf not found' });
      return;
    }
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
