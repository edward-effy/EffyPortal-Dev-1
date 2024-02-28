
import { useMsal } from "@azure/msal-react";
import { useState, useEffect } from "react";

// Custom hook to get the username of the currently logged-in user
export function useUsername() {
    const { instance } = useMsal(); // Get the instance of the MSAL library
    const [username, setUsername] = useState(''); // State to store the username

    // Effect to update the username when the active account changes
    useEffect(() => {
        const currentAccount = instance.getActiveAccount(); // Get the current active account
        if(currentAccount){
            setUsername(currentAccount.username); // Update the username state with the username of the current active account
        }
    }, [instance]); // Run the effect whenever the instance changes

    // Extract the first name from the username by removing everything after the '@' symbol
    const firstName = username.substring(0, username.indexOf("@"));

    // Capitalize the first letter of the first name
    const capName = firstName.charAt(0).toUpperCase() + firstName.slice(1);

    // Return the capitalized first name
    return capName;
}
//
//This custom hook uses the `useMsal` hook from the `@azure/msal-react` library to get the instance of the MSAL library. It then uses the `useState` and `useEffect` hooks from React to manage the state of the username and update it whenever the active account changes.
//
//The hook extracts the first name from the username by removing everything after the '@' symbol. It then capitalizes the first letter of the first name and returns it..</s>