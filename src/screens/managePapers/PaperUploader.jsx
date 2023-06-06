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

const subjectList = [
  {
    value: "chemistry",
    label: "Chemistry",
  },
  {
    value: "physics",
    label: "Physics",
  },
];

const paperTypes = [
  {
    value: "UnitTest",
    label: "Unit Test",
  },
  {
    value: "MeritProject",
    label: "Merit Project",
  },
  {
    value: "WeaklyPaper",
    label: "Weakly Paper",
  },
  {
    value: "ReviseSection",
    label: "Revise Section",
  },
  {
    value: "FullPaper",
    label: "Full Paper",
  },
];

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

function PaperUploader() {
  const [file, setFile] = useState(null);
  const [markingFile, setMarkingFile] = useState(null);
  const [progress, setProgress] = useState(0);
  const [markingProgress, setMarkingProgress] = useState(0);
  const [initialValues, setInitialValues] = useState({
    title: "",
    description: "",
    lessonId: "",
    paperType: "",
    subject: "",
  });

  const [link, setLink] = useState("");
  const [markingLink, setMarkingLink] = useState("");
  const navigate = useNavigate();
  const [lessonList, setLessonList] = useState([]);
  const [componentType, setComponentType] = useState("create");
  const [alert, setAlert] = useState({
    showAlert: false,
    message: "",
    severity: "",
  });

  const { type, id } = useParams();

  async function submit(e, { resetForm }) {
    try {
      const payload = {
        paperUrl: link,
        title: e.title,
        description: e.description,
        lessonId: e.lessonId,
        paperType: e.paperType,
        subject: e.subject,
        markingSchemeUrl: markingLink,
      };

      console.log(payload);

      if (componentType === "create") {
        await axios.post("/admin/add-paper", payload);

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
      }

      if (componentType === "edit") {
        await axios.put(`/admin/edit-paper/${id}`, payload);

        setAlert((pre) => ({
          ...pre,
          showAlert: true,
          message: "Successfully Updated",
          severity: "success",
        }));

        setTimeout(() => {
          setAlert((pre) => ({
            ...pre,
            showAlert: false,
          }));
        }, 3000);
      }

      resetForm();

      navigate("/managePaper");
    } catch (e) {
      setAlert((pre) => ({
        ...pre,
        showAlert: true,
        severity: "error",
        message: "Uploading Failed",
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
  };

  const onMarkingFileChange = (files) => {
    const currentFile = files[0];
    setMarkingFile(currentFile);
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
    const fileRef = ref(storage, `paper/${file.name}`);
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

  const uploadMarking = (e, setFieldValue) => {
    e.preventDefault();

    if (markingFile === null) return;
    const fileRef = ref(storage, `paperMarkings/${markingFile.name}`);
    const uploadTask = uploadBytesResumable(fileRef, markingFile);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        let progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log(progress);
        setMarkingProgress(progress);
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
            setMarkingLink(downloadURL);
            setFieldValue("markingSchemeUrl", downloadURL);
          }
        });
      }
    );
  };

  // Fetch Video
  const getPaper = async () => {
    try {
      const { data } = await axios.get(`/admin/get-paper/${id}`);
      //  console.log(data.title);
      if (data) {
        setInitialValues({
          title: data.title,
          description: data.description,
          lessonId: data.lessonId,
          paperType: data.paperType,
          subject: data.subject,
        });
      }

      setLink(data.paperUrl);
      setMarkingLink(data.markingSchemeUrl);
      console.log("initial", initialValues);
    } catch (e) {}
  };

  let uploadFileSchema = Yup.object().shape({
    title: Yup.string().required("Title is required!"),
    description: Yup.string()
      .max(300, "Maximum length is 300")
      .required("Description is required!"),
    paperType: Yup.string().required("Paper Type is required!"),
    lessonId: Yup.string().when("paperType", {
      is: (value) => value !== "FullPaper",
      then: Yup.string().required("Lesson is required!"),
      otherwise: Yup.string(),
    }),
    subject: Yup.string().when("paperType", {
      is: (value) => value !== "FullPaper",
      then: Yup.string().required("Lesson is required!"),
      otherwise: Yup.string(),
    }),
  });

  useEffect(() => {
    getLesson();
  }, []);

  useEffect(() => {
    if (type === "create") {
      setComponentType("create");
    } else if (type === "edit") {
      setComponentType("edit");
      getPaper();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [type]);

  return (
    <div className={styles.box}>
      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <Fab color="secondary" onClick={() => navigate("/managePaper")}>
          <ArrowBackIcon sx={{ mr: 1 }} />
        </Fab>
      </div>
      <Formik
        initialValues={initialValues}
        onSubmit={submit}
        validationSchema={uploadFileSchema}
        enableReinitialize
      >
        {({ dirty, isValid, handleChange, values, setFieldValue }) => {
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

                <FormControl fullWidth sx={{ mb: 2, mt: 2, minWidth: 120 }}>
                  <InputLabel id="demo-simple-select-label">
                    Paper Type
                  </InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={values.paperType}
                    name="paperType"
                    label="Paper Type"
                    onChange={handleChange}
                  >
                    {paperTypes.map((paper) => (
                      <MenuItem value={paper.value} key={paper.value}>
                        {paper.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <FormControl fullWidth sx={{ mb: 2, minWidth: 120 }}>
                  <InputLabel id="demo-simple-select-label">Subject</InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={values.subject}
                    name="subject"
                    label="Subject"
                    disabled={values.paperType === "FullPaper"}
                    onChange={handleChange}
                  >
                    {subjectList.map((subject) => (
                      <MenuItem value={subject.value} key={subject.value}>
                        {subject.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <FormControl fullWidth sx={{ mb: 2, minWidth: 120 }}>
                  <InputLabel id="demo-simple-select-label">Lesson</InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={values.lessonId}
                    name="lessonId"
                    label="Lesson"
                    disabled={values.paperType === "FullPaper"}
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
                  <Typography variant="h10">Upload Paper *</Typography>
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
                    {alert.showAlert && (
                      <Alert severity={alert.severity}>{alert.message}</Alert>
                    )}
                  </div>
                }
              </div>
              {componentType === "edit" && (
                <div style={{ marginTop: 10 }}>
                  <Grid
                    item
                    xs={12}
                    sm={12}
                    md={12}
                    style={{ marginTop: "1.5rem" }}
                  >
                    <Typography variant="h10">Upload Marking *</Typography>
                  </Grid>
                  <DropFileInput
                    onFileChange={(files) => onMarkingFileChange(files)}
                  />
                  <br></br>
                  {markingProgress > 0 && (
                    <Box sx={{ width: "100%" }}>
                      <LinearProgressWithLabel value={markingProgress} />
                    </Box>
                  )}
                  <UploadButton
                    onClick={(e) => uploadMarking(e, setFieldValue)}
                  >
                    {" "}
                  </UploadButton>

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
                <Button
                  type="submit"
                  variant="contained"
                  disabled={link === "" || !isValid || !dirty}
                >
                  {componentType === "create" ? "Create" : "Update"}
                </Button>
              </div>
            </Form>
          );
        }}
      </Formik>
    </div>
  );
}

export default PaperUploader;
