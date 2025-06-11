// src/components/Chatinput/Chatinput.jsx

import React, { useState, useRef } from "react";
import styled from "styled-components";
import Picker from "emoji-picker-react";
import SendIcon from "@mui/icons-material/Send";
import CircularProgress from "@mui/material/CircularProgress";
import SentimentSatisfiedAltIcon from "@mui/icons-material/SentimentSatisfiedAlt";
import InsertPhotoIcon from "@mui/icons-material/InsertPhoto";

export default function Chatinput({ fromUser, toUser, handleSendMsg }) {
  const [showEmoji, setShowEmoji]   = useState(false);
  const [msg, setMsg]               = useState("");
  const [previewImg, setPreviewImg] = useState(null);
  const [loading, setLoading]       = useState(false);
  const fileRef = useRef(null);

  const handleEmojiClick = (emojiObject) => {
    setMsg((m) => m + emojiObject.emoji);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPreviewImg(URL.createObjectURL(file));
      fileRef.current = file;
      setShowEmoji(false);
    }
  };

  const sendChat = async (e) => {
    e.preventDefault();
    if (!msg.trim() && !fileRef.current) return;
    setLoading(true);
    const formData = new FormData();
    formData.append("from", fromUser);
    formData.append("to", toUser);
    formData.append("message", msg);
    if (fileRef.current) {
      formData.append("image", fileRef.current);
    }

    try {
      await handleSendMsg(formData);
    } finally {
      setLoading(false);
      setMsg("");
      setPreviewImg(null);
      fileRef.current = null;
      setShowEmoji(false);
    }
  };

  return (
    <>
      <Container previewMode={!!previewImg}>
        <div className="button-container">
          <div className="emoji">
            <SentimentSatisfiedAltIcon
              className="emojiIcon"
              onClick={() => setShowEmoji((v) => !v)}
            />
            {showEmoji && (
              <div className="emoji-picker-wrapper">
                <Picker onEmojiClick={handleEmojiClick} />
              </div>
            )}
          </div>
          <div className="image-upload">
            <input
              type="file"
              accept="image/*"
              id="imageUpload"
              onChange={handleImageUpload}
              style={{ display: "none" }}
            />
            <label htmlFor="imageUpload">
              <InsertPhotoIcon className="imageIcon" />
            </label>
          </div>
        </div>

        <form onSubmit={sendChat} className="input-container">
          <input
            type="text"
            placeholder="Type your message..."
            value={msg}
            onChange={(e) => setMsg(e.target.value)}
            disabled={!!previewImg}
          />
          <button type="submit" disabled={loading}>
            {loading ? <CircularProgress size={20} /> : <SendIcon />}
          </button>
        </form>
      </Container>

      {previewImg && (
        <PreviewOverlay>
          <div className="preview-content">
            <button
                className="remove-btn"
                onClick={() => {
                  setPreviewImg(null);
                  setMsg("");
                }}
                disabled={loading}
              >
                ×
              </button>
            <img src={previewImg} alt="Preview" />
            <input
              type="text"
              className="caption-input"
              placeholder="Write a caption..."
              value={msg}
              onChange={(e) => setMsg(e.target.value)}
              disabled={loading}
            />
            <div className="preview-buttons">
              <button
                className="send-image-btn"
                onClick={sendChat}
                disabled={loading || !msg.trim()}
              >
                {loading ? <CircularProgress size={24} /> : <SendIcon />}
              </button>
              
            </div>
          </div>
        </PreviewOverlay>
      )}
    </>
  );
}

const Container = styled.div`
  position: relative;
  background-color: #080420;
  padding: 0 1rem;
  width: 100%;
  display: flex;
  align-items: center;
  gap: 1rem;
  ${(p) =>
    p.previewMode &&
    `
    filter: blur(5px);
    pointer-events: none;
  `}

  .button-container {
    display: flex;
    align-items: center;
    color: white;
    gap: 1rem;

    .emoji {
      position: relative;
      .emojiIcon {
        font-size: 1.8rem;
        color: #ffff00c8;
        cursor: pointer;
      }
      .emoji-picker-wrapper {
        position: absolute;
        bottom: 60px;
        left: 0;
        z-index: 100;
        background: #080420;
        box-shadow: 0 5px 10px rgba(0,0,0,0.5);
      }
    }

    .image-upload {
      .imageIcon {
        font-size: 1.8rem;
        color: #ffff00c8;
        cursor: pointer;
      }
    }
  }

  .input-container {
    flex: 1;
    display: flex;
    background-color: #ffffff34;
    border-radius: 2rem;
    overflow: hidden;

    input {
      flex: 1;
      padding: 0.8rem 1rem;
      background: transparent;
      border: none;
      color: white;
      font-size: 1rem;

      &::selection {
        background-color: #9a86f3;
      }
      &:focus {
        outline: none;
      }
    }

    button {
      padding: 0 1.5rem;
      border: none;
      background-color: #9a86f3;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
    }

    
  }
  @media screen and (max-width: 720px) {
    padding: 0.5rem;
      .input-container{
        button{
          padding: 0.5rem;
        }
      }
      .button-container{
        padding: 0.5rem;
      }
    }
`;

const PreviewOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(8, 4, 32, 0.7);
  backdrop-filter: blur(8px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;

  .preview-content {
    background: #080420;
    padding: 1rem;
    border-radius: 1rem;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    position: relative;
    width: 90%;
    max-width: 400px;

    img {
      width: 100%;
      object-fit: contain;
      border-radius: 0.5rem;
    }

    .caption-input {
      width: 100%;
      padding: 0.8rem;
      border-radius: 0.5rem;
      border: none;
      font-size: 1rem;
      outline: none;
    }

    .preview-buttons {
      display: flex;
      justify-content: flex-end;
      gap: 0.5rem;
    }

    .send-image-btn {
      background: #4caf50;
      border: none;
      border-radius: 50%;
      padding: 0.6rem;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .remove-btn {
      background: #ff4d4d;
      border: none;
      border-radius: 50%;
      width: 28px;
      height: 28px;
      color: white;
      font-size: 1.2rem;
      cursor: pointer;
    }
  }
`;
