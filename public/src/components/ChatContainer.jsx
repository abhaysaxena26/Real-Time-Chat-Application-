import styled from 'styled-components';
import Logout from './Logout';
import ChatInput from './ChatInput';
import axios from 'axios';
import { sendMessageRoute } from '../utils/APIRoutes';
import { useState, useEffect, useRef } from 'react';
import { recieveMessageRoute } from '../utils/APIRoutes';

const ChatContainer = ({ currentChat, currentUser, socket }) => {
  const [messages, setMessages] = useState([]);
  const scrollRef = useRef();
  const [arrivalMessage, setArrivalMessage] = useState(null);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await axios.post(recieveMessageRoute, {
          from: currentUser._id,
          to: currentChat._id,
        });

        setMessages(response.data);
      } catch (error) {
        console.error('Error fetching messages:', error);
      }
    };

    if (currentChat) {
      fetchMessages();
    }
  }, [currentChat, currentUser._id]);

  const handleChatMsg = async (msg) => {
    const data = await JSON.parse(localStorage.getItem('chat-app-key'));
    socket.current.emit('send-msg', {
      to: currentChat._id,
      from: data._id,
      msg,
    });

    await axios.post(sendMessageRoute, {
      from: currentUser._id,
      to: currentChat._id,
      message: msg,
    });

    const msgs = [...messages];
    msgs.push({ fromSelf: true, message: msg });
    setMessages(msgs);
  };

  

  useEffect(() => {
    if (socket.current) {
      socket.current.on('msg-recieve', (msg) => {
        setArrivalMessage({ fromSelf: false, message: msg });
      });
    }
  }, [socket]);

  useEffect(() => {
    if (arrivalMessage) {
      setMessages((prev) => [...prev, arrivalMessage]);
    }
  }, [arrivalMessage]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);



  return (
    <Container>
      <div className="chat-header">
        <div className="user-details">
          <div className="avatar">
            <img
              src={`data:image/svg+xml;base64,${currentChat.avatarImage}`}
              alt="avatar"
            />
          </div>
          <div className="username">{currentChat.username}</div>
        </div>
        <Logout />
      </div>

      <div className="chat-messages">
        {messages.map((message, index) => {
          const isLastMessage = index === messages.length - 1;
          return (
            <div
              key={index}
              className={`message ${message.fromSelf ? 'sended' : 'received'}`}
              ref={isLastMessage ? scrollRef : null} // Apply ref to the last message
            >
              <div className="content">
                <p>{message.message}</p>
              </div>
            </div>
          );
        })}
      </div>

      <ChatInput handleChatMsg={handleChatMsg} />
    </Container>
  );
};

export default ChatContainer;

const Container = styled.div`
  .chat-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 2rem;
    margin-top: 13px;

    .logout h1 {
      color: white;
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
        color: white;
      }
    }
  }

  .chat-messages {
    height: 68vh;
    overflow: auto;
    padding: 1rem 1rem;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;

    .message {
      display: flex;

      .content {
        max-width: 40%;
        padding: 1rem;
        font-size: 0.9rem;
        border-radius: 1rem;
        color: #d1d1d1;

        @media screen and (min-width: 720px) and (max-width: 1080px) {
          max-width: 70%;
        }
      }
    }

    .sended {
      justify-content: flex-end;

      .content {
        background-color: #9900ff20;
      }
    }

    .received {
      justify-content: flex-start;

      .content {
        background-color: #9900ff20;
      }
    }
  }
`;
