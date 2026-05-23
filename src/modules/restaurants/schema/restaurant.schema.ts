import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";

@Schema({ timestamps: true })
export class Restaurant extends Document {
 
 @Prop({
    type: {
      en: { type: String, required: true ,unique: true},
      ar: { type: String, required: true ,unique: true},
    },
    required: true,
  })
  name: { en: string; ar: string };

  @Prop({ type: [Types.ObjectId], ref: "Cuisine", default: [] })
  cuisines?: Types.ObjectId[];

  @Prop({ required: true })
  yearFounded: number;

   @Prop({
    type: {
      type: String,
      enum: ["Point"],
      required: true,
      default: "Point",
    },

    coordinates: {
      type: [Number],
      required: true,
    },
  })
  location: {
    type: "Point";
    coordinates: [number, number];
  };

  @Prop()
  createdAt: Date;

  @Prop()
  updatedAt: Date;  

  @Prop({ default: false })
  isDeleted: boolean;

  @Prop()
  deletedAt?: Date;
}

export const RestaurantSchema = SchemaFactory.createForClass(Restaurant);



RestaurantSchema.index({ location: "2dsphere" });
