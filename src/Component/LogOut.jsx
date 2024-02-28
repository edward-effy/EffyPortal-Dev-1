import { useMsal } from '@azure/msal-react';

// A custom component that signs out the user when clicked.
const SignOutBtn = () => {
    // Get the MSAL instance from the context.
    const { instance } = useMsal();

    // Function to handle sign out.
    const handleSignOut = () => {
        // Call the logoutRedirect method of the MSAL instance with the necessary scope.
        instance.logoutRedirect({
            scopes: ['user.read']
        });
    }

    // Return a paragraph element that calls the handleSignOut function when clicked.
    return (
        <p onClick={handleSignOut} style={{ marginTop: 0, marginBottom: 0, marginLeft: '10px' }}>Log out</p>
    )
}

// Export the SignOutBtn component.
export default SignOutBtn;