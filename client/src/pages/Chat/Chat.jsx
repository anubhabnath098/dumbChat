import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import Menu from '../../components/Menu/Menu';
import Contacts from '../../components/Contacts/Contacts';
import Welcome from '../../components/Welcome/Welcome';
import ChatContainer from '../../components/ChatContainer/ChatContainer';
import { io } from "socket.io-client";
import { host, allUserRoute } from '../../utils/APIRoutes';
import axios from "axios";
import { useNavigate } from 'react-router-dom';

export default function Chat() {
  const socket = useRef();
  const [contacts, setContacts] = useState([]);
  const [currentUser, setCurrentUser] = useState(undefined);
  const [currentChat, setCurrentChat] = useState(undefined);
  const [isLoaded, setIsLoaded] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  // 1. Load current user or redirect
  useEffect(() => {
    const fetchUser = async () => {
      const saved = localStorage.getItem("chat-app-user");
      if (!saved) {
        navigate("/login");
      } else {
        setCurrentUser(JSON.parse(saved));
        setIsLoaded(true);
      }
    };
    fetchUser();
  }, [navigate]);

  // 2. Initialize socket
  useEffect(() => {
    if (currentUser) {
      socket.current = io(host);
      socket.current.emit("add-user", currentUser._id);
    }
  }, [currentUser]);

  // 3. Fetch contacts list
  useEffect(() => {
    const getContacts = async () => {
      if (currentUser) {
        if (currentUser.isAvatarImageSet) {
          const { data } = await axios.get(`${allUserRoute}/${currentUser._id}`);
          setContacts(data);
        } else {
          navigate("/setAvatar");
        }
      }
    };
    getContacts();
  }, [currentUser, navigate]);

  const handleChatChange = (chat) => {
    setCurrentChat(chat);
    // auto-close sidebar on mobile when a contact is chosen
    setSidebarOpen(false);
  };

  return (
    <Container sidebarOpen={sidebarOpen}>
      <Menu searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

      {/* Mobile-only sidebar toggle */}
      <ToggleButton onClick={() => setSidebarOpen(open => !open)} className="toggle-button">
        {sidebarOpen ? '×' : '☰'}
      </ToggleButton>

      <div className="container">
        <Contacts
          contacts={contacts}
          currentUser={currentUser}
          changeChat={handleChatChange}
          searchTerm={searchTerm}
          isVisible={sidebarOpen}
        />

        {isLoaded && !currentChat ? (
          <Welcome currentUser={currentUser} />
        ) : (
          <ChatContainer
            currentChat={currentChat}
            currentUser={currentUser}
            socket={socket}
          />
        )}
      </div>
    </Container>
  );
}

const ToggleButton = styled.button`
  display: none;
  @media (max-width: 720px) {
    display: block;
    position: absolute;
    top: 4rem;
    left: 1rem;
    z-index: 20;
    background: transparent;
    border: none;
    font-size: 2rem;
    color: white;
    cursor: pointer;
  }
`;

const Container = styled.div`
  height: 100vh;
  width: 100%;
  display: flex;
  flex-direction: column;
  background-color: #131324;
  align-items: center;
  gap: 1rem;
  padding-top:1rem;
  
  @media screen and (max-width: 720px) {
    padding-top: 4rem;
  }


  .container {
    height: 85vh;
    width: 85vw;
    background-color: #00000076;
    display: grid;
    grid-template-columns: 25% 75%;

    @media screen and (min-width: 720px) and (max-width: 1080px) {
      grid-template-columns: 35% 65%;
    }

    @media screen and (max-width: 720px) {
      overflow: hidden;
      height: 80vh;
      width: 95vw;
      /* When sidebarOpen: contacts=100%, chat=0; when closed: contacts=0, chat=100% */
      grid-template-columns: ${props =>
        props.sidebarOpen ? '100% 0%' : '0% 100%'};
      position: relative;
    }
  }
`;
