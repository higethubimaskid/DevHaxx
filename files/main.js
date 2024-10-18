if (document.getElementById("html5Iframe")) {
  alert("Mova MUST be injected before you open a lesson\nReload the page and reInject!");
  setTimeout(() => {
    window.location.reload();
  }, 2000);
}

const modGUI = {
  GUI: { menus: [] },

  getMenu(f) {
    return document.getElementById(f.id);
  },

  createMenu(title, id, position, top, left) {
    const menu = { title, id, position, top, left, elements: [] };
    this.GUI.menus.push(menu);
    return menu;
  },

  addButton(menu, label, callback) {
    menu.elements.push({ type: "button", label, callback });
  },

  addText(menu, content) {
    menu.elements.push({ type: "text", content });
  },

  showToast(message, color) {
    const toast = document.createElement("div");
    toast.style.cssText = `position: fixed; bottom: -100px; right: 20px; background-color: ${color || "purple"}; color: white; border-radius: 10px; z-index: 9999; transition: bottom 0.5s ease-in-out; max-width: 300px; padding: 10px;`;
    const content = document.createElement("div");
    content.style.cssText = "font-size: 18px; word-wrap: break-word;";
    content.textContent = message;
    toast.appendChild(content);
    document.body.appendChild(toast);
    setTimeout(() => {
      toast.style.bottom = "20px";
    }, 100);
    setTimeout(() => {
      toast.style.bottom = `-${toast.offsetHeight + 20}px`;
      setTimeout(() => {
        document.body.removeChild(toast);
      }, 500);
    }, Math.max(3000, message.length * 50));
  },

  render() {
    this.GUI.menus.forEach(menu => {
      const menuDiv = document.createElement("div");
      menuDiv.id = menu.id;
      menuDiv.style.cssText = `position: ${menu.position}; top: ${menu.top}; left: ${menu.left}; padding: 20px; background-color: rgba(0, 0, 0, 0.7); color: #fff; z-index: 9999; border-radius: 10px; width: 300px;`;

      const header = document.createElement("div");
      header.id = menu.id + "header";
      header.style.fontWeight = "bold";
      header.style.textAlign = "center";
      header.textContent = menu.title;
      menuDiv.appendChild(header);

      menu.elements.forEach(item => {
        const itemDiv = document.createElement("div");
        itemDiv.style.marginBottom = "10px";

        if (item.type === "button") {
          const button = document.createElement("div");
          button.className = "modMenuItem";
          button.style.cssText = "cursor: pointer; padding: 10px; background-color: rgba(255, 255, 255, 0.1);";
          button.textContent = item.label;
          button.onclick = item.callback;
          itemDiv.appendChild(button);
        } else if (item.type === "text") {
          const textNode = document.createElement("div");
          textNode.textContent = item.content;
          itemDiv.appendChild(textNode);
        }

        menuDiv.appendChild(itemDiv);
      });

      document.body.appendChild(menuDiv);
      this.dragElement(menuDiv);
    });
  },

  dragElement(element) {
    let offsetX = 0, offsetY = 0, isDragging = false;
    const header = element.querySelector("#" + element.id + "header");

    header.onmousedown = function(e) {
      isDragging = true;
      offsetX = e.clientX - element.getBoundingClientRect().left;
      offsetY = e.clientY - element.getBoundingClientRect().top;
      document.onmouseup = () => { isDragging = false; document.onmousemove = null; };
      document.onmousemove = (e) => {
        if (isDragging) {
          element.style.left = `${e.clientX - offsetX}px`;
          element.style.top = `${e.clientY - offsetY}px`;
        }
      };
    };
  }
};

// Create the main menu
const mainMenu = modGUI.createMenu("Mova", "MOVA", "absolute", "20px", "20px");

// Add text to the menu
modGUI.addText(mainMenu, "Press Right Shift to hide");
modGUI.addText(mainMenu, "discord.gg/85udaYVQKb");

// Add the Lesson Skipper button
modGUI.addButton(mainMenu, "Lesson Skipper", () => {
  const iframe = document.getElementById("html5Iframe");
  if (!iframe) {
    modGUI.showToast("Not in a lesson!", "red");
    return;
  }

  const lesson = iframe.contentWindow.document.getElementById("lesson");
  if (lesson) {
    const lessonProps = Object.values(lesson)[0].memoizedProps.children[0]._owner.stateNode;
    const api = lessonProps._screenContainerRef._screenControllerViewRef.component.api.navigation;
    const steps = api.getAllSteps();
    const lastStepId = steps[steps.length - 1].id;

    api.goto(lastStepId);
    Object.values(document.getElementById("nav-forward"))[1].onClick();
    modGUI.showToast("Lesson skipped!", "purple");
  } else {
    modGUI.showToast("Lesson component not found.", "red");
  }
});

// Render the menu
modGUI.render();

let isMenuVisible = true;
document.addEventListener("keydown", (event) => {
  if (event.code === "ShiftRight") {
    const menu = document.getElementById(mainMenu.id);
    isMenuVisible = !isMenuVisible;
    menu.style.display = isMenuVisible ? "block" : "none";
  }
});
