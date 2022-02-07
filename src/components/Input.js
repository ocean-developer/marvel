import React from 'react';

const Input = ({ placeholder, onChange, disabled}) => {
    return <input onChange={onChange} placeholder={placeholder} disabled={disabled}/>
};

export default Input