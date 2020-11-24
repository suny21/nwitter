import AuthForm from "components/AuthForm";
import { authService, firebaseInstance, dbService } from "fbase";
import React from "react";

const Auth = () => {
  const onSocialClick = async (e) => {
    const {
      target: { name },
    } = e;
    let provider;
    if (name === "google") {
      provider = new firebaseInstance.auth.GoogleAuthProvider();
    } else if (name === "github") {
      provider = new firebaseInstance.auth.GithubAuthProvider();
    }

    const retrievedUserC = await authService.signInWithPopup(provider);
    const retrievedUser = retrievedUserC.user;

    await dbService.collection(`profilePic/`).doc(retrievedUser.uid).set({
      photoURL: retrievedUser.photoURL,
      creatorId: retrievedUser.uid,
      updatedAt: Date.now(),
    });
  };

  return (
    <>
      <div>
        <AuthForm />
        <div>
          <button onClick={onSocialClick} name="google">
            Continue with Google
          </button>
          <button onClick={onSocialClick} name="github">
            Continue with Github
          </button>
        </div>
      </div>
    </>
  );
};
export default Auth;
