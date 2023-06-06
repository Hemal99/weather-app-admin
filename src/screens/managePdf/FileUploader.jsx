import styles from "./FileUploader.module.css";
import DropFileInput from "../../components/UI/dropFileInput/DropFileInput";
import UploadButton from "../../components/UI/uploadButton/UploadButton";
import { useEffect, useState } from "react";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { storage, db } from "../../config/firebase";
import { doc, setDoc } from "firebase/firestore";
import LinearProgress from "@mui/material/LinearProgress";
import { Box, Grid } from "@material-ui/core";
import Typography from "@mui/material/Typography";
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

function PdfUploader() {
  const [file, setFile] = useState(null);
  const [progress, setProgress] = useState(0);

  const [link, setLink] = useState("");
  const navigate = useNavigate();
  const [lessonList, setLessonList] = useState([]);
  const [alert, setAlert] = useState({
    showAlert: false,
    message: "",
    severity: "",
  });

  async function submit(e, { resetForm }) {
    try {
      const payload = {
        pdfUrl: link,
        title: e.title,
        description: e.description,
        lessonId: e.lessonId,
      };

      await axios.post("/admin/add-pdf", payload);

      resetForm();

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

  // Fetch Lessons

  const getLesson = async () => {
    try {
      const { data } = await axios.get("/admin/get-lessons");
      setLessonList(data);
    } catch (e) {
      console.log(e);
    }
  };

  const onFileChange = (files) => {
    const currentFile = files[0];
    setFile(currentFile);
    console.log(files);
  };

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

  const handleClick = (e) => {
    e.preventDefault();

    if (file === null) return;
    const fileRef = ref(storage, `pdf/${file.name}`);
    const uploadTask = uploadBytesResumable(fileRef, file);

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
            setLink(downloadURL);
          }
        });
      }
    );
  };

  let uploadFileSchema = Yup.object().shape({
    title: Yup.string().required("Title is required!"),
    description: Yup.string()
      .max(300, "Maximum length is 300")
      .required("Description is required!"),
  });

  useEffect(() => {
    getLesson();
  }, []);

  return (
    <div className={styles.box}>
      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <Fab color="secondary" onClick={() => navigate("/managePdf")}>
          <ArrowBackIcon sx={{ mr: 1 }} />
        </Fab>
      </div>
      <Formik
        initialValues={{
          title: "",
          description: "",
        }}
        onSubmit={submit}
        validationSchema={uploadFileSchema}
      >
        {({ dirty, isValid, handleChange, values }) => {
          return (
            <Form>
              <div style={{ display: "flex", flexDirection: "column" }}>
                <Field
                  name="title"
                  label="Title"
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

                <FormControl fullWidth sx={{ mb: 5, minWidth: 120 }}>
                  <InputLabel id="demo-simple-select-label">Lesson</InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={values.lessonId}
                    name="lessonId"
                    label="Lesson"
                    onChange={handleChange}
                  >
                    {lessonList.map((lesson) => (
                      <MenuItem value={lesson._id} key={lesson._id}>
                        {lesson.lessonName}
                      </MenuItem>
                    ))}
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
                  <Typography variant="h10">Upload Pdf *</Typography>
                </Grid>
                <DropFileInput onFileChange={(files) => onFileChange(files)} />
                <br></br>
                {progress > 0 && (
                  <Box sx={{ width: "100%" }}>
                    <LinearProgressWithLabel value={progress} />
                  </Box>
                )}
                <UploadButton onClick={(e) => handleClick(e)}> </UploadButton>

                {
                  <div style={{ margin: 5 }}>
                    {alert.showAlert && <Alert>{alert.message}</Alert>}
                  </div>
                }
              </div>
              <div>
                <Button
                  type="submit"
                  variant="contained"
                  disabled={link === "" || !isValid || !dirty}
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

export default PdfUploader;
