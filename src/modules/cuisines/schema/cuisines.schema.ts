import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";

@Schema({ timestamps: true })
export class Cuisine   extends Document {
 
  @Prop({ required: true })
  name: string;
  

  @Prop()
  createdAt: Date;

  @Prop()
  updatedAt: Date;  

  @Prop({ default: false })
  isDeleted: boolean;

  @Prop()
  deletedAt?: Date;
}

export const CuisineSchema = SchemaFactory.createForClass(Cuisine);
