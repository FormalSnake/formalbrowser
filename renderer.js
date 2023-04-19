let menu = document.getElementById("toolbarid");
console.log(menu);
let timeoutId;

document.addEventListener("mousemove", (e) => {
  console.log("Mouse moved");
  const y = e.offsetY;
  const menuHeight = menu.offsetHeight;
  const threshold = 100;

  if (menuHeight - y <= threshold) {
    clearTimeout(timeoutId);
    menu.classList.add("visible");
  } else {
    timeoutId = setTimeout(() => {
      menu.classList.remove("visible");
    }, 100);
  }
});
