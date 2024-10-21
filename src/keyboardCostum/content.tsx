import React, { useEffect, useRef, useState } from "react";
// import PropTypes from "prop-types";
import buttonMapping from "./libs/button";

import "./content.scss";
import Display from "./page/display";
import Numpad from "./page/numpad";

interface KeyboardProps {
  title?: string;
  show?: boolean;
  onCloseClick?: () => void | undefined;
  onButtonOkClick?: (inputValue: string) => void | undefined;
  id?: string;
}

type FunctionalKeys = "backspace" | "caps" | "tab" | "shift" | "spacebar";
type ButtonKeys = keyof typeof buttonMapping;

type KeyboardKeys = ButtonKeys | FunctionalKeys;

const Content: React.FC<KeyboardProps> = function Content({
  title,
  show,
  onCloseClick,
  onButtonOkClick,
  id,
}) {
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const [cursorPosition, setCursorPosition] = useState<number>(0);

  const [enterValue, setEnterValue] = useState<string>("");
  const [capslockValue, setCapslockValue] = useState<boolean>(false);
  const [shiftValue, setShiftValue] = useState<boolean>(false);

  let charToAppend = "";

  const [styleC, setStyleC] = useState("dark");
  const [style, setStyle] = useState<string>("dark");
  const [displayKeyboard, setDisplayKeyboard] = useState<boolean>(false);

  useEffect(() => {
    if (textAreaRef.current) {
      textAreaRef.current.focus();
      textAreaRef.current.setSelectionRange(cursorPosition, cursorPosition);
    }
  }, [cursorPosition, enterValue]);

  const handleShiftButtonColor = () => {
    setStyle((prevStyle) => (prevStyle === "light" ? "dark" : "light"));
  };

  const handleDisplayKeyboard = () => {
    setDisplayKeyboard(!displayKeyboard);
  };

  // const handleButtonClick = (value: KeyboardKeys) => {
  //   if (textAreaRef.current) {
  //     const cursorPosition = textAreaRef.current.selectionStart;

  //     switch (value) {
  //       case "backspace":
  //         setEnterValue((prevValue) => prevValue.slice(0, -1));
  //         setTimeout(() => {
  //           textAreaRef.current?.setSelectionRange(
  //             cursorPosition - 1,
  //             cursorPosition - 1
  //           );
  //         }, 0);
  //         break;
  //       case "caps":
  //         setCapslockValue(!capslockValue);
  //         break;
  //       case "tab":
  //         setEnterValue((prevValue) => `${prevValue}    `);
  //         setTimeout(() => {
  //           textAreaRef.current?.setSelectionRange(
  //             cursorPosition + 4,
  //             cursorPosition + 4
  //           );
  //         }, 0);
  //         break;
  //       case "shift":
  //         setShiftValue(!shiftValue);
  //         break;
  //       case "spacebar":
  //         setEnterValue((prevValue) => `${prevValue} `);
  //         setTimeout(() => {
  //           textAreaRef.current?.setSelectionRange(
  //             cursorPosition + 1,
  //             cursorPosition + 1
  //           );
  //         }, 0);
  //         break;
  //       default: {
  //         const [primaryChar, secChar, Terchar] = buttonMapping[value];
  //         if (capslockValue === shiftValue) {
  //           charToAppend = primaryChar;
  //         } else if (capslockValue === true && shiftValue === false) {
  //           charToAppend = Terchar;
  //         } else {
  //           charToAppend = secChar;
  //         }
  //         setEnterValue((prevValue) => prevValue + charToAppend);
  //         setTimeout(() => {
  //           textAreaRef.current?.setSelectionRange(
  //             cursorPosition + 1,
  //             cursorPosition + 1
  //           );
  //         }, 0);
  //         break;
  //       }
  //     }
  //   }
  // };

  const handleButtonClick = (value: KeyboardKeys) => {
    if (textAreaRef.current) {
      const currentCursorPosition = textAreaRef.current.selectionStart;
      setCursorPosition(currentCursorPosition); // Simpan posisi kursor saat ini

      switch (value) {
        case "backspace":
          setEnterValue((prevValue) =>
            prevValue.slice(0, currentCursorPosition - 1) + prevValue.slice(currentCursorPosition)
          );
          setTimeout(() => {
            textAreaRef.current?.setSelectionRange(currentCursorPosition - 1, currentCursorPosition - 1);
          }, 0);
          break;

        case "caps":
          setCapslockValue(!capslockValue);
          break;

        case "shift":
          setShiftValue(!shiftValue);
          // Setel ulang posisi kursor tanpa mengubah teks
          setTimeout(() => {
            textAreaRef.current?.setSelectionRange(currentCursorPosition, currentCursorPosition);
          }, 0);
          break;

        case "spacebar":
          setEnterValue((prevValue) =>
            prevValue.slice(0, currentCursorPosition) + " " + prevValue.slice(currentCursorPosition)
          );
          setTimeout(() => {
            textAreaRef.current?.setSelectionRange(currentCursorPosition + 1, currentCursorPosition + 1);
          }, 0);
          break;

        default: {
          const [primaryChar, secChar, Terchar] = buttonMapping[value];
          let charToAppend = "";

          if (capslockValue === shiftValue) {
            charToAppend = primaryChar;
          } else if (capslockValue && !shiftValue) {
            charToAppend = Terchar;
          } else {
            charToAppend = secChar;
          }

          setEnterValue((prevValue) =>
            prevValue.slice(0, currentCursorPosition) + charToAppend + prevValue.slice(currentCursorPosition)
          );

          setTimeout(() => {
            textAreaRef.current?.setSelectionRange(currentCursorPosition + 1, currentCursorPosition + 1);
          }, 0);
          break;
        }
      }
    }
  };

  const handleClose = () => {
    if (onCloseClick) {
      onCloseClick();
    }
    setEnterValue("");
  };

  const handleButtonOkClick = (value: string) => {
    if (onButtonOkClick) {
      onButtonOkClick(value);
    }
    setEnterValue("");
  };

  return (
    show && (
      <div className="keyboard-style" id={id}>
        <div className="kerbord-header">
          <div>
            <h3>{title}</h3>
          </div>

          <div className="closeOutline" onClick={handleClose}>
            close
          </div>
        </div>

        <div className="textbox">
          <textarea
            value={enterValue}
            placeholder="type here"
            ref={textAreaRef}
            onChange={(e) => {
              setEnterValue(e.target.value);
              const cursorPosition = e.target.selectionStart;
              setEnterValue(e.target.value);
              setTimeout(() => {
                textAreaRef.current?.setSelectionRange(
                  cursorPosition,
                  cursorPosition
                );
              }, 0);
            }}
          />
          {/* <textarea
            value={enterValue}
            placeholder="type here"
            ref={textAreaRef}
            onChange={(e) => {
              setEnterValue(e.target.value);
              setCursorPosition(e.target.selectionStart); // Simpan posisi kursor saat input berubah
            }}
          /> */}
        </div>

        {displayKeyboard ? (
          <Numpad
            enterValue={enterValue}
            shiftValue={shiftValue}
            handleButtonClick={handleButtonClick}
            handleButtonOkClick={handleButtonOkClick}
            handleShiftButtonColor={handleShiftButtonColor}
            style={style}
            handleDisplayKeyboard={handleDisplayKeyboard}
          />
        ) : (
          <Display
            enterValue={enterValue}
            shiftValue={shiftValue}
            handleButtonClick={handleButtonClick}
            handleButtonOkClick={handleButtonOkClick}
            handleShiftButtonColor={handleShiftButtonColor}
            style={style}
            handleDisplayKeyboard={handleDisplayKeyboard}
          />
        )}
      </div>
    )
  );
};

// Content.propTypes = {
//   title: PropTypes.string,
//   show: PropTypes.bool,
//   onCloseClick: PropTypes.func,
//   onButtonOkClick: PropTypes.func,
//   id: PropTypes.string,
// };

// Content.defaultProps = {
//   title: "some title",
//   show: false,
//   onCloseClick: () => {},
//   onButtonOkClick: () => {},
//   id: "id-style",
// };

export default Content;
