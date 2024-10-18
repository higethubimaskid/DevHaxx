const modGUI = {
  GUI: {
    menus: []
  },
  createMenu(title, id, position, top, left) {
    const menu = {
      title,
      id,
      position,
      top,
      left,
      elements: []
    };
    modGUI.GUI.menus.push(menu);
    return menu;
  },
  addButton(menu, label, callback) {
    const button = {
      type: "button",
      label,
      callback
    };
    menu.elements.push(button);
  },
  addSlider(menu, label, min, max, value, onChange) {
    const slider = {
      type: "slider",
      label,
      min,
      max,
      value,
      onChange
    };
    menu.elements.push(slider);
  },
  addText(menu, content) {
    const text = {
      type: "text",
      content
    };
    menu.elements.push(text);
  },
  createLiveOverlay(title) {
    const overlay = document.createElement("div");
    overlay.id = "overlayDiv";
    overlay.style.position = "fixed";
    overlay.style.top = "0";
    overlay.style.left = "0";
    overlay.style.width = "100%";
    overlay.style.height = "100%";
    overlay.style.backgroundColor = "rgb(39 38 38 / 70%)";
    overlay.style.zIndex = "9998";
    overlay.style.backdropFilter = "blur(5px)";
    
    const overlayHeader = document.createElement("div");
    overlayHeader.id = "overlayHeader";
    overlayHeader.style.color = "white";
    overlayHeader.style.textAlign = "center";
    overlayHeader.style.padding = "10px";
    overlayHeader.style.fontWeight = "bold";
    overlayHeader.style.fontSize = "30px";
    overlayHeader.textContent = title;
    overlay.appendChild(overlayHeader);
    
    document.body.appendChild(overlay);
    return overlay;
  },
  render() {
    modGUI.GUI.menus.forEach(menu => {
      const menuDiv = document.createElement("div");
      menuDiv.id = menu.id;
      menuDiv.style.position = menu.position;
      menuDiv.style.top = menu.top;
      menuDiv.style.left = menu.left;
      menuDiv.style.padding = "20px";
      menuDiv.style.backgroundColor = "rgba(0, 0, 0, 0.7)";
      menuDiv.style.color = "#fff";
      menuDiv.style.fontSize = "15px";
      menuDiv.style.zIndex = "9999";
      menuDiv.style.borderRadius = "10px";
      menuDiv.style.boxShadow = "0px 0px 10px rgba(0, 0, 0, 0.3)";
      menuDiv.style.width = "300px";
      
      const headerDiv = document.createElement("div");
      headerDiv.id = menu.id + "header";
      headerDiv.style.fontWeight = "bold";
      headerDiv.style.textAlign = "center";
      headerDiv.style.fontSize = "25px";
      headerDiv.style.cursor = "move";
      headerDiv.style.padding = "5px";
      headerDiv.textContent = menu.title;
      menuDiv.appendChild(headerDiv);
      
      menu.elements.forEach(element => {
        const elementDiv = document.createElement("div");
        elementDiv.style.marginBottom = "10px";
        
        if (element.type === "button") {
          const buttonDiv = document.createElement("div");
          buttonDiv.className = "modMenuItem";
          buttonDiv.style.cursor = "pointer";
          buttonDiv.style.padding = "10px";
          buttonDiv.style.backgroundColor = "rgba(255, 255, 255, 0.1)";
          buttonDiv.style.borderRadius = "5px";
          buttonDiv.style.transition = "background-color 0.3s ease";
          buttonDiv.textContent = element.label;
          buttonDiv.addEventListener("mouseenter", () => {
            buttonDiv.style.backgroundColor = "rgba(255, 255, 255, 0.2)";
          });
          buttonDiv.addEventListener("mouseleave", () => {
            buttonDiv.style.backgroundColor = "rgba(255, 255, 255, 0.1)";
          });
          buttonDiv.addEventListener("click", element.callback);
          elementDiv.appendChild(buttonDiv);
        } else if (element.type === "slider") {
          const labelDiv = document.createElement("div");
          labelDiv.style.cursor = "move";
          labelDiv.style.padding = "5px";
          labelDiv.textContent = element.label;
          elementDiv.appendChild(labelDiv);
          
          const sliderInput = document.createElement("input");
          sliderInput.type = "range";
          sliderInput.min = element.min;
          sliderInput.max = element.max;
          sliderInput.value = element.value;
          const valueSpan = document.createElement("span");
          valueSpan.textContent = element.value;
          valueSpan.style.float = "right";
          sliderInput.style.width = "100%";
          sliderInput.style.height = "20px";
          sliderInput.style.padding = "0";
          sliderInput.style.margin = "0";
          sliderInput.style.appearance = "none";
          sliderInput.style.background = "transparent";
          sliderInput.style.border = "none";
          sliderInput.style.cursor = "pointer";
          sliderInput.style.borderRadius = "5px";
          sliderInput.style.backgroundColor = "rgba(255, 255, 255, 0.1)";
          sliderInput.style.transition = "background-color 0.3s ease";
          
          sliderInput.addEventListener("input", () => {
            element.onChange(sliderInput.value);
            valueSpan.textContent = sliderInput.value;
          });
          
          elementDiv.appendChild(sliderInput);
          labelDiv.appendChild(valueSpan);
        } else if (element.type === "text") {
          const textDiv = document.createElement("div");
          textDiv.className = "modTextItem";
          textDiv.style.padding = "5px";
          textDiv.style.backgroundColor = "rgba(115 115 115 / 10%)";
          textDiv.style.borderRadius = "5px";
          textDiv.textContent = element.content;
          elementDiv.appendChild(textDiv);
        }
        
        menuDiv.appendChild(elementDiv);
      });
      
      document.body.appendChild(menuDiv);
      modGUI.dragElement(menuDiv);
    });
  },
  dragElement(element) {
    let offsetX = 0;
    let offsetY = 0;
    let mouseX = 0;
    let mouseY = 0;
    
    const header = element.querySelector("#" + element.id + "header");
    
    function mouseDown(event) {
      (event = event || window.event).preventDefault();
      mouseX = event.clientX;
      mouseY = event.clientY;
      document.onmouseup = mouseUp;
      document.onmousemove = mouseMove;
    }
    
    function mouseMove(event) {
      (event = event || window.event).preventDefault();
      offsetX = mouseX - event.clientX;
      offsetY = mouseY - event.clientY;
      mouseX = event.clientX;
      mouseY = event.clientY;
      element.style.top = element.offsetTop - offsetY + "px";
      element.style.left = element.offsetLeft - offsetX + "px";
    }
    
    function mouseUp() {
      document.onmouseup = null;
      document.onmousemove = null;
    }
    
    if (header) {
      header.style.cursor = "move";
      header.onmousedown = mouseDown;
    } else {
      element.style.cursor = "move";
      element.onmousedown = mouseDown;
    }
  }
};

document.getElementById("skip").addEventListener("click", () => {
    let e = prompt("score?");
    if (e !== null) { // Check if the user didn't cancel the prompt
        Object.values(document.querySelector("#main-section"))[0].return.return.memoizedProps.store.dispatch({
            type: "features/lesson/COMPLETE_LESSON_COMPONENT",
            payload: {
                componentStatusId: html5Iframe.src.split("=")[1].split("&")[0],
                instructionLessonOutcome: {
                    score: e
                }
            }
        });
    }
});

// Additional code here...

const mainMenu = modGUI.createMenu("DevHaxx", "devhaxx", "absolute", "20px", "20px");
modGUI.addText(mainMenu, "Press Right Shift to hide");
modGUI.addText(mainMenu, "dariandev.com/discord");
modGUI.addButton(mainMenu, "Skip", () => {
    let e = prompt("score?");
    if (e !== null) { // Check if the user didn't cancel the prompt
        Object.values(document.querySelector("#main-section"))[0].return.return.memoizedProps.store.dispatch({
            type: "features/lesson/COMPLETE_LESSON_COMPONENT",
            payload: {
                componentStatusId: html5Iframe.src.split("=")[1].split("&")[0],
                instructionLessonOutcome: {
                    score: e
                }
            }
        });
    }
});
modGUI.addButton(mainMenu, "Minute Farmer", () => {
    if (!document.getElementById("lesson")) {
        createNotification("Not in a lesson!");
    }
    new URL(html5Iframe.src).searchParams.append("timeoutMode", "count");
    createNotification("Minute Farmer initiated");
});

modGUI.render();
