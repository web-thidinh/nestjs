import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UsersDocument = Users & Document;

@Schema()

export class Users {
  @Prop({ required: true })
  email: string;

  @Prop()
  password: string;

  @Prop()
  name: string;

  @Prop()
  picture: string;

  @Prop()
  from: string;
}

export const UsersSchema = SchemaFactory.createForClass(Users);