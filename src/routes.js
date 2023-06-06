import MyAccount from "screens/myAccount/MyAccount";
import StudentDetail from "screens/studentDetail/StudentDetail";
import FileUpload from "screens/manageVideo/FileUploader";
import VideoDetail from "screens/manageVideo/VideoList";
import PdfDetails from "screens/managePdf/PdfList";
import PdfUploader from "screens/managePdf/FileUploader";
import LessonList from "screens/manageLessons/LessonList";
import AddLessons from "screens/manageLessons/AddLesson";
import PaperDetail from "screens/managePapers/PaperList";
import PaperUploader from "screens/managePapers/PaperUploader";
import StudyPack from "screens/manageStudyPack/StudyPack";
import StudyPackList from "screens/manageStudyPack/StudyPackList";
import StudentPaymentDetails from "screens/Payment/PaymentDetail";
import StudyPackPayment from "screens/studyPackPayment/StudyPackPayment";

export const routes = [
  {
    name: "MyAccount",
    element: <MyAccount />,
    path: "/myacount",
  },
  {
    name: "StudentDetail",
    element: <StudentDetail />,
    path: "/studentDetail",
  },
  {
    name: "StudentPaymentDetail",
    element: <StudentPaymentDetails />,
    path: "/studentPaymentDetail",
  },
  {
    name: "StudyPackPaymentDetail",
    element: <StudyPackPayment />,
    path: "/studyPackPaymentDetail",
  },

  {
    name: "manageVideo",
    element: <VideoDetail />,
    path: "/manageVideo",
  },

  {
    name: "managePaper",
    element: <PaperDetail />,
    path: "/managePaper",
  },
  {
    name: "addPaper",
    element: <PaperUploader />,
    path: "/addPaper/:type/:id",
  },
  {
    name: "managePdf",
    element: <PdfDetails />,
    path: "/managePdf",
  },

  {
    name: "addStudyPack",
    element: <StudyPack />,
    path: "/addStudyPack",
  },
  {
    name: "manageStudyPack",
    element: <StudyPackList />,
    path: "/manageStudyPack",
  },

  {
    name: "addVideo",
    element: <FileUpload />,
    path: "/addVideo/:type/:id",
  },

  {
    name: "addPdf",
    element: <PdfUploader />,
    path: "/addPdf",
  },
  {
    name: "addLesson",
    element: <AddLessons />,
    path: "/addLesson",
  },
  {
    name: "manageLessons",
    element: <LessonList />,
    path: "/manageLessons",
  },
];
