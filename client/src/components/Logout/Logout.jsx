import React, { useState } from "react";
import LogoutIcon from "@mui/icons-material/Logout";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

export default function Logout() {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);

  const handleLogoutClick = () => {
    setShowModal(true);
  };

  const confirmLogout = () => {
    localStorage.clear();
    navigate("/login");
    setShowModal(false);
  };

  const cancelLogout = () => {
    setShowModal(false);
  };

  return (
    <>
      <Button onClick={handleLogoutClick}>
        <LogoutIcon style={{ fontSize: "1.5rem", color: "white" }} />
      </Button>

      {showModal && (
        <ModalOverlay>
          <ModalContent>
            <ModalMessage>Do you want to logout?</ModalMessage>
            <ModalButtons>
              <ModalButton onClick={confirmLogout} confirm>
                Yes
              </ModalButton>
              <ModalButton onClick={cancelLogout}>No</ModalButton>
            </ModalButtons>
          </ModalContent>
        </ModalOverlay>
      )}
    </>
  );
}

const Button = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  background-color: #9a86f3;
  color: white;
  cursor: pointer;
  transition: background-color 0.3s ease;
  margin: 1rem;

  &:hover {
    background-color: #8369c7;
  }
`;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background-color: white;
  padding: 2rem;
  border-radius: 0.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  text-align: center;
  width: 90%;
  max-width: 400px;
`;

const ModalMessage = styled.p`
  font-size: 1.2rem;
  margin-bottom: 1.5rem;
`;

const ModalButtons = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: center;
`;

const ModalButton = styled.button`
  padding: 0.5rem 1.5rem;
  border: none;
  border-radius: 0.5rem;
  font-size: 1rem;
  cursor: pointer;
  background-color: ${(props) => (props.confirm ? "#ff5c5c" : "#9a86f3")};
  color: white;

  &:hover {
    background-color: ${(props) =>
      props.confirm ? "#e04a4a" : "#8369c7"};
  }
`;
