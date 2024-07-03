
import React, { useState, useEffect } from "react";
import styled from "styled-components";
import Robot from "../assets/robotmy.gif";
import Logout from "./Logout";



const Welcome = ({currentUser}) => {

    const [userName, setUserName] = useState("");


    useEffect(() => {
        const fetchUserName = async () => {
            const userData = await JSON.parse(localStorage.getItem('chat-app-key'));
            setUserName(userData.username);
        };
    
        fetchUserName();
    }, []);

    return (

        <Container>

            <img src={Robot} alt="" />
            <h1>
                Welcome, 
                
                <span>{currentUser?.username}!</span>
            </h1>
            <h3>Please select a chat to Start messaging.</h3>

        </Container>
    );
}

export default Welcome;


const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
  flex-direction: column;
  img {
    height: 20rem;
  }
  span {
    color: #4e0eff;
  }
`;