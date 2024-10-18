const modGUI = {
  GUI: { menus: [] },
  createMenu: function (title, id, position, top, left) {
    let menu = { title, id, position, top, left, elements: [] };
    this.GUI.menus.push(menu);
    return menu;
  },
  addButton: function (menu, label, callback) {
    menu.elements.push({ type: "button", label, callback });
  },
  render: function () {
    this.GUI.menus.forEach(menu => {
      let menuDiv = document.createElement("div");
      menuDiv.id = menu.id;
      menuDiv.style.position = menu.position;
      menuDiv.style.top = menu.top;
      menuDiv.style.left = menu.left;
      menuDiv.style.padding = "10px";
      menuDiv.style.backgroundColor = "rgba(204, 0, 102, 0.9)";
      menuDiv.style.color = "#fff";
      menuDiv.style.zIndex = "9999";
      menuDiv.style.borderRadius = "10px";
      menuDiv.style.width = "210px";
      menuDiv.style.display = "none"; // Initially hide the menu

      let titleDiv = document.createElement("div");
      titleDiv.textContent = menu.title;
      titleDiv.style.fontWeight = "bold";
      titleDiv.style.textAlign = "center";
      menuDiv.appendChild(titleDiv);

      menu.elements.forEach(element => {
        let elementDiv = document.createElement("div");
        if (element.type === "button") {
          let buttonDiv = document.createElement("div");
          buttonDiv.className = "modMenuItem";
          buttonDiv.style.cursor = "pointer";
          buttonDiv.style.padding = "10px";
          buttonDiv.style.backgroundColor = "rgba(239, 27, 246, 0.2)";
          buttonDiv.textContent = element.label;
          buttonDiv.addEventListener("click", element.callback);
          elementDiv.appendChild(buttonDiv);
        }
        menuDiv.appendChild(elementDiv);
      });
      document.body.appendChild(menuDiv);
    });
  }
};

const originalFetch = window.fetch;
window.fetch = function (url, options) {
  if (url.includes("logger") || JSON.stringify(options).includes("logger")) {
    return Promise.reject(new Error("DevHaxx AntiLog"));
  }
  return originalFetch.apply(this, arguments);
};

const mainMenu = modGUI.createMenu("DevHaxx", "DevHaxx", "absolute", "20px", "20px");

modGUI.addButton(mainMenu, "Lesson Skipper", () => {
  const html5Iframe = document.getElementById("html5Iframe");
  if (!html5Iframe) {
    alert("Not in a lesson!");
    return;
  }
  let score = prompt("Score?");
  const lessonComponent = html5Iframe.contentWindow.document.getElementById("lesson");
  if (lessonComponent) {
    lessonComponent.return.return.memoizedProps.store.dispatch({
      type: "features/lesson/COMPLETE_LESSON_COMPONENT",
      payload: {
        componentStatusId: html5Iframe.src.split("=")[1].split("&")[0],
        instructionLessonOutcome: { score }
      }
    });
  } else {
    alert("Lesson component not found.");
  }
});

modGUI.render();

// Ensure the menu is displayed/hidden when ShiftRight is pressed
document.addEventListener("keydown", event => {
  if (event.code === "ShiftRight") {
    const menu = document.getElementById(mainMenu.id);
    if (menu) {
      menu.style.display = (menu.style.display === "none" || menu.style.display === "") ? "block" : "none";
    }
  }
});
