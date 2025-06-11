const { v2: cloudinary } = require('cloudinary');
const messageModel = require('../models/messageModel');
require('dotenv').config(); 

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// helper to upload via stream
const streamUpload = (buffer) =>
  new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: 'dumb-chat', resource_type: 'image' },
      (error, result) => {
        if (error) {
          console.error("Cloudinary Upload Error:", error);
          return reject(error);
        }
        resolve(result);
      }
    );
    stream.end(buffer);
  });

module.exports.addMessage = async (req, res, next) => {
  try {
    const { from, to, message } = req.body;
    let imageUrl = null;
    if (req.file) {
      const uploadResult = await streamUpload(req.file.buffer);
      imageUrl = uploadResult.secure_url;
    }
    console.log("Image URL:", imageUrl);

    const data = await messageModel.create({
      message: {
        text:  message || null,
        image: imageUrl,
      },
      users: [from, to],
      sender: from,
    });

    if (data) return res.json({ msg: 'Message added successfully', createdMessage: data });
    return res.status(500).json({ msg: 'Failed to add message to database' });
  } catch (ex) {
    next(ex);
  }
};

module.exports.getAllMessage = async (req, res, next) => {
  try {
    const { from, to } = req.body;
    const messages = await messageModel
      .find({ users: { $all: [from, to] } })
      .sort({ updatedAt: 1 });

    const projectMessages = messages.map((msg) => ({
      fromSelf: msg.sender.toString() === from,
      message: {
        text:  msg.message.text,
        image: msg.message.image,
      },
    }));

    res.json(projectMessages);
  } catch (ex) {
    next(ex);
  }
};
