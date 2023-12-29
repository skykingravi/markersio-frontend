import { useState } from "react";

export const useBuffer = (maxSize) => {
    const [buffer, setBuffer] = useState([]);

    const pushToBuffer = (item) => {
        setBuffer((prevBuffer) => {
            let newBuffer = [...prevBuffer];
            if (prevBuffer.length >= maxSize) {
                newBuffer.shift();
            }
            if (
                newBuffer.length === 0 ||
                newBuffer[newBuffer.length - 1] !== item
            ) {
                newBuffer.push(item);
            }
            return newBuffer;
        });
    };

    const popFromBuffer = () => {
        setBuffer((prevBuffer) => {
            let newBuffer = [...prevBuffer];
            newBuffer.pop();
            return newBuffer;
        });
    };

    const bufferClear = () => {
        setBuffer([]);
    };

    return [buffer, pushToBuffer, popFromBuffer, bufferClear];
};
