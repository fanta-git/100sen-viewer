import React, { useEffect } from "react";

type Props = {
    className: string,
    getter: JSX.Element[],
    setter: React.Dispatch<React.SetStateAction<JSX.Element[]>>,
    children: string,
    inputboxRef: React.RefObject<HTMLInputElement>,
    key_: number
};

const overwriteArray = (array: JSX.Element[], key: number, value: JSX.Element): JSX.Element[] => {
    const index = array.findIndex(v => v.key == key);
    const copyArray = [...array];
    copyArray[index] = value;
    return copyArray;
}

const InputToggle: React.FC<Props> = (props) => {
    const textClick: React.MouseEventHandler<HTMLDivElement> = async (element) => {
        const thisElm = <input
            key={props.key_}
            className={element.currentTarget.className}
            type='text'
            defaultValue={props.children}
            ref={props.inputboxRef}
            onBlur={inputBlur}
        />;
        props.setter(overwriteArray(props.getter, props.key_, thisElm));
    };

    const inputBlur: React.FocusEventHandler<HTMLInputElement> = async (element) => {
        const elm = element.currentTarget;
        console.log('blur');
        props.setter(props.getter);
        // props.setter(overwriteArray(props.getter, props.key_, thisElm));
    };

    // props.setter(<div className={props.className} onClick={textClick}>{props.children}</div>);

    return <div className={props.className} onClick={textClick}>{props.children}</div>;
};

export default InputToggle;
