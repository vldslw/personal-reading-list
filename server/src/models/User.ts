import { model, Schema } from 'mongoose';

export type ReadingGoal = {
  year: number;
  target: number;
};

export type UserPreferences = {
  theme?: 'light' | 'dark' | 'system';
  font?: string;
  highContrast?: boolean;
};

export type User = {
  email: string;
  passwordHash: string; 
  readingGoals: ReadingGoal[];
  preferences: UserPreferences;
  createdAt: Date;
  updatedAt: Date;
};

const readingGoalSchema = new Schema<ReadingGoal>({
  year: { type: Number, required: true },
  target: { type: Number, required: true },
});

const userPreferencesSchema = new Schema<UserPreferences>(
  {
    theme: {
      type: String,
      enum: ['light', 'dark', 'system'],
      default: 'system',
    },
    font: { type: String, default: 'Inter' }, 
    highContrast: { type: Boolean, default: false },
  },
  { _id: false }
); 

const userSchema = new Schema<User>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    passwordHash: {
      type: String,
      required: true,
    },
    readingGoals: [readingGoalSchema],
    preferences: {
      type: userPreferencesSchema,
      default: () => ({}),
    },
  },
  {
    timestamps: true, 
  }
);

export const UserModel = model<User>('User', userSchema);
