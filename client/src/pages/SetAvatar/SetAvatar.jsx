import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { ToastContainer, toast } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import loader from "../../assets/loader.svg";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { setAvatarRoute } from "../../utils/APIRoutes";

export default function SetAvatar() {
  const navigate = useNavigate();
  const [avatars, setAvatars] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedAvatar, setSelectedAvatar] = useState(undefined);

  const toastOptions = {
    position: "bottom-right",
    autoClose: 8000,
    pauseOnHover: true,
    draggable: true,
    theme: "dark",
  };

  useEffect(() => {
    if (!localStorage.getItem("chat-app-user")) {
      navigate("/login");
    }
  }, []);

  const setProfilePicture = async () => {
    try {
      if (selectedAvatar === undefined) {
        toast.error("Please select an avatar", toastOptions);
      } else {
        const user = JSON.parse(localStorage.getItem("chat-app-user"));
        const { data } = await axios.post(`${setAvatarRoute}/${user._id}`, {
          image: avatars[selectedAvatar],
        });
        if (data.isSet) {
          user.isAvatarImageSet = true;
          user.avatarImage = data.image;
          localStorage.setItem("chat-app-user", JSON.stringify(user));
          navigate("/");
        }
      }
    } catch (err) {
      toast.error("Error setting avatar, Please try again", toastOptions);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = [];

        for (let i = 0; i < 4; i++) {
          const seed = Math.floor(Math.random() * 1000);
          const url = `https://api.dicebear.com/7.x/bottts/svg?seed=${seed}`;

          const response = await fetch(url);
          const svgText = await response.text();
          const base64 = window.btoa(unescape(encodeURIComponent(svgText)));

          data.push(base64);
        }

        setAvatars(data);
        setIsLoading(false);
      } catch (error) {
        toast.error("Can't load avatar, try refreshing the page", toastOptions);
      }
    };

    fetchData();
  }, []);

  return (
    <>
      {isLoading ? (
        <Container>
          <img src={loader} alt="loading..." className="loader" />
        </Container>
      ) : (
        <Container>
          <div className="title-container">
            <h1>Pick an avatar for your profile picture</h1>
          </div>
          <div className="avatars">
            {avatars.map((avatar, index) => (
              <div
                key={index}
                className={`avatar ${selectedAvatar === index ? "selected" : ""}`}
              >
                <img
                  src={`data:image/svg+xml;base64,${avatar}`}
                  alt={`avatar-${index}`}
                  onClick={() => setSelectedAvatar(index)}
                />
              </div>
            ))}
          </div>
          <button className="submit-btn" onClick={setProfilePicture}>
            Select Profile Picture
          </button>
        </Container>
      )}
      <ToastContainer />
    </>
  );
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 3rem;
  height: 100vh;
  width: 100vw;
  background-color: #131324;

  .title-container {
    @media screen and (max-width: 720px) {
      margin-top: 2rem;
    }
    h1 {
      color: white;
      @media screen and (max-width: 720px) {
        font-size: 1rem;
      }
    }
  }

  .avatars {
    display: flex;
    gap: 2rem;
    @media screen and (max-width: 720px) {
      flex-direction: column;
    }

    .avatar {
      border: 0.4rem solid transparent;
      padding: 0.4rem;
      border-radius: 5rem;
      display: flex;
      justify-content: center;
      align-items: center;
      transition: 0.5s ease-in-out;

      img {
        height: 6rem;
      }

      &.selected {
        border: 0.4rem solid #4e0eff;
      }
    }
  }

  .submit-btn {
    @media screen and (max-width: 720px) {
      position: relative;
      bottom: 30px;
    }
    background-color: #4e0eff;
    color: white;
    padding: 1rem 2rem;
    border: none;
    font-weight: bold;
    cursor: pointer;
    border-radius: 0.4rem;
    font-size: 1rem;
    text-transform: uppercase;

    &:hover {
      background-color: #3a0ccc;
    }
  }

  .loader {
    width: 50px;
  }
`;
