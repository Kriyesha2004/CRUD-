import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
    @Prop()
    username: string;

    @Prop()
    email: string;

    @Prop()
    age: number;

    @Prop({ required: true })
    password: string;

    @Prop({ default: 'USER', enum: ['USER', 'ADMIN'] })
    role: string;

    createdAt: Date;
    updatedAt: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);