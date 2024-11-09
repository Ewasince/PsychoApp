import { Flip, ToastContainer } from "react-toastify";
import React from "react";
import { Link } from "react-router-dom";

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
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end",
        }}
      >
        <p className="mb-6 text-xl font-medium sm:text-2xl">{heading}</p>
        {backButton ? backButton : ""}
      </div>
    </>
  );
}

export function generateBackButton(
  link: string,
  caption?: string,
  onClick?: any,
) {
  caption ??= "Назад";
  return (
    <Link
      className="mb-6 text-lg font-normal text-gray-700 hover:underline sm:text-xl"
      to={link}
      onClick={onClick}
    >
      {caption}
    </Link>
  );
}

export function Forbidden() {
  return (
    <>
      <Heading heading="Forbidden" />
    </>
  );
}
