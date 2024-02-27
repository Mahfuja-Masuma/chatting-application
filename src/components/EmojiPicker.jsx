import React from 'react';

const EmojiPicker = ({ onSelectEmoji }) => {
  const emojis = ['😊', '😂', '😍', '😎', '👍', '👌', '❤️', '🙌', '🎉']; // Add more emojis as needed

  return (
    <div className="flex items-center">
      {emojis.map((emoji, index) => (
        <span key={index} onClick={() => onSelectEmoji(emoji)}>{emoji}</span>
      ))}
    </div>
  );
};

export default EmojiPicker;
