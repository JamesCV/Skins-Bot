import React, { useEffect } from 'react';
import { useUserContext } from './UserContext';
import UserComponent from './User';
import SignInWithSteam from './SignInWithSteam';

const AuthenticationComponent = ({ onOpenSettings}) => {
  const { user, setUser } = useUserContext();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch('http://localhost:5001/api/user', {
          credentials: 'include', // This is important for CORS and sessions to work
        });
        if (response.ok) {
          const data = await response.json();
          setUser(data.user);
        } else {
          throw new Error('User not logged in');
        }
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };

    fetchUser();
  }, []);

  if (user) {
    return <UserComponent user={user} onOpenSettings={onOpenSettings} />;
  } else {
    return <SignInWithSteam />;
  }
};

export default AuthenticationComponent;
