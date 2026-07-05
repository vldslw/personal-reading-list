import { model, Types, Schema } from 'mongoose';

export type ReadingStatus = 'want-to-read' | 'reading' | 'read';

export type ReadingLogEntry = {
  date: Date;
  progress: number;
};

export type LibraryItem = {
  userId: Types.ObjectId;
  bookId: Types.ObjectId;
  status: ReadingStatus;
  shelfIds: Types.ObjectId[];
  progress: number;
  rating?: number;
  notes?: string;
  dateAdded: Date;
  dateFinished?: Date;
  readingLog: ReadingLogEntry[];
  createdAt: Date;
  updatedAt: Date;
};

const readingLogSchema = new Schema<ReadingLogEntry>(
  {
    date: { type: Date, required: true, default: Date.now },
    progress: { type: Number, required: true },
  },
  { _id: false }
);

const libraryItemSchema = new Schema<LibraryItem>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true, 
    },
    bookId: {
      type: Schema.Types.ObjectId,
      ref: 'Book',
      required: true,
    },
    status: {
      type: String,
      enum: ['want-to-read', 'reading', 'read'],
      default: 'want-to-read',
      required: true,
      index: true, 
    },
    shelfIds: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Shelf',
      },
    ],
    progress: {
      type: Number,
      default: 0,
      min: 0,
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
    },
    notes: {
      type: String,
      maxlength: 2000,
    },
    dateAdded: {
      type: Date,
      default: Date.now,
      required: true,
    },
    dateFinished: {
      type: Date,
    },
    readingLog: [readingLogSchema],
  },
  {
    timestamps: true,
  }
);

// Prevent a user from adding the exact same book to their library twice
libraryItemSchema.index({ userId: 1, bookId: 1 }, { unique: true });

export const LibraryItemModel = model<LibraryItem>('LibraryItem', libraryItemSchema);
