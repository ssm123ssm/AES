import { Button } from "@nextui-org/button";
import React from "react";

const HtmlDisplayAndDownload = ({ htmlContent }) => {
  const downloadHtmlFile = () => {
    const element = document.createElement("a");
    const file = new Blob([htmlContent], { type: "text/html" });
    element.href = URL.createObjectURL(file);
    element.download = "formatted_output.html";
    document.body.appendChild(element); // Required for this to work in Firefox
    element.click();
  };

  return (
    <div className="max-h-[300px]">
      <div dangerouslySetInnerHTML={{ __html: htmlContent }} className="p-3" />
      <Button
        onClick={downloadHtmlFile}
        className="m-3 mx-auto w-full"
        disabled={htmlContent != ""}
      >
        Download as HTML
      </Button>
    </div>
  );
};

export default HtmlDisplayAndDownload;
