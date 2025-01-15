import { Schema, model, models } from 'mongoose';

const LocoMemSchema = new Schema({
    owner: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, {
    timestamps: true
});

const LocoMem = models.LocoMem || model('LocoMem', LocoMemSchema);

export default LocoMem;