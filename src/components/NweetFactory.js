import { dbService, storageService } from "fbase";
import React, { useState, useRef } from "react";
import { v4 as uuid } from "uuid";

const NweetFactory = ({ userObj }) => {
  const [attach, setAttach] = useState("");
  const [nweet, setNweet] = useState("");
  const fileInput = useRef(null);

  const onSubmit = async (e) => {
    e.preventDefault();
    let attachUrl = "";
    if (attach !== "") {
      const attachRef = storageService.ref().child(`${userObj.uid}/${uuid()}`);
      const response = await attachRef.putString(attach, "data_url");
      // TODO : 왜 response가 uploadTaskSnapshot이 아니고 uploadTaskSnapshotCompat인지 알아보기
      attachUrl = await response.ref.getDownloadURL();
    }
    const nweetObj = {
      text: nweet,
      createdAt: Date.now(),
      creatorId: userObj.uid,
      attachUrl,
    };

    await dbService.collection("nweets").add(nweetObj);
    setNweet("");
    setAttach("");
    // input file 초기화
    fileInput.current.value = "";
  };
  const onChange = (e) => {
    const {
      target: { value },
    } = e;

    setNweet(value);
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

  const onClearAttach = () => {
    setAttach("");
    fileInput.current.value = "";
  }

  return (
    <form onSubmit={onSubmit}>
      <input
        type="text"
        placeholder="What's on your mind?"
        maxLength={120}
        value={nweet}
        onChange={onChange}
      />
      <input
        type="file"
        accept="image/*"
        onChange={onFileChange}
        ref={fileInput}
      />
      <input type="submit" value="Nweet" />
      {attach && (
        <div>
          <img src={attach} width="50px" height="50px" alt="Nweet pic" />
          <button onClick={onClearAttach}>Clear</button>
        </div>
      )}
    </form>
  );
};

export default NweetFactory;
