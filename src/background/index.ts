import debounce from "debounce";

chrome.webNavigation.onHistoryStateUpdated.addListener(
  debounce(function ({
    tabId,
    url,
  }: chrome.webNavigation.WebNavigationTransitionCallbackDetails) {
    const prFilesChangedUrl = new RegExp(
      "^https://github.com/.+/.+/pull/.+/files$"
    );
    const prCommitsUrl = new RegExp(
      "^https://github.com/.+/.+/pull/.+/commits/.+$"
    );
    if (
      url != null &&
      (url.match(prFilesChangedUrl) || url.match(prCommitsUrl))
    ) {
      chrome.scripting.executeScript({
        target: { tabId },
        func: () => {
          const fileLayoutArea = (() => {
            const fileLayoutAreaList =
              document.getElementsByClassName("Layout-main");
            if (fileLayoutAreaList.length === 0) {
              return null;
            }
            return fileLayoutAreaList[0];
          })();
          if (fileLayoutArea == null) {
            return;
          }

          const resizeObserver = new ResizeObserver(() => {
            const fileNameCopy = chrome.runtime.getURL("fileNameCopy.svg");
            const copySucceed = chrome.runtime.getURL("copySucceed.svg");

            const ICON_DEFAULT_COLOR = "var(--fgColor-muted)";
            const ICON_HOVER_COLOR = "var(--fgColor-accent)";
            const ICON_SUCCEED_COLOR =
              "var(--fgColor-success, var(--color-success-fg))";
            const MESSAGE_BG_COLOR =
              "var(--bgColor-emphasis,var(--color-neutral-emphasis-plus))";
            const MESSAGE_TEXT_COLOR =
              "var(--fgColor-onEmphasis, var(--color-fg-on-emphasis))";
            const MESSAGE_TEXT_FONT =
              'var(--text-body-shorthand-small, normal normal 11px/1.5 -apple-system, BlinkMacSystemFont, "Segoe UI", "Noto Sans", Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji")';

            const INIT_FILENAME_ELEMENT_CHILD_NODES_LENGTH = 5;

            const fileInfoList = Array.from(
              document.getElementsByClassName("file-info")
            );
            fileInfoList.forEach((fileInfo) => {
              const fileNameElement = Array.from(
                fileInfo.getElementsByClassName("Truncate")
              )[0];
              if (
                fileNameElement.childNodes.length >
                INIT_FILENAME_ELEMENT_CHILD_NODES_LENGTH
              ) {
                return;
              }

              const fileName = Array.from(
                fileNameElement.getElementsByTagName("a")
              )[0].textContent;
              if (fileName != null) {
                const fileCopyIcon = document.createElement("div");
                fileCopyIcon.style.maskPosition = "center";
                fileCopyIcon.style.maskRepeat = "no-repeat";
                fileCopyIcon.style.maskSize = "contain";
                fileCopyIcon.style.maskImage = `url(${fileNameCopy})`;
                fileCopyIcon.style.width = "16px";
                fileCopyIcon.style.height = "16px";
                fileCopyIcon.style.background = ICON_DEFAULT_COLOR;
                const copySucceedIcon = document.createElement("div");
                copySucceedIcon.style.maskPosition = "center";
                copySucceedIcon.style.maskRepeat = "no-repeat";
                copySucceedIcon.style.maskSize = "contain";
                copySucceedIcon.style.maskImage = `url(${copySucceed})`;
                copySucceedIcon.style.width = "16px";
                copySucceedIcon.style.height = "16px";
                copySucceedIcon.style.display = "none";
                copySucceedIcon.style.background = ICON_SUCCEED_COLOR;
                const copiedMsgP = document.createElement("p");
                copiedMsgP.innerText = "Copied!";
                copiedMsgP.style.color = MESSAGE_TEXT_COLOR;
                copiedMsgP.style.font = MESSAGE_TEXT_FONT;
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
                  fileCopyIcon.style.background = ICON_HOVER_COLOR;
                };
                copyButton.onmouseleave = () => {
                  fileCopyIcon.style.background = ICON_DEFAULT_COLOR;
                };
                copyButton.onclick = () => {
                  navigator.clipboard.writeText(
                    fileName.split("/").slice(-1)[0]
                  );
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
          });

          resizeObserver.observe(fileLayoutArea);
        },
      });
    }
  },
  1000)
);
