const fileInfoList = Array.from(document.getElementsByClassName("file-info"));

fileInfoList.forEach((fileInfo) => {
  const fileNameElement = Array.from(
    fileInfo.getElementsByClassName("Truncate")
  )[0];

  const fileName = Array.from(fileNameElement.getElementsByTagName("a"))[0]
    .textContent;
  if (fileName != null) {
    const fileCopyPath = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "path"
    );
    fileCopyPath.setAttribute(
      "d",
      "M13.78 4.22a.75.75 0 0 1 0 1.06l-7.25 7.25a.75.75 0 0 1-1.06 0L2.22 9.28a.751.751 0 0 1 .018-1.042.751.751 0 0 1 1.042-.018L6 10.94l6.72-6.72a.75.75 0 0 1 1.06 0Z"
    );
    const fileCopySvg = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "svg"
    );
    fileCopySvg.setAttribute("viewBox", "0 0 16 16");
    fileCopySvg.style.fill = "currentColor";
    fileCopySvg.appendChild(fileCopyPath);

    const copySucceedPath = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "path"
    );
    copySucceedPath.setAttribute(
      "d",
      "M13.78 4.22a.75.75 0 0 1 0 1.06l-7.25 7.25a.75.75 0 0 1-1.06 0L2.22 9.28a.751.751 0 0 1 .018-1.042.751.751 0 0 1 1.042-.018L6 10.94l6.72-6.72a.75.75 0 0 1 1.06 0Z"
    );
    const copySucceedSvg = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "svg"
    );
    copySucceedSvg.setAttribute("viewBox", "0 0 16 16");
    copySucceedSvg.style.display = "none";
    copySucceedSvg.style.fill = "#1a7f37";
    copySucceedSvg.appendChild(copySucceedPath);

    const copiedMsgP = document.createElement("p");
    copiedMsgP.innerText = "Copied!";
    copiedMsgP.style.color = "#ffffff";
    copiedMsgP.style.lineHeight = "18px";
    copiedMsgP.style.marginBottom = "0px";

    const copiedMsgDiv = document.createElement("div");
    copiedMsgDiv.style.background = "#25292F";
    copiedMsgDiv.style.padding = "4px 6px";
    copiedMsgDiv.style.position = "absolute";
    copiedMsgDiv.style.top = "100%";
    copiedMsgDiv.style.left = "50%";
    copiedMsgDiv.style.transform = "translateX(-50%)";
    copiedMsgDiv.style.borderRadius = "4px";
    copiedMsgDiv.style.minWidth = "fit-content";

    copiedMsgDiv.style.display = "none";
    copiedMsgDiv.appendChild(copiedMsgP);

    const copyButton = document.createElement("button");
    copyButton.style.width = "16px";
    copyButton.style.height = "16px";
    copyButton.style.border = "none";
    copyButton.style.margin = "0px 8px 0px 0px";
    copyButton.style.padding = "0px";
    copyButton.style.backgroundColor = "inherit";
    copyButton.style.display = "flex";
    copyButton.appendChild(fileCopySvg);
    copyButton.appendChild(copySucceedSvg);
    copyButton.onmouseover = () => {
      fileCopySvg.style.fill = "var(--fgColor-accent)";
    };
    copyButton.onmouseleave = () => {
      fileCopySvg.style.fill = "currentColor";
    };
    copyButton.onclick = () => {
      navigator.clipboard.writeText(fileName.split("/").slice(-1)[0]);
      fileCopySvg.style.display = "none";
      copySucceedSvg.style.display = "block";
      copiedMsgDiv.style.display = "block";

      setTimeout(() => {
        fileCopySvg.style.display = "block";
        copySucceedSvg.style.display = "none";
        copiedMsgDiv.style.display = "none";
      }, 1000);
    };

    const div = document.createElement("div");
    div.style.height = "32px";
    div.style.display = "flex";
    div.style.alignItems = "center";
    div.style.position = "relative";
    div.appendChild(copyButton);
    div.appendChild(copiedMsgDiv);
    fileNameElement.appendChild(div);
  }
});
