import debounce from "debounce";

chrome.webNavigation.onHistoryStateUpdated.addListener(
  debounce(function ({
    tabId,
    url,
  }: chrome.webNavigation.WebNavigationTransitionCallbackDetails) {
    const prFilesUrl = new RegExp("^https://github.com/.+/.+/pull/.+/files$");
    if (url != null && url.match(prFilesUrl)) {
      chrome.scripting.executeScript({
        target: { tabId },
        func: () => {
          const fileNameCopy = chrome.runtime.getURL("fileNameCopy.svg");
          const copySucceed = chrome.runtime.getURL("copySucceed.svg");

          const ICON_DEFAULT_COLOR_FILTER =
            "invert(37%) sepia(26%) saturate(252%) hue-rotate(171deg) brightness(94%) contrast(86%)";
          const ICON_HOVER_COLOR_FILTER =
            "invert(28%) sepia(99%) saturate(1789%) hue-rotate(202deg) brightness(86%) contrast(98%)";
          const ICON_SUCCEED_COLOR_FILTER =
            "invert(33%) sepia(80%) saturate(461%) hue-rotate(84deg) brightness(100%) contrast(90%)";
          const MESSAGE_BG_COLOR = "#25292F";
          const MESSAGE_TEXT_COLOR = "#ffffff";

          const fileInfoList = Array.from(
            document.getElementsByClassName("file-info")
          );
          fileInfoList.forEach((fileInfo) => {
            const fileNameElement = Array.from(
              fileInfo.getElementsByClassName("Truncate")
            )[0];
            const fileName = Array.from(
              fileNameElement.getElementsByTagName("a")
            )[0].textContent;
            if (fileName != null) {
              const fileCopyIcon = document.createElement("img");
              fileCopyIcon.src = fileNameCopy;
              fileCopyIcon.style.filter = ICON_DEFAULT_COLOR_FILTER;
              const copySucceedIcon = document.createElement("img");
              copySucceedIcon.src = copySucceed;
              copySucceedIcon.style.display = "none";
              copySucceedIcon.style.filter = ICON_SUCCEED_COLOR_FILTER;
              const copiedMsgP = document.createElement("p");
              copiedMsgP.innerText = "Copied!";
              copiedMsgP.style.color = MESSAGE_TEXT_COLOR;
              copiedMsgP.style.lineHeight = "18px";
              copiedMsgP.style.marginBottom = "0px";
              const copiedMsgDiv = document.createElement("div");
              copiedMsgDiv.style.background = MESSAGE_BG_COLOR;
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
              copyButton.appendChild(fileCopyIcon);
              copyButton.appendChild(copySucceedIcon);
              copyButton.onmouseover = () => {
                fileCopyIcon.style.filter = ICON_HOVER_COLOR_FILTER;
              };
              copyButton.onmouseleave = () => {
                fileCopyIcon.style.filter = ICON_DEFAULT_COLOR_FILTER;
              };
              copyButton.onclick = () => {
                navigator.clipboard.writeText(fileName.split("/").slice(-1)[0]);
                fileCopyIcon.style.display = "none";
                copySucceedIcon.style.display = "block";
                copiedMsgDiv.style.display = "block";
                setTimeout(() => {
                  fileCopyIcon.style.display = "block";
                  copySucceedIcon.style.display = "none";
                  copiedMsgDiv.style.display = "none";
                }, 2000);
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
        },
      });
    }
  },
  3000)
);
