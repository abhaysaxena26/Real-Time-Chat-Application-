import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import styled from "styled-components";
import axios from "axios";
import React, {  useState, useRef } from "react";
import { allUsersRoute ,host } from "../utils/APIRoutes";
import Contacts from '../components/Contacts'
import Welcome from "../components/Welcome";
import {io} from 'socket.io-client'
import ChatContainer from "../components/ChatContainer";


const Chat = () => {

  const socket = useRef();

  

    const navigate = useNavigate()
    const [contacts, setContacts] = useState([]);

      const [currentChat, setCurrentChat] = useState(undefined);
  const [currentUser, setCurrentUser] = useState(undefined);



  useEffect(() => {
    const fetchData = async () => {
        if (!localStorage.getItem('chat-app-key')) {
            navigate("/login");
        } else {
            setCurrentUser(
                await JSON.parse(
                  localStorage.getItem('chat-app-key')
                )
              );
        }
    };

    fetchData();
}, []);


useEffect(() => {
  if (currentUser) {
    socket.current = io(host);
    socket.current.emit("add-user", currentUser._id);
  }
}, [currentUser]);



const handleChatChange = (chat) => {
  setCurrentChat(chat);
};



useEffect(() => {
    const fetchData = async () => {
        if (currentUser) {
            if (currentUser.isAvatarImageSet) {
                const data = await axios.get(`${allUsersRoute}/${currentUser._id}`);
                setContacts(data.data);
                
            } else {
                navigate("/setAvatar");
            }
        }
    };

    fetchData();
}, [currentUser]);



    return (
       
        <>
        
        <Container>

        <div className="container">
        
        
      <Contacts contacts ={contacts} currentUser={currentUser} changeChat={handleChatChange}></Contacts>
     {currentChat===undefined ?  <Welcome currentUser={currentUser}></Welcome> : <ChatContainer currentUser={currentUser} currentChat={currentChat} socket={socket}></ChatContainer>}

        </div>

      

        </Container>
        
        
        
        </>






      );
}
 
export default Chat;


const Container = styled.div`
  height: 100vh;
  width: 100vw;
  display: grid;
  flex-direction: column;
  justify-content: center;
  gap: 1rem;
  align-items: center;
  background-color: #131324;
  .container {
    height: 85vh;
    width: 85vw;
    background-color: #00000076;
    display: grid;
    grid-template-columns: 25% 75%;
    @media screen and (min-width: 720px) and (max-width: 1080px) {
      grid-template-columns: 35% 65%;
    }
  }
`;