import { Flip, ToastContainer } from "react-toastify";
import React from "react";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Button } from "@mui/material";

export const PredeclaredToastContainer = () => {
  return (
    <ToastContainer
      position="bottom-center"
      autoClose={5000}
      hideProgressBar={false}
      newestOnTop
      closeOnClick
      rtl={false}
      // pauseOnFocusLoss
      // draggable
      // pauseOnHover
      theme="light"
      transition={Flip}
    />
  );
};

export function Heading({
  heading,
  backButton,
}: {
  heading: string;
  backButton?: any;
}) {
  return (
    <>
      <div className={"mb-6 flex items-center justify-between"}>
        <p className="text-xl font-medium sm:text-2xl">{heading}</p>
        {backButton ? backButton : ""}
      </div>
    </>
  );
}

export function generateBackButton(link: string) {
  return (
    <Button id="basic-button" aria-haspopup="true" component={"a"} href={link}>
      <ArrowBackIcon className={"text-gray-600"} />
    </Button>
  );
}

export function Forbidden() {
  return (
    <>
      <Heading heading="Forbidden" />
    </>
  );
}
