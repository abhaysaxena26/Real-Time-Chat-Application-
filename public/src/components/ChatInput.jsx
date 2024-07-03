import styled from "styled-components";
import Picker from "emoji-picker-react";
import { BsEmojiSmileFill } from "react-icons/bs";
import { IoMdSend } from "react-icons/io"
import React, { useState } from "react";

const ChatInput = ({handleChatMsg}) => {

    const [msg, setMsg] = useState("");
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);

    const handleEmojiPickerhideShow = () => {
        setShowEmojiPicker(!showEmojiPicker);
      };

      const handleEmojiClick = (event, emojiObject) => {
        console.log('inside handleEmojiClick');
        console.log('emojiObject:', emojiObject.emoji);
    
        if (emojiObject && emojiObject.emoji) {
          console.log('inside if statement');
          let message = msg;
          message += emojiObject.emoji;
          setMsg(message);
          handleEmojiPickerhideShow();
        }
      };
      const sendChat = (event) => {
        event.preventDefault();
        if (msg.length > 0) {
          handleChatMsg(msg);
          setMsg("");
        }
      };


      



      return (
        <Container>
          <div className="button-container">
            <div className="emoji">
              <BsEmojiSmileFill onClick={handleEmojiPickerhideShow} />
              {showEmojiPicker && <Picker onEmojiClick={handleEmojiClick} />}
            </div>
          </div>
        
          <form className="input-container" onSubmit={(event) => sendChat(event)}>
            <input
              type="text"
              placeholder=" Type your Message here"
              onChange={(e) =>{setMsg(e.target.value) 

              
              }}
              value={msg}
            />
          
            <button type="submit">
              <IoMdSend />
            </button>
          </form>
        </Container>
      );
}
 
export default ChatInput;

const Container = styled.div`


display: grid;
grid-template-columns: 10% 90%;
height: 6%;
.button-container{

display: flex;
align-items: center;
justify-content: center;
color: yellow;

.emoji {
      position: relative;
      &:hover{
      svg{
      color: yellow;
      }
      
      }
      svg {
        font-size: 1.5rem;
        color: #ffff00c8;
        cursor: pointer;
      }
      .emoji-picker-react {
        position: absolute;
        
        top: -350px;}}




}
.input-container{
display: flex;
gap: 0.5rem;
button{
background-color: #CACACB;
color: black;
width: 10%;
border-radius: 19px;

&:hover{
transition: 0.3s ease-in-out;
color: white;
background-color: #8B8B8C;
}
}

input{
background-color: transparent;
width: 89%;
border: 2px solid white;
border-radius: 16px;
color: white;


}
}


`