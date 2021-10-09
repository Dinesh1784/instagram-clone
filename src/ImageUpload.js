import { Button, LinearProgress } from "@mui/material";
import React from "react";
import { storage, db } from "./firebase";
import firebase from "firebase/compat";
import "./ImageUpload.css";

const ImageUpload = ({ username }) => {
  const [caption, setCaption] = React.useState("");
  const [image, setImage] = React.useState(null);
  const [progress, setProgress] = React.useState(0);

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };
  const handleUpload = () => {
    const uploadTask = storage.ref(`images/${image.name}`).put(image);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );
        setProgress(progress);
      },
      (err) => {
        console.log(err);
        alert(err.message);
      },
      () => {
        storage
          .ref("images")
          .child(image.name)
          .getDownloadURL()
          .then((url) => {
            db.collection("posts").add({
              timestamp: firebase.firestore.FieldValue.serverTimestamp(),
              caption: caption,
              imageUrl: url,
              username: username,
            });
            setProgress(0);
            setCaption("");
            setImage(null);
          });
      }
    );
  };

  return (
    <div className="imageUpload">
      <LinearProgress
        variant="determinate"
        value={progress}
        sx={{ width: "100%", mb: "10px" }}
      />

      <input
        style={{ padding: "10px", marginBottom: "7px" }}
        type="text"
        placeholder="Enter a caption"
        value={caption}
        onChange={(e) => setCaption(e.target.value)}
      />
      <input type="file" onChange={handleChange} />
      <Button disabled={!image} onClick={handleUpload}>
        upload
      </Button>
    </div>
  );
};

export default ImageUpload;
