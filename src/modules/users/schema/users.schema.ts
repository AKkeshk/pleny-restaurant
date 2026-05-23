import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";

@Schema({ timestamps: true })
export class User extends Document {
 
  @Prop({ required: true })
  fullName: string;
  
  
  @Prop({ type: [Types.ObjectId], ref: "Cuisine", default: [] })
  favoriteCuisines?: Types.ObjectId[];

  @Prop()
  createdAt: Date;

  @Prop()
  updatedAt: Date;  

  @Prop({ default: false })
  isDeleted: boolean;

  @Prop()
  deletedAt?: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
