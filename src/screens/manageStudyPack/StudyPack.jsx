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
import { TextField as TF } from "formik-material-ui";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";

import { useNavigate } from "react-router-dom";

import Chip from "@mui/material/Chip";
import Autocomplete from "@mui/material/Autocomplete";
import { TextField } from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";

import Stack from "@mui/material/Stack";

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

const PositiveNumberInput = ({
  field,
  form: { touched, errors },
  ...props
}) => (
  <div>
    <input
      style={{
        padding: 10,
        width: "100%",
        marginTop: 5,
        borderRadius: 4,
      }}
      placeholder="Price"
      type="number"
      {...field}
      {...props}
    />
    {touched[field.name] && errors[field.name] && (
      <div className="error">{errors[field.name]}</div>
    )}
  </div>
);

function PaperUploader() {
  const [file, setFile] = useState(null);
  const [progress, setProgress] = useState(0);

  const [link, setLink] = useState("");
  const navigate = useNavigate();
  const [videos, setVideos] = useState([]);
  const [pdf, setPdf] = useState([]);
  const [papers, setPapers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({
    showAlert: false,
    message: "",
    severity: "",
  });

  async function submit(e, { resetForm }) {
    setLoading(true);
    try {
      const videoIds = e?.videoIds?.map((video) => video._id);

      const tutes = e?.tutes?.map((tute) => tute._id);

      const papers = e?.papers?.map((paper) => paper._id);

      const payload = {
        name: e.name,
        description: e.description,
        price: e.price,
        videoIds,
        tutes,
        papers,
        thumbnail: link,
      };

      await axios.post("/admin/add-studyPack", payload);

      setLoading(false);

      resetForm();

      setAlert({
        showAlert: true,
        message: "Successfully Uploaded",
        severity: "success",
      });

      setTimeout(() => {
        setAlert({
          showAlert: false,
          message: "Successfully Uploaded",
          severity: "success",
        });
      }, 3000);

      navigate("/manageStudyPack");
    } catch (e) {
      setAlert({
        showAlert: true,
        message: "Uploading Failed",
        severity: "error",
      });

      setTimeout(() => {
        setAlert({
          showAlert: false,
          message: "Uploading Failed",
          severity: "error",
        });
      }, 3000);
    }
  }

  // Fetch Videos

  const getVideos = async () => {
    try {
      const { data } = await axios.get("/admin/get-videos");
      setVideos(data);
    } catch (e) {
      console.log(e);
    }
  };

  // Fetch Videos

  const getPdf = async () => {
    try {
      const { data } = await axios.get("/admin/get-all-pdf");
      setPdf(data);
    } catch (e) {
      console.log(e);
    }
  };

  // Fetch Paper

  const getPapers = async () => {
    try {
      const { data } = await axios.get("/admin/get-papers");
      setPapers(data);
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
        console.log("successfully updated DB");
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleClick = (e) => {
    e.preventDefault();

    if (file === null) return;
    const fileRef = ref(storage, `StudyPackThumbnail/${file.name}`);
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
    name: Yup.string().required("Name is required!"),
    description: Yup.string()
      .max(300, "Maximum length is 300")
      .required("Description is required!"),

    videoIds: Yup.array().min(1, "At least one Video is required"),
    tutes: Yup.array().min(1, "At least one Tute is required"),
  });

  useEffect(() => {
    getVideos();
    getPdf();
    getPapers();
  }, []);

  return (
    <div className={styles.box}>
      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <Fab color="secondary" onClick={() => navigate("/managePaper")}>
          <ArrowBackIcon sx={{ mr: 1 }} />
        </Fab>
      </div>
      <Formik
        initialValues={{
          name: "",
          description: "",
        }}
        onSubmit={submit}
        validationSchema={uploadFileSchema}
      >
        {({ dirty, isValid, handleChange, values, setFieldValue }) => {
          return (
            <Form>
              <div style={{ display: "flex", flexDirection: "column" }}>
                <Field
                  name="name"
                  label="Name"
                  component={TF}
                  variant="outlined"
                  margin="dense"
                ></Field>

                <Field
                  name="description"
                  label="Description"
                  component={TF}
                  variant="outlined"
                  multiline={true}
                  margin="dense"
                ></Field>
                <Field
                  name="price"
                  label="Price"
                  component={PositiveNumberInput}
                  variant="outlined"
                  multiline={true}
                  margin="dense"
                ></Field>

                <FormControl fullWidth sx={{ mb: 2, mt: 2, minWidth: 120 }}>
                  <InputLabel id="demo-simple-select-label">Subject</InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={values.subject}
                    name="subject"
                    label="Subject"
                    onChange={handleChange}
                  >
                    {subjectList.map((subject) => (
                      <MenuItem value={subject.value} key={subject.value}>
                        {subject.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <Stack spacing={3} sx={{ width: "100%", mt: 2, mb: 2 }}>
                  <Autocomplete
                    multiple
                    id="tags-standard"
                    fullWidth
                    freeSolo
                    options={videos}
                    getOptionLabel={(option) => option?.title}
                    onChange={(event, newValue) => {
                      console.log(newValue);
                      setFieldValue("videoIds", newValue);
                    }}
                    renderTags={(value, getTagProps) =>
                      value.map((option, index) => (
                        <Chip
                          style={{
                            fontFamily: "normal normal normal 14px/17px Roboto",
                            letterSpacing: "0px",
                            background: "#D1D2E9 0% 0% no-repeat padding-box",
                            color: "#583EA7",
                            opacity: 1,
                            borderRadius: 5,

                            flexWrap: "wrap",
                          }}
                          key={index}
                          size="small"
                          label={option?.title}
                          {...getTagProps({ index })}
                        />
                      ))
                    }
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        variant="outlined"
                        label="videos"
                        placeholder="Videos"
                        fullWidth
                      />
                    )}
                  />

                  <Autocomplete
                    multiple
                    id="tags-standard"
                    fullWidth
                    freeSolo
                    options={pdf}
                    getOptionLabel={(option) => option?.title}
                    onChange={(event, newValue) => {
                      console.log(newValue);
                      setFieldValue("tutes", newValue);
                    }}
                    renderTags={(value, getTagProps) =>
                      value.map((option, index) => (
                        <Chip
                          style={{
                            fontFamily: "normal normal normal 14px/17px Roboto",
                            letterSpacing: "0px",
                            background: "#D1D2E9 0% 0% no-repeat padding-box",
                            color: "#583EA7",
                            opacity: 1,
                            borderRadius: 5,

                            flexWrap: "wrap",
                          }}
                          key={index}
                          size="small"
                          label={option?.title}
                          {...getTagProps({ index })}
                        />
                      ))
                    }
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        variant="outlined"
                        label="Tutes"
                        placeholder="Tutes"
                        fullWidth
                      />
                    )}
                  />

                  <Autocomplete
                    multiple
                    id="tags-standard"
                    fullWidth
                    freeSolo
                    options={papers}
                    getOptionLabel={(option) => option?.title}
                    onChange={(event, newValue) => {
                      console.log(newValue);
                      setFieldValue("papers", newValue);
                    }}
                    renderTags={(value, getTagProps) =>
                      value.map((option, index) => (
                        <Chip
                          style={{
                            fontFamily: "normal normal normal 14px/17px Roboto",
                            letterSpacing: "0px",
                            background: "#D1D2E9 0% 0% no-repeat padding-box",
                            color: "#583EA7",
                            opacity: 1,
                            borderRadius: 5,

                            flexWrap: "wrap",
                          }}
                          key={index}
                          size="small"
                          label={option?.title}
                          {...getTagProps({ index })}
                        />
                      ))
                    }
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        variant="outlined"
                        label="Papers"
                        placeholder="Papers"
                        fullWidth
                      />
                    )}
                  />
                </Stack>
              </div>

              <div style={{ marginTop: 10 }}>
                <Grid
                  item
                  xs={12}
                  sm={12}
                  md={12}
                  style={{ marginTop: "1.5rem" }}
                >
                  <Typography variant="h10">Upload Thumbnail *</Typography>
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
              <div>
                <LoadingButton
                  type="submit"
                  variant="contained"
                  loading={loading}
                  disabled={link === "" || !isValid || !dirty}
                >
                  Submit
                </LoadingButton>
              </div>
            </Form>
          );
        }}
      </Formik>
    </div>
  );
}

export default PaperUploader;
