
import React from 'react';
import './WelcomeName.css';
import { useUsername } from './useUsername';

function WelcomeName() {
    // useUsername is a custom hook that returns the capitalized version of the user's name
    const capitalName = useUsername();

    // Return a paragraph element with the className "userName" and the capitalized name as its content
    return (
        <p className="userName">{capitalName}</p>
    );
}

export default WelcomeName;
//
//In this code, we have a functional component called `WelcomeName`. This component uses the `useUsername` custom hook to get the capitalized version of the user's name. The `useUsername` hook is imported from the `./useUsername` module.
//
//The `WelcomeName` component returns a paragraph element with the className "userName" and the capitalized name as its content. This paragraph element will be rendered on the screen, displaying the user's name.
//
//The `WelcomeName.css` file is imported to style the paragraph element. The CSS file is located in the same directory as the `WelcomeName.js` file.
//
//The `useUsername` hook is a