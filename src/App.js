import React from "react";
import "./App.css";
import Post from "./Post";
import { db, auth } from "./firebase";
import { Modal, Box, Button, TextField } from "@mui/material";
import ImageUpload from "./ImageUpload";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

function App() {
  const [posts, setPosts] = React.useState([]);
  const [open, setOpen] = React.useState(false);
  const [openSignin, setOpenSignin] = React.useState(false);
  const [email, setEmail] = React.useState("");
  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [user, setUser] = React.useState(null);

  React.useEffect(() => {
    const unSubscribe = auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        console.log(authUser);
        setUser(authUser);
      } else {
        setUser(null);
      }
    });
    return () => {
      unSubscribe();
    };
  }, [user, username]);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const handleSigninOpen = () => setOpenSignin(true);
  const handleSigninClose = () => setOpenSignin(false);

  const handleLogin = (e) => {
    e.preventDefault();
    auth
      .signInWithEmailAndPassword(email, password)
      .then(() => {
        setOpenSignin(false);
      })
      .catch((err) => {
        alert(err.message);
      });
  };

  const handleSignUp = (e) => {
    e.preventDefault();
    auth
      .createUserWithEmailAndPassword(email, password)
      .then((authUser) => {
        authUser.user.updateProfile({
          displayName: username,
        });
        setOpen(false);
      })
      .catch((err) => {
        alert(err.message);
      });
  };

  React.useEffect(() => {
    db.collection("posts")
      .orderBy("timestamp", "desc")
      .onSnapshot((snapshot) => {
        setPosts(
          snapshot.docs.map((doc) => ({
            id: doc.id,
            post: doc.data(),
          }))
        );
      });
  }, [posts]);

  return (
    <div className="App">
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <form className="app_signup">
            <center>
              <img
                className="app_headerImage"
                src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
                alt="instagram_logo"
              />
            </center>
            <TextField
              sx={{ my: 2 }}
              placeholder="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <TextField
              sx={{ mb: 2 }}
              placeholder="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <TextField
              sx={{ mb: 2 }}
              placeholder="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button type="submit" onClick={handleSignUp}>
              Sign up
            </Button>
          </form>
        </Box>
      </Modal>
      <Modal
        open={openSignin}
        onClose={handleSigninClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <form className="app_signup">
            <center>
              <img
                className="app_headerImage"
                src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
                alt="instagram_logo"
              />
            </center>
            <TextField
              sx={{ my: 2 }}
              placeholder="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <TextField
              sx={{ mb: 2 }}
              placeholder="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button type="submit" onClick={handleLogin}>
              Sign in
            </Button>
          </form>
        </Box>
      </Modal>
      <div className="app_header">
        <img
          className="app_headerImage"
          src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
          alt="instagram_logo"
        />
        {user ? (
          <Button
            onClick={() => {
              auth.signOut();
            }}
          >
            Logout
          </Button>
        ) : (
          <div className="app_loginContainer">
            <Button onClick={handleSigninOpen}>Signin</Button>
            <Button onClick={handleOpen}>Signup</Button>
          </div>
        )}
      </div>
      <div className="app_posts">
        {posts &&
          posts.map(({ id, post }) => (
            <Post
              key={id}
              postId={id}
              user={user}
              username={post.username}
              imageUrl={post.imageUrl}
              avatar={post.avatar}
              caption={post.caption}
            />
          ))}
      </div>

      <div>
        {user?.displayName ? (
          <ImageUpload username={user.displayName} />
        ) : (
          <h3
            style={{
              width: "100%",
              textAlign: "center",
              padding: "10px",
              border: "1px solid lightgray",
            }}
          >
            Sorry you need to login to share post!
          </h3>
        )}
      </div>
    </div>
  );
}

export default App;

// https://robohash.org/1?set=set2&size=180x180
