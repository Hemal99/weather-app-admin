import React, { useState } from "react";
import {
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { login } from "../../store/actions/authActions";
import { connect } from "react-redux";
import Alert from "@material-ui/lab/Alert";
import axios from "../../utils/lib/axios";
import styles from "../../utils/styles/Login.module.css";
import { useNavigate } from "react-router-dom";
import LoginImg from "../../assets/login.jpg";

// validation
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";

// import FormikField from "../formikField/FormikField";
import { TextField } from "formik-material-ui";

const useStyles = makeStyles((theme) => ({
  root: {
    marginTop: theme.spacing(5),
    // height: "100%",
  },
  center: {
    textAlign: "center",
    color: "#35BFFF",
    fontSize: "2em",
    fontWeight: 50,
    lineHeight: "1em",
    marginTop: 0,
    fontFamily: '"Lato",sans-serif',
  },
  padding: {
    padding: theme.spacing(3),
    borderRadius: "10px",
    width: "45vw",
    height: "auto",
    [theme.breakpoints.down("sm")]: {
      width: "70vw",
    },
    [theme.breakpoints.down("xs")]: {
      width: "90vw",
    },
  },

  button: {
    backgroundColor: "#2cca5c",
    color: "white",

    "&:hover": {
      backgroundColor: "#2cca5c",
      color: "white",
    },
  },

  button2: {
    marginTop: "1rem",
    color: "#2cca5c",
  },

  LoginImg: {
    width: "200px",
    objectFit: "cover",
    objectPosition: "center",
    borderRadius: "10px",
  },
}));

let initialValues = {
  email: "",
  password: "",
};

let SignUpSchema = Yup.object().shape({
  email: Yup.string().email().required("Email is required!"),
  password: Yup.string().required("Password is required!"),
});
function Login(props) {
  const classes = useStyles();

  const [alert, setAlert] = useState({
    showAlert: false,
    severity: "success",
    message: "",
  });
  let navigate = useNavigate();

  const submit = async (e) => {
    try {
      const { data } = await axios.post("/admin/login", {
        email: e.email,
        password: e.password,
      });

      const { signature, id } = data;
      props.login(signature, id);

      navigate("/prompts");
    } catch (error) {
      if (error.response.status === 401) {
        setAlert({
          showAlert: true,
          severity: "error",
          message: "Unauthorized!",
        });
      } else if (error.response.status === 501) {
        setAlert({
          showAlert: true,
          severity: "error",
          message:
            "You are temporary block. Please contact your administrator!",
        });
      } else {
        setAlert({
          showAlert: true,
          severity: "error",
          message: "Server error!",
        });
      }
    }
  };

  return (
    <Grid justifyContent="center" alignItems="center" spacing={1} p={1} mt={10}>
      <div className={styles.Wrapper}>
        <div className={styles.Right}>
          <div className={styles.Login}>
            <Grid container spacing={1}>
              <Grid item md={6} xs={12}>
                <img
                  src={LoginImg}
                  alt="login"
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    objectPosition: "center",
                    borderRadius: "10px",
                  }}
                />
              </Grid>
              <Grid
                container
                item
                md={6}
                xs={12}
                justifyContent="center"
                alignContent="center"
                alignItems="center"
              >
                <Card className={classes.padding} variant="outlined">
                  {/* <Typography className={classes.center}>
                  Login to Your Account
                </Typography> */}
                  <h1 className={classes.center}>Login to Your Account</h1>

                  <Formik
                    initialValues={initialValues}
                    onSubmit={submit}
                    validationSchema={SignUpSchema}
                  >
                    {({ dirty, isValid }) => {
                      return (
                        <Form>
                          <CardContent>
                            <Field
                              name="email"
                              label="Email"
                              component={TextField}
                              variant="outlined"
                              fullWidth
                              margin="dense"
                            ></Field>

                            <Field
                              name="password"
                              label="Password"
                              component={TextField}
                              variant="outlined"
                              fullWidth
                              margin="dense"
                              type="password"
                            ></Field>
                          </CardContent>
                          <CardActions>
                            <Grid container justifyContent="center">
                              <Grid item>
                                <Button
                                  variant="contained"
                                  className={classes.button}
                                  disabled={!dirty || !isValid}
                                  type="submit"
                                  size="large"
                                >
                                  login
                                </Button>
                              </Grid>
                            </Grid>
                          </CardActions>
                          {/* <Grid container>
                            <Grid
                              container
                              item
                              xs={12}
                              md={6}
                              className={classes.button2}
                              justifyContent="center"
                            >
                              <Button
                                style={{
                                  color: "#35bfff",
                                  textTransform: "none",
                                }}
                                onClick={() => navigate("/passwordhelp")}
                              >
                                I forgot my password
                              </Button>
                            </Grid>
                            <Grid
                              container
                              item
                              xs={12}
                              md={6}
                              className={classes.button2}
                              justifyContent="center"
                            >
                              <Button
                                style={{
                                  color: "#35bfff",
                                  textTransform: "none",
                                }}
                                onClick={() => navigate("/signup")}
                              >
                                I need an account
                              </Button>
                            </Grid>
                          </Grid> */}
                        </Form>
                      );
                    }}
                  </Formik>
                </Card>
              </Grid>
            </Grid>
            {alert.showAlert && (
              <Grid item md={12} style={{ marginTop: 5 }}>
                <Alert
                  severity={alert.severity}
                  onClose={() =>
                    setAlert({
                      ...alert,
                      showAlert: false,
                    })
                  }
                >
                  {alert.message}
                </Alert>
              </Grid>
            )}
          </div>
        </div>
      </div>
    </Grid>
  );
}

export default connect(null, { login })(Login);
