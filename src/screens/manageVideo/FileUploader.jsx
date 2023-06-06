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
import { useNavigate, useParams } from "react-router-dom";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import LoadingButton from "@mui/lab/LoadingButton";

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

function FileUploader() {
  const [file, setFile] = useState(null);
  const [thumbnail, setThumbnail] = useState(null);
  const [errFile, setErrFile] = useState("");
  const [progress, setProgress] = useState(0);
  const [link, setLink] = useState("");
  const [thumbnailLink, setThumbnailLink] = useState("");
  const [lessonList, setLessonList] = useState([]);
  const [componentType, setComponentType] = useState("create");
  const [initialValues, setInitialValues] = useState({
    title: "",
    description: "",
    lessonId: "",
    thumbnailLink: "",
  });
  const [thumbnailLoading, setThumbnailLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  // const [lesson, setLesson] = useState("");
  const navigate = useNavigate();
  const [alert, setAlert] = useState({
    showAlert: false,
    message: "",
    severity: "",
  });

  const { type, id } = useParams();

  async function submit(e, { resetForm }) {
    try {
      setLoading(true);
      const payload = {
        videoUrl: link,
        title: e.title,
        description: e.description,
        lessonId: e.lessonId,
        limit: 5,
        thumbnail: thumbnailLink,
      };

      if (componentType === "create") {
        await axios.post("/admin/add-video", payload);
        setAlert({
          showAlert: true,
          message: "Successfully Uploaded",
          severity: "success",
        });

        setTimeout(() => {
          setAlert({
            showAlert: false,
            message: "",
            severity: "",
          });
        }, 3000);
        setLoading(false);
      }

      if (componentType === "edit") {
        await axios.put(`/admin/edit-video/${id}`, payload);
        setLoading(false);
        setAlert({
          showAlert: true,
          message: "Successfully Updated",
          severity: "success",
        });

        setTimeout(() => {
          setAlert({
            showAlert: false,
            message: "",
            severity: "",
          });
        }, 3000);
      }

      resetForm({});

      navigate("/manageVideo");

      setProgress(0);
    } catch (e) {
      setLoading(false);
      setAlert({
        showAlert: true,
        message: "Upload Failed",
        severity: "error",
      });

      setTimeout(() => {
        setAlert({
          showAlert: false,
          message: "",
          severity: "",
        });
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
  };

  const uploadToDatabase = (url) => {
    let docData = {
      mostRecentUploadURL: url,
      username: "s2a",
    };
    const userRef = doc(db, "users", docData.username);
    setDoc(userRef, docData, { merge: true })
      .then(() => {
        setAlert((pre) => ({
          ...pre,
          showAlert: true,
          severity: "success",
          message: "Successfully Uploaded",
        }));
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleClick = (e) => {
    e.preventDefault();
    handleThumbnailUpload();

    if (file === null) return;
    const fileRef = ref(storage, `videos/${file.name}`);
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
        setErrFile(error);
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

  // upload thumbnail

  const handleThumbnailUpload = (setFieldValue) => {
    console.log("hello");
    if (file === null && componentType === "create") return;
    const thumbnailRef = ref(storage, `videoThumbnail/${thumbnail.name}`);
    const uploadTask = uploadBytesResumable(thumbnailRef, thumbnail);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        let progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log(progress);
      },
      (error) => {
        console.log(error);
        setErrFile(error);
      },
      () => {
        console.log("success!!");
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          uploadToDatabase(downloadURL);
          console.log(downloadURL);
          if (downloadURL) {
            setThumbnailLink(downloadURL);
            setFieldValue("thumbnailLink", downloadURL);
            setThumbnailLoading(false);
          }
        });
      }
    );
  };

  // Fetch Video
  const getVideo = async () => {
    try {
      const { data } = await axios.get(`/admin/get-video/${id}`);
      //  console.log(data.title);
      if (data) {
        setInitialValues({
          title: data.title,
          description: data.description,
          lessonId: data.lessonId,
        });
      }

      setThumbnailLink(data.thumbnail);
      setLink(data.videoUrl);
      console.log("initial", initialValues);
    } catch (e) {}
  };

  const uploadThumbnail = (setFieldValue) => {
    setThumbnailLoading(true);
    if (thumbnail && componentType === "edit") {
      handleThumbnailUpload(setFieldValue);
    }
  };

  let uploadFileSchema = Yup.object().shape({
    title: Yup.string().required("Title is required!"),
    description: Yup.string()
      .max(300, "Maximum length is 300")
      .required("Description is required!"),
    lessonId: Yup.string().required("Lesson Id is required!"),
  });

  useEffect(() => {
    getLesson();
  }, []);

  useEffect(() => {
    if (type === "create") {
      setComponentType("create");
    } else if (type === "edit") {
      setComponentType("edit");
      getVideo();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [type]);

  return (
    <div className={styles.box}>
      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <Fab color="secondary" onClick={() => navigate("/manageVideo")}>
          <ArrowBackIcon sx={{ mr: 1 }} />
        </Fab>
      </div>
      <Formik
        initialValues={initialValues}
        onSubmit={submit}
        validationSchema={uploadFileSchema}
        enableReinitialize
      >
        {({ dirty, isValid, setFieldValue, values, handleChange }) => {
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
              <Grid container spacing={2} mt={10}>
                <Grid
                  item
                  xs={12}
                  sm={12}
                  md={12}
                  style={{ marginTop: "2rem" }}
                >
                  <Typography variant="h10">Add Thumbnail *</Typography>
                </Grid>
                <Grid item xs={12} sm={12} md={12}>
                  <label htmlFor="btn-upload">
                    <input
                      id="btn-upload"
                      name="btn-upload"
                      style={{ display: "none" }}
                      type="file"
                      onChange={(e) => setThumbnail(e.target.files[0])}
                    />
                    <Button
                      className="btn-choose"
                      variant="outlined"
                      component="span"
                    >
                      Add Thumbnail *
                    </Button>
                  </label>
                  {componentType === "edit" && (
                    <LoadingButton
                      loading={thumbnailLoading}
                      component="span"
                      style={{ marginLeft: "10px" }}
                      onClick={() => uploadThumbnail(setFieldValue)}
                      variant="contained"
                    >
                      Upload Thumbnail
                    </LoadingButton>
                  )}

                  <div
                    style={{
                      color: "red",
                      textAlign: "left",
                      fontSize: "12px",
                    }}
                  >
                    {errFile}
                  </div>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="h10">
                    <div style={{ color: "blue", fontSize: "16px" }}>
                      {thumbnail && thumbnail.name}
                    </div>
                  </Typography>
                </Grid>
                {thumbnailLink && (
                  <Grid item xs={12} sm={12}>
                    <img
                      style={{ width: "200px" }}
                      src={thumbnailLink}
                      alt="thumbnail"
                    />
                  </Grid>
                )}
              </Grid>
              {componentType === "create" && (
                <div style={{ marginTop: 10 }}>
                  <Grid
                    item
                    xs={12}
                    sm={12}
                    md={12}
                    style={{ marginTop: "1.5rem" }}
                  >
                    <Typography variant="h10">Upload Video *</Typography>
                  </Grid>
                  <DropFileInput
                    onFileChange={(files) => onFileChange(files)}
                  />
                  <br></br>
                  {progress > 0 && (
                    <Box sx={{ width: "100%" }}>
                      <LinearProgressWithLabel value={progress} />
                    </Box>
                  )}
                  <UploadButton onClick={(e) => handleClick(e)}> </UploadButton>

                  {
                    <div style={{ margin: 5 }}>
                      {alert.showAlert && (
                        <Alert severity={alert.severity}>{alert.message}</Alert>
                      )}
                    </div>
                  }
                </div>
              )}

              <div>
                <LoadingButton
                  loading={loading}
                  type="submit"
                  variant="contained"
                  disabled={link === "" || !isValid || !dirty}
                >
                  {componentType === "create" ? "Create" : "Update"}
                </LoadingButton>
              </div>
            </Form>
          );
        }}
      </Formik>
    </div>
  );
}

export default FileUploader;
