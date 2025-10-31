import mongoose, {Document, Schema} from "mongoose";

export interface IMessage extends Document {
    user: mongoose.Schema.Types.ObjectId;
    username: string;
    text: string;
    timestamp: Date;
}

const MessageSchema: Schema = new Schema({
    user: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
    username: {type: String, required: true},
    text: {type: String, required: true},
    timestamp: {type: Date, default: Date.now}
});

export default mongoose.model<IMessage>('Message', MessageSchema)