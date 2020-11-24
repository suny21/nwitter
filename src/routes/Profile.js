import { authService, dbService, storageService } from "fbase";
import React, { useEffect, useState, useRef } from "react";
import { useHistory } from "react-router-dom";

const Profile = ({ userObj, refreshUser }) => {
  const history = useHistory();
  const fileInput = useRef(null);
  const [newDisplayName, setNewDisplayName] = useState(userObj.displayName);
  const [userProfilePic, setUserProfilePic] = useState("");
  const [attach, setAttach] = useState("");
  //   const [userProfileURL, setUserProfileURL]= useState(dbService)

  const onLogOutClick = () => {
    authService.signOut();
    // 로그아웃된 뒤 메인 화면으로 돌아가도록
    history.push("/");
  };

  const getMyNweets = async () => {
    // where 은 필터 역할
    // 파라미터 1 : 조건이 될 칼럼
    // 파라미터 2  : 비교연산자
    // 파라미터 3 : 비교할 값
    const nweets = await dbService
      .collection("nweets")
      .where("creatorId", "==", userObj.uid)
      .orderBy("createdAt", "desc")
      .get();
    // console.log(nweets.docs.map((doc) => doc.data()));
  };

  const getUserProfilePic = async () => {
    const doc = await (await dbService.doc(`profilePic/${userObj.uid}`).get()).data();

    if (doc !== undefined) {
      const retrievedURL = await doc.photoURL;
      setUserProfilePic(retrievedURL);
    }
  };

  useEffect(() => {
    getMyNweets();
    getUserProfilePic();
    dbService
      .collection(`profilePic/`)
      .doc(userObj.uid)
      .onSnapshot((snapshot) => {
        setUserProfilePic(snapshot.get("photoURL"));
      });
  }, []);

  const onSubmit = async (e) => {
    e.preventDefault();

    let attachURL = "";

    if (userObj.displayName !== newDisplayName) {
      await userObj.updateProfile({
        displayName: newDisplayName,
      });

      refreshUser();
    }

    if (attach !== "" && userProfilePic !== "" && userProfilePic !== attach) {
      const attachRef = await storageService
        .ref()
        .child(`${userObj.uid}/profilePic`);
      const response = await attachRef.putString(attach, "data_url");
      attachURL = await response.ref.getDownloadURL();

      await dbService.doc(`profilePic/${userObj.uid}`).update({
        photoURL: attachURL,
      });
    }

    // input file 초기화
    fileInput.current.value = "";
    setAttach("");
  };

  const onChange = (e) => {
    const {
      target: { value },
    } = e;
    setNewDisplayName(value);
  };

  const onClearAttach = () => {
    // input file 초기화
    fileInput.current.value = "";
    setAttach("");
  };

  const onFileChange = (e) => {
    const {
      target: { files },
    } = e;
    const theFile = files[0];
    const reader = new FileReader();

    reader.onloadend = (finishedEvent) => {
      const {
        currentTarget: { result },
      } = finishedEvent;
      setAttach(result);
    };
    reader.readAsDataURL(theFile);
  };

  return (
    <>
    {
      userProfilePic && 
      <img
        src={userProfilePic}
        width="50px"
        height="50px"
        alt="User's Profile pic"
      />
    }
      <form onSubmit={onSubmit}>
        <input
          type="text"
          placeholder="Display Name"
          value={newDisplayName}
          onChange={onChange}
        />
        <input
          type="file"
          accept="image/*"
          onChange={onFileChange}
          ref={fileInput}
        />
        <input type="submit" value="Update Profile" />
        {attach && (
          <div>
            <img
              src={attach}
              width="50px"
              height="50px"
              alt="New Profile pic"
            />
            <button onClick={onClearAttach}>Clear</button>
          </div>
        )}
      </form>
      <button onClick={onLogOutClick}>Log out</button>
    </>
  );
};
export default Profile;
