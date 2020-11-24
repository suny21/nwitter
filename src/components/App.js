import React,{useState, useEffect} from 'react';
import Router from 'components/Router';
import {authService} from "fbase";

function App() {

  const [init, setInit] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userObj, setUserObj] = useState(null);

  useEffect(() => {
    authService.onAuthStateChanged((user)=>{
      if(user){
        let userName = "Undefined";
        if(user.displayName) userName = user.displayName;
        setIsLoggedIn(true);
        setUserObj({
          displayName : userName,
          uid : user.uid,
          updateProfile : (args) => user.updateProfile(args)
        });
      }else{
        setIsLoggedIn(false);
      }
      setInit(true);
    })
  }, []);

  const refreshUser = () =>{
    const user = authService.currentUser;
    let userName = "Undefined";
    if(user.displayName) userName = user.displayName;

    setUserObj({
      displayName : userName,
      uid : user.uid,
      updateProfile : (args) => user.updateProfile(args)
    });
  };

  return (
    <>
      {init ? <Router refreshUser={refreshUser} isLoggedIn={isLoggedIn} userObj={userObj}/> : "Initializing..."}
    </>
  );
}

export default App;
