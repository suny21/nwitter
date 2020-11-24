import { authService, dbService } from "fbase";
import React, { useState } from "react";

const AuthForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [newAccount, setNewAccount] = useState(true);
  const [error, setError] = useState("");

  const unKnownProfile = "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/4gKgSUNDX1BST0ZJTEUAAQEAAAKQbGNtcwQwAABtbnRyUkdCIFhZWiAH4AAGAAcAFAABACNhY3NwQVBQTAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA9tYAAQAAAADTLWxjbXMAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAtkZXNjAAABCAAAADhjcHJ0AAABQAAAAE53dHB0AAABkAAAABRjaGFkAAABpAAAACxyWFlaAAAB0AAAABRiWFlaAAAB5AAAABRnWFlaAAAB+AAAABRyVFJDAAACDAAAACBnVFJDAAACLAAAACBiVFJDAAACTAAAACBjaHJtAAACbAAAACRtbHVjAAAAAAAAAAEAAAAMZW5VUwAAABwAAAAcAHMAUgBHAEIAIABiAHUAaQBsAHQALQBpAG4AAG1sdWMAAAAAAAAAAQAAAAxlblVTAAAAMgAAABwATgBvACAAYwBvAHAAeQByAGkAZwBoAHQALAAgAHUAcwBlACAAZgByAGUAZQBsAHkAAAAAWFlaIAAAAAAAAPbWAAEAAAAA0y1zZjMyAAAAAAABDEoAAAXj///zKgAAB5sAAP2H///7ov///aMAAAPYAADAlFhZWiAAAAAAAABvlAAAOO4AAAOQWFlaIAAAAAAAACSdAAAPgwAAtr5YWVogAAAAAAAAYqUAALeQAAAY3nBhcmEAAAAAAAMAAAACZmYAAPKnAAANWQAAE9AAAApbcGFyYQAAAAAAAwAAAAJmZgAA8qcAAA1ZAAAT0AAACltwYXJhAAAAAAADAAAAAmZmAADypwAADVkAABPQAAAKW2Nocm0AAAAAAAMAAAAAo9cAAFR7AABMzQAAmZoAACZmAAAPXP/bAEMABQMEBAQDBQQEBAUFBQYHDAgHBwcHDwsLCQwRDxISEQ8RERMWHBcTFBoVEREYIRgaHR0fHx8TFyIkIh4kHB4fHv/AAAsIADIAMgEBEQD/xAAbAAEAAgMBAQAAAAAAAAAAAAAABgcCBAUDAf/EADAQAAICAQIDBAkFAQAAAAAAAAECAAMEBREGEiETQWFxByIxUVKBobHBMjQ2Q3Jz/9oACAEBAAA/ALuiIiIiZVI9ti11qWdiFUDvJk70fhbCx6VbNQZN5G55v0r4Ad/mZtZvDulZNRUYqUtt0eocpH4Mgmsafdpuc+Nd126owHRl7jNOInW4QCHiLF7TbbdiPPlO0seJEPSKE3wm6dp64+XSRGInpj22UXpfU3K9bBlPuIlmaLnNqGAmQ2PZQxHVXUgHxHvE27n7OprCrNyjfZRuT5CVrxDqNuo6k9tqNUE9RK2GxUePjOdESX8G6FW1S6jmIG5utKMOgHxH8SXROPxJolWp47WVqqZaj1H+LwPh9pXjqyOyOpVlOxB9oMxnvp2OcrOoxh/bYFPkT1+ktWtFrrVEACqAAB3CfYiV/wAb4ox9baxRst6Cz5+w/b6zhTp8LfyDD/6fgyyh7IiJDPSJ+6xP8P8AcSKz/9k=";

  const onChange = (event) => {
    // event의 target에 들어있는 name과 value 각각을
    // 변수에 담는다
    const {
      target: { name, value },
    } = event;

    if (name === "email") {
      setEmail(value);
    } else if (name === "password") {
      setPassword(value);
    }
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    let retrievedUserC;
    try {
      if (newAccount) {
        //create account
        retrievedUserC = await authService.createUserWithEmailAndPassword(email, password);
      } else {
        // login
        retrievedUserC = await authService.signInWithEmailAndPassword(email, password);
      }
    } catch (error) {
      setError(error.message);
    }

    const retrievedUser = retrievedUserC.user;

    await dbService.collection(`profilePic/`).doc(retrievedUser.uid).set({
      photoURL: unKnownProfile,
      creatorId: retrievedUser.uid,
      updatedAt: Date.now(),
    });
  };

  const toggleAccount = () => {
    setNewAccount((prev) => !prev);
  };

  return (
    <>
      <form onSubmit={onSubmit}>
        <input
          type="text"
          name="email"
          placeholder="Email"
          required
          value={email}
          onChange={onChange}
          onSubmit={onSubmit}
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          required
          value={password}
          onChange={onChange}
          onSubmit={onSubmit}
        />
        <input type="submit" value={newAccount ? "Create Account" : "Log in"} />
      </form>
      {error}
      <span onClick={toggleAccount}>
        {newAccount ? "Log in" : "Create Account"}
      </span>
    </>
  );
};

export default AuthForm;
