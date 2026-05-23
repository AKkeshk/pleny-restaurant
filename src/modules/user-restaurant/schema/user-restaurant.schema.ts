import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class UserRestaurant extends Document {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  user: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Restaurant', required: true })
  restaurant: Types.ObjectId;

  @Prop()
  createdAt: Date;

  @Prop()
  updatedAt: Date;

  @Prop({ default: false })
  isDeleted: boolean;

  @Prop()
  deletedAt?: Date;
}

export const UserRestaurantSchema =
  SchemaFactory.createForClass(UserRestaurant);

UserRestaurantSchema.index(
  { user: 1, restaurant: 1 },
  { unique: true, partialFilterExpression: { isDeleted: { $ne: true } } },
);
