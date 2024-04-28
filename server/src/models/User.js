import { Schema, model } from "mongoose";
import bcryptjs from 'bcryptjs'

const UserSchema = new Schema({
    user: { type: String, required: true, unique: true  },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, default: 'USER' },
    friends: [{ 
        id: { type: String, required: true },
        name: { type: String, required: true },
    }],
    mailbox: [{
        sender: { type: String, required: true },
    }]
},{
    timestamps : true
})

UserSchema.methods.encryptPassword = async password => {
    const salt = await bcryptjs.genSalt(10);
    return await bcryptjs.hash(password, salt);
};

UserSchema.methods.matchPassword = async function(password) {
    return await bcryptjs.compare(password, this.password);
};

export default model('User', UserSchema);