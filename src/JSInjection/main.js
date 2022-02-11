/*global chrome*/
/* Changes to current URL's DOM */
import {removefromWiki, wikiRegex} from "./Pages/wiki"
//import {getCurrentURL} from "../popup/functions"

//

//(async () => {
//  let currentURL = await getCurrentURL();})();


chrome.storage.local.get("isProbablyReaderable", function (data) {
  console.log(data);
  if (!data.isProbablyReaderable) {
    alert("This content is not readable");
  } else {
    console.log("YES! This content is readable");
    let dataText;
    chrome.storage.local.get("article", function (data) {
      if (data.article === undefined) {
        console.log("No article is defined");
      } else {
        dataText = data.article;
        const cleanContent = cleanImages(dataText.content);
        const cleanSVG = removeSVG(cleanContent);
        const cleanLinks = removeLinks(cleanSVG);
        let finalClean = cleanLinks
        
        chrome.storage.local.get("tabURL", function (data) {
          if (data.tabURL === undefined) {
            console.log("No tabURL is defined");
          } else {
            const currentURL = data.tabURL
            if(currentURL.match(wikiRegex)){
              finalClean = removefromWiki(cleanLinks)
            }

        let dialogWindow = document.createElement("dialog");
        let dialogContent = document.createElement("div");
        dialogContent.setAttribute("class", "modal-content");

        var xClose = document.createElement("span");
        xClose.setAttribute("id", "qtClose");
        xClose.setAttribute("role", "button");
        xClose.textContent = "X";

        let div = document.createElement("div");
        div.innerHTML = finalClean;
        div.setAttribute("style", `width: 95%`);

        let h1 = document.createElement("h1");
        let headline = document.createTextNode(dataText.title);
        h1.appendChild(headline);

        dialogWindow.setAttribute("id", "myDialog");
        dialogWindow.setAttribute("class", "modal");

        dialogWindow.appendChild(xClose);
        dialogWindow.appendChild(dialogContent);
        dialogContent.appendChild(h1);
        dialogContent.appendChild(div);

        document.body.appendChild(dialogWindow);
        document.getElementById("myDialog").showModal();
        document.body.style.overflow = "hidden";

        let button = document.getElementById("qtClose");
        button.addEventListener("click", function () {
          document.body.style.overflow = "auto";
          document.getElementById("myDialog").close();
        });
      }
      
    });
  }})
  }
});

function removeLinks(content) {
  const div = document.createElement("div");
  div.innerHTML = content;
  var links = div.getElementsByTagName("a");
  while (links.length) {
    var parent = links[0].parentNode;
    while (links[0].firstChild) {
      parent.insertBefore(links[0].firstChild, links[0]);
    }
    parent.removeChild(links[0]);
  }
  content = div.innerHTML;
  return content;
}

/* Event listeners */
document.addEventListener("keydown", function (event) {
  if (event.key === "Escape") {
    document.body.style.overflow = "auto";
  }
});

/* Functions */
function cleanImages(content) {
  const div = document.createElement("div");
  div.innerHTML = content;
  const firstImage = div.getElementsByTagName("img")[0];
  if (firstImage !== undefined) {
    firstImage.setAttribute("id", "zeeguuImage");
    let images = div.getElementsByTagName("img"),
      index;
    for (index = images.length - 1; index >= 0; index--) {
      if (index !== 0) {
        images[index].parentNode.removeChild(images[index]);
      }
    }
    content = div.innerHTML;
  }
  return content;
}

function removeSVG(content) {
  const div = document.createElement("div");
  div.innerHTML = content;
  const allSVG = div.getElementsByTagName("svg");
  if (allSVG !== undefined) {
    let svg = allSVG,
      index;
    for (index = svg.length - 1; index >= 0; index--) {
      svg[index].parentNode.removeChild(svg[index]);
    }
    content = div.innerHTML;
  }
  return content;
}