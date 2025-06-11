import React from 'react'
import styled from 'styled-components'
import Cat from "../../assets/cat.gif"

export default function Welcome({currentUser}) {
  return (
    <Container>
      <img src={Cat} alt="welcoming cat" />
      <h1>
        Hewo {">///< "} {currentUser.username}
      </h1>
      <h3>Select a chat to start messaging</h3>
    </Container>
  )
}

const Container = styled.div`
    width:100%;
    height:100%;
    display:flex;
    justify-content:center;
    align-items:center;
    flex-direction:column;
    color:#9186f3;
    img{
        height:40%;
        padding:1rem;
        @media screen and (max-width:720px){
          height:40%;
          width:80%;
          padding:1rem;
        }
    }
    h3{
        opacity:0.7;
        @media screen and (max-width:720px){

          font-size:1rem;
        }
    }
    @media screen and (max-width:720px) {
      h1{
        /* font-size:1.5rem;
        text-align:center; */
        display:none;
      }
      h3{
        display:none;
      }

    }
    

`