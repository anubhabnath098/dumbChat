import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import Logout from "../Logout/Logout";
import Chatinput from "../Chatinput/Chatinput";
import axios from "axios";
import { sendMessageRoute, getAllMessagesRoute } from "../../utils/APIRoutes";
import { v4 as uuidv4 } from "uuid";

export default function ChatContainer({ currentChat, currentUser, socket }) {
  const [messages, setMessages] = useState([]);
  const [arrivalMessage, setArrivalMessage] = useState(null);
  const [previewImg, setPreviewImg] = useState(null);
  const scrollRef = useRef();

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        if (currentChat) {
          const response = await axios.post(getAllMessagesRoute, {
            from: currentUser._id,
            to: currentChat._id,
          });
          setMessages(response.data);
          console.log(response.data);
        }
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };
    fetchMessages();
  }, [currentChat, currentUser]);

  const handleSendMsg = async ({ text, image }) => {
    try {

      await axios.post(sendMessageRoute, {
        from: currentUser._id,
        to: currentChat._id,
        message: text,
        image: image,
      });

      // Emit real-time message via socket
      socket.current.emit("send-msg", {
        to: currentChat._id,
        from: currentUser._id,
        message: text,
        image: image,
      });

      // Update local state
      const msgs = [...messages];
      msgs.push({ fromSelf: true, message: text, image: image });
      setMessages(msgs);
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  useEffect(() => {
    console.log(socket.current);
    if (socket.current) {
      socket.current.on("msg-receive", (data) => {
        console.log(data);
        setArrivalMessage({
          fromSelf: false,
          message: data.message,
          image: data.image,
        });
      });
    }
  }, [socket]);

  useEffect(() => {
    if (arrivalMessage) {
      setMessages((prev) => [...prev, arrivalMessage]);
    }
  }, [arrivalMessage]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <>
      {currentChat && (
        <Container>
          <div className="chat-header">
            <div className="user-details">
              <div className="avatar">
                <img
                  src={`data:image/svg+xml;base64,${currentChat.avatarImage}`}
                  alt="avatar"
                />
              </div>
              <div className="username">
                <h3>{currentChat.username}</h3>
              </div>
            </div>
            <Logout className="widelogout" />
          </div>

          <div className={`chat-messages ${previewImg ? "blurred" : ""}`}>
            {messages.map((message) => (
              <div ref={scrollRef} key={uuidv4()}>
                <div className={`${message.fromSelf ? "sended" : "received"}`}>
                  <div className="content">
                    <p>
                      {typeof message.message === "string"
                        ? message.message
                        : message.message?.text}
                    </p>
                    {(message.image || message.message?.image) && (
                      <img
                        src={message.image ? message.image : message.message?.image}
                        alt="Message attachment"
                        className="image"
                      />
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {previewImg && (
            <div className="image-preview-overlay">
              <div className="image-preview-container">
                <img src={previewImg} alt="Preview" className="image-preview" />
                <button className="remove-button" onClick={() => setPreviewImg(null)}>
                  Remove Image
                </button>
              </div>
              <Chatinput handleSendMsg={handleSendMsg} previewImg={previewImg} setPreviewImg={setPreviewImg}/>
            </div>
            
          )}

          <Chatinput handleSendMsg={handleSendMsg} previewImg={previewImg} setPreviewImg={setPreviewImg}/>
        </Container>
      )}
    </>
  );
}

const Container = styled.div`
  display: grid;
  grid-template-rows: 10% 78% 12%;
  padding-top: 1rem;
  height: 85vh;
  width: 100%;
  overflow: hidden;

  .content {
    max-width: 50%;
    overflow-wrap: break-word;
    color: #d1d1d1;
    padding: 1rem;
    font-size: 1.1rem;
    border-radius: 1rem;
  }

  .image {
    object-fit: contain;
    max-width: 95%;
    max-height: 50rem;
  }

  .image-preview-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.7);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 10;
    backdrop-filter: blur(10px);

    .image-preview-container {
      position: relative;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 1rem;

      .image-preview {
        max-width: 90%;
        max-height: 80vh;
        object-fit: contain;
        border-radius: 1rem;
      }

      .remove-button {
        background-color: #ff4d4d;
        border: none;
        border-radius: 0.5rem;
        padding: 0.5rem 1rem;
        font-size: 1rem;
        color: white;
        cursor: pointer;
        transition: background-color 0.3s ease;

        &:hover {
          background-color: #ff1a1a;
        }
      }
    }
  }

  @media screen and (min-width: 720px) and (max-width: 1080px) {
    grid-auto-rows: 15% 70% 15%;
  }

  @media screen and (max-width: 720px) {
    grid-template-rows: 13% 75% 9%;
    height: 80vh;
    .widelogout {
      display: none;
    }
    .content {
      max-width: 70%;
    }
  }

  .chat-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 2rem;
  }

  .user-details {
    display: flex;
    align-items: center;
    gap: 1rem;

    .avatar {
      img {
        height: 3rem;
      }
    }

    .username {
      h3 {
        color: white;
      }
    }
  }

  .chat-messages {
    width: 100%;
    padding: 1rem 2rem;
    overflow: auto;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    position: relative;

    &.blurred {
      filter: blur(5px);
      pointer-events: none;
    }

    &::-webkit-scrollbar {
      width: 7px;
    }
    &::-webkit-scrollbar-thumb {
      background: #2d2d2d;
      border-radius: 6px;
    }

    .sended {
      display: flex;
      justify-content: flex-end;
      .content {
        background-color: #5a2cc6c2;
      }
    }

    .received {
      display: flex;
      justify-content: flex-start;
      .content {
        background-color: #3b055ff2;
      }
    }
  }
`;

