import React from "react";

type StateSetJSX = React.Dispatch<React.SetStateAction<JSX.Element>>;

const inputToggle = (className: string, defText: string, elm: JSX.Element, setElm: StateSetJSX, textVal: string, setTextVal: React.Dispatch<React.SetStateAction<string>>) => {
    const textClick: React.MouseEventHandler<HTMLDivElement> = async (element) => {
        const elm = element.currentTarget;
        const inputElm = <input
            className={elm.className}
            type='text'
            value={textVal}
            onChange={e => setTextVal(e.target.value ?? '')}
            onBlur={inputBlur}
        />;
        setElm(inputElm);
    };

    const inputBlur: React.FocusEventHandler<HTMLInputElement> = async (element) => {
        const elm = element.currentTarget;
        setElm(<div className={className} onClick={textClick}>{elm.value}</div>);
    };

    setElm(<div className={className} onClick={textClick}>{defText}</div>);

    return elm;
};

export default inputToggle;
