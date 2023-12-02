import React from "react";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  styled,
  Container,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

const CustomAccordion = styled(Accordion)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  color: theme.palette.text.primary,
  margin: "1rem 0",
  "&:not(:last-child)": {},
}));

const CustomAccordionSummary = styled(AccordionSummary)(({ theme }) => ({
  backgroundColor: "#2F2F2F",
  color: theme.palette.secondary.contrastText,
  borderBottom: "5px solid #fff",
  "&:hover": {
    backgroundColor: theme.palette.secondary.dark,
  },
}));

const CustomAccordionDetails = styled(AccordionDetails)(({ theme }) => ({
  backgroundColor: "#2F2F2F",
  color: theme.palette.secondary.contrastText,
  wordSpacing: "0.015rem",
}));

const faqs = [
  {
    question: "What is Canvas Flow?",
    answer:
      "Canvas Flow is an application designed to help students keep track of their school work and manage their assignments efficiently.",
  },
  {
    question: "How do I manage my tasks?",
    answer:
      "You can manage your tasks by navigating to the Assignments section where you can add, view, and delete tasks.",
  },
  {
    question: "How do I edit a task?",
    answer:
      "Click on a task in the Assignments section to open the task details, where you can make changes and save them.",
  },
  {
    question: "Can I set reminders for my tasks?",
    answer:
      "Yes, you can set reminders for each task. When creating or editing a task, simply specify the reminder time.",
  },
  {
    question: "How do I track my task progress?",
    answer:
      "The application provides a progress bar for each task, which you can update as you make progress on your tasks.",
  },
  {
    question: "Is there a calendar view for my tasks?",
    answer:
      "Yes, tasks can be viewed in a calendar format, allowing you to easily see your tasks on a daily, weekly, or monthly basis.",
  },
  {
    question: "Can I categorize my tasks?",
    answer:
      "Absolutely. You can categorize tasks by courses or types, such as assignments, exams, or projects.",
  },
  {
    question: "Is my data private and secure?",
    answer:
      "We prioritize your privacy and security. Your data is securely stored and is not accessible to unauthorized users.",
  },
];

const FAQ = () => {
  return (
    <Container maxWidth="md">
      <Typography variant="h4" align="center" gutterBottom>
        Welcome to Canvas Flow
      </Typography>
      <Typography variant="h6" align="center" gutterBottom>
        We are here to help you get your school work done!
      </Typography>
      {faqs.map((faq, index) => (
        <CustomAccordion key={index}>
          <CustomAccordionSummary
            expandIcon={<ExpandMoreIcon color="info" />}
            aria-controls={`panel${index}a-content`}
            id={`panel${index}a-header`}
          >
            <Typography>{faq.question}</Typography>
          </CustomAccordionSummary>
          <CustomAccordionDetails>
            <Typography>{faq.answer}</Typography>
          </CustomAccordionDetails>
        </CustomAccordion>
      ))}
    </Container>
  );
};

export default FAQ;
