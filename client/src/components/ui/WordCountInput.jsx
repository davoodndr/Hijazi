import { useEffect, useState } from "react";


const WordCountInput = ({
  value,
  minWords = 10,
  maxWords = 20,
  placeholder = "",
  onChange
}) => {
  const [text, setText] = useState('');
  
  useEffect(() => {
    setText(value)
  },[value])

  const countWords = (text) => {
    return text?.trim().split(/\s+/).filter(Boolean).length;
  };

  const handleChange = (e) => {
    const newText = e.target.value;
    const wordCount = countWords(newText);
    if (wordCount <= maxWords) {
      setText(newText);
      onChange({detail: newText, wordCount})
    }
  };

  const wordCount = countWords(text);
  const isTooShort = wordCount < minWords;
  const isTooLong = wordCount > maxWords;

  return (
    <div className={`relative`}>
      <textarea
        value={text}
        onChange={handleChange}
        rows="3"
        placeholder={placeholder ? placeholder : `Write between ${minWords} and ${maxWords} words...`}
        className="leading-4 !h-full !p-2"
      />
      <div className="absolute bottom-1 right-2.5 text-xs">
        <p style={{ color: isTooShort || isTooLong ? 'red' : 'green' }}>
          {wordCount}/{maxWords}
        </p>
      </div>
    </div>
  );
};

export default WordCountInput;