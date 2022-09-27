import {
  useMsal,
  AuthenticatedTemplate,
  UnauthenticatedTemplate,
} from '@azure/msal-react';
import { EventType } from '@azure/msal-browser';
import { useState, useEffect } from 'react';

function App() {
  const [currentUser, setCurrentUser] = useState('');
  const [loading, setIsLoading] = useState(true);
  const { instance } = useMsal();

  useEffect(() => {
    const account = JSON.parse(localStorage.getItem('token'))?.account;
    setCurrentUser(account?.name);

    return () => {
      setCurrentUser('');
    };
  }, [typeof window != 'undefined']);

  useEffect(() => {
    if (currentUser !== '' && currentUser !== undefined) {
      setIsLoading(false);
    }

    return () => {
      setIsLoading(true);
    };
  }, [currentUser]);

  return (
    <main>
      <AuthenticatedTemplate>
        {!loading ? (
          <div>
            <p>You are signed in</p>
            <button onClick={SignOut}>Click here to Sign out</button>
          </div>
        ) : (
          <div>
            <p>Loading...</p>
          </div>
        )}
      </AuthenticatedTemplate>
      <UnauthenticatedTemplate>
        <Signin />
      </UnauthenticatedTemplate>
    </main>
  );

  function Signin() {
    const accounts = instance.getAllAccounts();
    if (accounts.length > 0) {
      instance.setActiveAccount(accounts[0]);
    }

    instance.addEventCallback(
      (event) => {
        if (
          event.eventType === EventType.LOGIN_SUCCESS &&
          event.payload.account
        ) {
          const account = event.payload.account;
          instance.setActiveAccount(account);
        }
      },
      (error) => {
        // Error handling
        console.log('error', error);
      }
    );

    instance
      .handleRedirectPromise()
      .then(async (authResult) => {
        // Check if user signed in
        const account = instance.getActiveAccount();
        if (!account) {
          // redirect anonymous user to login page
          // loginPopup() to popup the login instead of redirect
          await instance.loginRedirect();
        } else {
          // To store the user details in localstorage
          localStorage.setItem('token', JSON.stringify(authResult));
          // Update the state from here to rerender the page
          setCurrentUser(authResult?.account?.name);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }

  function SignOut() {
    const logoutRequest = {
      account: instance.getAccountByHomeId(
        JSON.parse(localStorage.getItem('token')).account.homeAccountId
      ),
      postLogoutRedirectUri: '/',
    };
    instance.logoutRedirect(logoutRequest);
    localStorage.clear();
  }
}

export default App;
