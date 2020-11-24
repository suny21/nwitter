import { dbService, storageService } from "fbase";
import React, { useState } from "react";

const Nweet = ({ nweetObj, isOwner }) => {
  const [editing, setEditing] = useState(false);
  const [newNweet, setNewNweet] = useState(nweetObj.text);

  const onDeleteClick = async () => {
    const ok = window.confirm("Are you sure you want to delete this nweet?");
    if (ok) {
      await dbService.doc(`nweets/${nweetObj.id}`).delete();
      await storageService.refFromURL(nweetObj.attachUrl).delete();
    }
  };

  const toggleEditing = () => setEditing((prev) => !prev);

  const onSubmit = (e) => {
    e.preventDefault();
    dbService.doc(`nweets/${nweetObj.id}`).update({
        text : newNweet
    });
    setEditing(false);
  };
  const onChange = (e) => {
    const {
      target: { value },
    } = e;
    setNewNweet(value);
  };

  return (
    <div>
      {editing ? (
        <>
          <form onSubmit={onSubmit}>
            <input
              type="text"
              placeholder="Edit your nweet..."
              value={newNweet}
              required
              onChange={onChange}
            />
            <button type="submit">Update Nweet</button>
          </form>
          <button onClick={toggleEditing}>Cancel</button>
        </>
      ) : (
        <>
          <h4>{nweetObj.text}</h4>
          {nweetObj.attachUrl && <img src={nweetObj.attachUrl} width="50px" height="50px" alt="Nweet Img" />}
          {isOwner && (
            <>
              <button onClick={onDeleteClick}>DELETE</button>
              <button onClick={toggleEditing}>EDIT</button>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default Nweet;
