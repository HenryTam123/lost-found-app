import React from "react";
import { Button } from "react-bootstrap";
import { useAuth } from "../context/AuthContext";
import "react-datepicker/dist/react-datepicker.css";
import { Link, useNavigate } from "react-router-dom";
import OriginalForm from "./OriginalForm";

const PostForm = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  return (
    <div style={{ paddingTop: "75px" }}>
      {!!currentUser ? <OriginalForm isUpdateMode={false} /> : <Button onClick={navigate("/login")}>Login</Button>}
    </div>
  );
};

export default PostForm;
