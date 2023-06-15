import styles from "./FileUploader.module.css";

import { useState } from "react";

import axios from "../../utils/lib/axios";
import Alert from "@mui/material/Alert";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import Fab from "@mui/material/Fab";
// import FormikField from "../formikField/FormikField";
import { TextField } from "formik-material-ui";
import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { Box, Grid, Typography } from "@material-ui/core";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { storage, db } from "../../config/firebase";
import { doc, setDoc } from "firebase/firestore";
import DropFileInput from "components/UI/dropFileInput/DropFileInput";
import UploadButton from "components/UI/uploadButton/UploadButton";
import LinearProgress from "@mui/material/LinearProgress";

function LinearProgressWithLabel(props) {
  return (
    <Box sx={{ display: "flex", alignItems: "center" }}>
      <Box sx={{ width: "100%", mr: 1 }}>
        <LinearProgress variant="determinate" {...props} />
      </Box>
      <Box sx={{ minWidth: 35 }}>
        <Typography variant="body2" color="text.secondary">{`${Math.round(
          props.value
        )}%`}</Typography>
      </Box>
    </Box>
  );
}

function AddLesson() {
  const [subject, setSubject] = useState("");
  const [thumbnailLink, setThumbnailLink] = useState("");
  const [file, setFile] = useState(null);
  const [progress, setProgress] = useState(0);

  const navigate = useNavigate();
  const [alert, setAlert] = useState({
    showAlert: false,
    message: "",
    severity: "",
  });

  const handleChange = (event, setFieldValue) => {
    setSubject(event.target.value);
    setFieldValue("subject", event.target.value);
  };

  const onFileChange = (files) => {
    const currentFile = files[0];
    setFile(currentFile);
    console.log(files);
  };

  async function submit(e, { resetForm }) {
    try {
      const payload = {
        name: e.name,
        description: e.description,
        subject: subject,
        thumbnail: thumbnailLink,
      };

      await axios.post("/admin/create-lesson", payload);

      resetForm({});

      setProgress(0);
      setSubject("");

      setAlert((pre) => ({
        ...pre,
        showAlert: true,
        message: "Successfully Uploaded",
        severity: "success",
      }));

      setTimeout(() => {
        setAlert((pre) => ({
          ...pre,
          showAlert: false,
        }));
      }, 3000);
    } catch (e) {
      setAlert((pre) => ({
        ...pre,
        showAlert: true,
        severity: "error",
        message: "Uplaoding Failed",
      }));

      setTimeout(() => {
        setAlert((pre) => ({
          ...pre,
          showAlert: false,
        }));
      }, 3000);
    }
  }

  const uploadToDatabase = (url) => {
    let docData = {
      mostRecentUploadURL: url,
      username: "s2a",
    };
    const userRef = doc(db, "users", docData.username);
    setDoc(userRef, docData, { merge: true })
      .then(() => {
        console.log("successfully updated DB");
      })
      .catch((error) => {
        setAlert((pre) => ({
          ...pre,
          showAlert: true,
          severity: "error",
          message: "Uplaoding Failed",
        }));

        setTimeout(() => {
          setAlert((pre) => ({
            ...pre,
            showAlert: false,
          }));
        }, 3000);
      });
  };

  const handleThumbnailUpload = (e) => {
    e.preventDefault();
    if (file === null) return;
    const thumbnailRef = ref(storage, `lessonThumbnail/${file.name}`);
    const uploadTask = uploadBytesResumable(thumbnailRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        let progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log(progress);
        setProgress(progress);
      },
      (error) => {
        console.log(error);
      },
      () => {
        console.log("success!!");
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          uploadToDatabase(downloadURL);
          console.log(downloadURL);
          if (downloadURL) {
            setThumbnailLink(downloadURL);
          }
        });
      }
    );
  };

  let lessonSchema = Yup.object().shape({
    name: Yup.string().required("Name is required!"),
    description: Yup.string()
      .max(300, "Maximum length is 300")
      .required("Description is required!"),
    subject: Yup.string().required("Subject is required!"),
  });

  return (
    <div className={styles.box}>
      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <Fab color="secondary" onClick={() => navigate("/manageLessons")}>
          <ArrowBackIcon sx={{ mr: 1 }} />
        </Fab>
      </div>
      <Formik
        initialValues={{
          name: "",
          description: "",
          subject: "",
        }}
        onSubmit={submit}
        validationSchema={lessonSchema}
      >
        {({ dirty, isValid, values, setFieldValue }) => {
          return (
            <Form>
              <div style={{ display: "flex", flexDirection: "column" }}>
                <Field
                  name="name"
                  label="Name"
                  component={TextField}
                  variant="outlined"
                  margin="dense"
                ></Field>

                <Field
                  name="description"
                  label="Description"
                  component={TextField}
                  variant="outlined"
                  multiline={true}
                  margin="dense"
                ></Field>

                <FormControl
                  fullWidth
                  variant="outlined"
                  sx={{ mb: 5, minWidth: 120 }}
                >
                  <InputLabel id="demo-simple-select-helper-label">
                    Subject
                  </InputLabel>
                  <Select
                    labelId="demo-simple-select-helper-label"
                    id="demo-simple-select-helper"
                    name="subject"
                    value={subject}
                    onChange={(e) => handleChange(e, setFieldValue)}
                  >
                    <MenuItem value={"chemistry"}>{"Chemistry"}</MenuItem>
                    <MenuItem value={"physics"}>{"Physics"}</MenuItem>
                  </Select>
                </FormControl>
              </div>

              <div style={{ marginTop: 10 }}>
                <Grid
                  item
                  xs={12}
                  sm={12}
                  md={12}
                  style={{ marginTop: "1.5rem" }}
                >
                  <Typography variant="h10">
                    Upload Lesson Thumbnail *
                  </Typography>
                </Grid>
                <DropFileInput onFileChange={(files) => onFileChange(files)} />
                <br></br>
                {progress > 0 && (
                  <Box sx={{ width: "100%" }}>
                    <LinearProgressWithLabel value={progress} />
                  </Box>
                )}
                <UploadButton onClick={(e) => handleThumbnailUpload(e)}>
                  {" "}
                </UploadButton>

                {
                  <div style={{ margin: 5 }}>
                    {alert.showAlert && <Alert>{alert.message}</Alert>}
                  </div>
                }
              </div>

              {
                <div style={{ margin: 5 }}>
                  {alert.showAlert && <Alert>{alert.message}</Alert>}
                </div>
              }

              <div>
                <Button
                  type="submit"
                  variant="contained"
                  disabled={thumbnailLink === "" || !isValid || !dirty}
                >
                  Submit
                </Button>
              </div>
            </Form>
          );
        }}
      </Formik>
    </div>
  );
}

export default AddLesson;
