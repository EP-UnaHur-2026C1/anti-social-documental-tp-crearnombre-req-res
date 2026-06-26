const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
    userNickname: {
        type: mongoose.Schema.Types.String,
        ref: 'User',
        required: [true, 'User nickname is required']
    },
    postId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post',
        required: [true, 'Post ID is required']
    }
    ,
    descripcion: {
        type: String,
        required: [true, 'Description is required'],
        trim: true,
    },
    fecha: {
        type: Date,
        default: Date.now,
    }
}, {
    timestamps: true,
    toJSON: {
        virtuals: true
    }, toObject: {
        virtuals: true
    }
});

commentSchema.virtual('visibilidad').get(function () {
    const limiteMeses = parseInt(process.env.COMENTARIOS_LIMITE_MESES) || 6;
    const fechaLimite = new Date();
    fechaLimite.setMonth(fechaLimite.getMonth() - limiteMeses);

    return this.fecha >= fechaLimite;
})

const Comment = mongoose.model('Comment', commentSchema);

module.exports = Comment;