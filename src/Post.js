import { Avatar, Button } from "@mui/material";
import React from "react";
import { db } from "./firebase";
import firebase from "firebase/compat";
import "./Post.css";
const Post = ({ postId, user, username, imageUrl, caption, avatar }) => {
  const [comments, setComments] = React.useState([]);
  const [comment, setComment] = React.useState("");

  const postComment = (e) => {
    e.preventDefault();
    db.collection("posts").doc(postId).collection("comments").add({
      text: comment,
      username: user.displayName,
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
    });
    setComment("");
  };

  React.useEffect(() => {
    let unsubscribe;
    if (postId) {
      unsubscribe = db
        .collection("posts")
        .doc(postId)
        .collection("comments")
        .orderBy("timestamp", "desc")
        .onSnapshot((snapshot) => {
          setComments(
            snapshot.docs.map((doc) => ({
              id: doc.id,
              comment: doc.data(),
            }))
          );
        });
    }
    return () => {
      unsubscribe();
    };
  }, [postId]);
  return (
    <div className="post">
      <div className="post_header">
        <Avatar className="post_avatar" alt="robo" src={avatar} />
        <h3>{username}</h3>
      </div>

      <img className="post_image" src={imageUrl} alt="post_image" />
      <h4 className="post_text">
        <strong>{username}</strong>
        {caption}
      </h4>
      <div className="post_comments">
        {comments &&
          comments.map(({ id, comment }) => (
            <p key={id} className="post_text1">
              <strong>{comment.username}</strong> {comment.text}
            </p>
          ))}
      </div>
      <form className="post_commentbox">
        <input
          className="post_input"
          type="text"
          placeholder="Add a comment"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
        <Button
          disabled={!comment}
          className="post_button"
          type="submit"
          onClick={postComment}
        >
          Post
        </Button>
      </form>
    </div>
  );
};

export default Post;
