import styles from "./FileUploader.module.css";

import { useEffect, useState } from "react";

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

function AddPrompt() {
  const [initialValues, setInitialValues] = useState({
    title: "",
    description: "",
    inputParams: "",
    prompt: "",
    authorName: "",
    authorId: "",
  });

  const navigate = useNavigate();
  const [alert, setAlert] = useState({
    showAlert: false,
    message: "",
    severity: "",
  });

  const { id } = useParams();

  // Fetch Video
  const getPrompt = async () => {
    try {
      const { data } = await axios.get(`/user/get-promptbyid/${id}`);
      //  console.log(data.title);
      if (data) {
        setInitialValues({
          title: data.title,
          description: data.description,
          inputParams: data.inputParams,
          prompt: data.prompt,
          authorName: data?.author?.userName,
          authorId: data?.author?._id,
        });
      }
    } catch (e) {}
  };

  async function submit(e, { resetForm }) {
    try {
      const payload = {
        title: e.title,
        description: e.description,
        inputParams: e.inputParams,
        prompt: e.prompt,
      };

      await axios.patch(`/admin/update-prompt-by-admin/${id}`, payload);

      resetForm({});

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

        navigate("/prompts");
      }, 2000);
    } catch (e) {
      setAlert((pre) => ({
        ...pre,
        showAlert: true,
        severity: "error",
        message: "Updating Failed",
      }));

      setTimeout(() => {
        setAlert((pre) => ({
          ...pre,
          showAlert: false,
        }));
      }, 3000);
    }
  }

  useEffect(() => {
    if (id) {
      getPrompt();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  let promptSchema = Yup.object().shape({
    title: Yup.string().required("Title is required!"),
    description: Yup.string()
      .max(500, "Maximum length is 500")
      .required("Description is required!"),
    inputParams: Yup.string().required("Input Params is required!"),
    prompt: Yup.string().required("Prompt is required!"),
  });

  return (
    <div className={styles.box}>
      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <Fab color="secondary" onClick={() => navigate("/prompts")}>
          <ArrowBackIcon sx={{ mr: 1 }} />
        </Fab>
      </div>
      <Formik
        initialValues={initialValues}
        onSubmit={submit}
        validationSchema={promptSchema}
        enableReinitialize
      >
        {({ dirty, isValid, values }) => {
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

                <Field
                  name="inputParams"
                  label="Input Params"
                  component={TextField}
                  variant="outlined"
                  multiline={true}
                  margin="dense"
                ></Field>

                <Field
                  name="prompt"
                  label="Prompt"
                  component={TextField}
                  variant="outlined"
                  multiline={true}
                  margin="dense"
                ></Field>

                <Field
                  name="authorName"
                  label="Author Name"
                  disabled
                  component={TextField}
                  variant="outlined"
                  multiline={true}
                  margin="dense"
                ></Field>

                <Field
                  name="authorId"
                  label="Author Id"
                  disabled
                  component={TextField}
                  variant="outlined"
                  multiline={true}
                  margin="dense"
                ></Field>
              </div>
              {
                <div style={{ margin: 5 }}>
                  {alert.showAlert && (
                    <Alert severity={alert.severity}>{alert.message}</Alert>
                  )}
                </div>
              }

              <div>
                <Button
                  type="submit"
                  variant="contained"
                  disabled={!isValid || !dirty}
                >
                  Update
                </Button>
              </div>
            </Form>
          );
        }}
      </Formik>
    </div>
  );
}

export default AddPrompt;
