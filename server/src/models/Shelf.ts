import { Types, model, Schema } from 'mongoose';

export type Shelf = {
  name: string;
  userId: Types.ObjectId;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
};

const shelfSchema = new Schema<Shelf>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 50,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    description: {
      type: String,
      trim: true,
      maxlength: 300,
    },
  },
  {
    timestamps: true,
  }
);

// A user should not have two shelves with the exact same name
shelfSchema.index({ userId: 1, name: 1 }, { unique: true });

export const ShelfModel = model<Shelf>('Shelf', shelfSchema);
