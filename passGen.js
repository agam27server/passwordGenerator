const inputSlider = document.querySelector("[data-lengthSlider]");
const lengthDisplay = document.querySelector("[data-length-number]");
const passwordDisplay = document.querySelector("[data-password-display]");
const copybtn = document.querySelector("[data-copy]");
const copymsg = document.querySelector("[data-CopyMsg]");
const upperCaseCheck = document.querySelector("#uppercase");
const lowerCaseCheck = document.querySelector("#lowercase");
const symbolsCheck = document.querySelector("#symbols");
const numbersCheck = document.querySelector("#numbers");
const indicator = document.querySelector("[data-indicator]");
const generateBtn = document.querySelector(".generate-button");
const allCheckbox = document.querySelectorAll("input[type=checkbox]");
let password = "";
let passwordLength = 10;
let checkCount = 0;

setIndicator("#CCC");

// set password length
function handleSlider() {
  inputSlider.value = passwordLength;
  lengthDisplay.innerText = passwordLength;

  const min = inputSlider.min;
  const max = inputSlider.max;
  inputSlider.style.backgroundSize =
    ((passwordLength - min) * 100) / (max - min) + "% 100%";
}

function setIndicator(color) {
  indicator.style.backgroundColor = color;
  // set shadow here
  indicator.style.boxShadow = `0px 0px 10px ${color}`;
}

function getRndInterger(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

function generateRndNumber() {
  return getRndInterger(0, 9);
}

function generateLowerCase() {
  return String.fromCharCode(getRndInterger(97, 123));
}

function generateUpperCase() {
  return String.fromCharCode(getRndInterger(65, 91));
}

function generateSymbol() {
  const symbols = "!@#$%^&*()_+-=[]{}|;:',.<>/?";
  const randNum = getRndInterger(0, symbols.length);
  return symbols.charAt(randNum);
}

function calcStrength() {
  let hasUpper = false;
  let hasLower = false;
  let hasNum = false;
  let hasSym = false;

  if (upperCaseCheck.checked) hasUpper = true;
  if (lowerCaseCheck.checked) hasLower = true;
  if (numbersCheck.checked) hasNum = true;
  if (symbolsCheck.checked) hasSym = true;

  if (hasUpper && hasLower && (hasNum || hasSym) && passwordLength >= 8) {
    setIndicator("safe");
  } else if (
    (hasLower || hasUpper) &&
    (hasNum || hasSym) &&
    passwordLength >= 6
  ) {
    setIndicator("rgb(144, 238, 4)");
  } else if (
    hasLower && hasUpper &&
    hasNum && hasSym &&
    passwordLength >= 6
  ) {
    setIndicator("rgb(144, 238, 4)");
  } else {
    setIndicator("red");
  }
}

//function to copy content
async function copyContent() {
  try {
    await navigator.clipboard.writeText(passwordDisplay.value); //we have used await here because we don't want to move to further statement until this promise completedy
    setTimeout(() => {
      copymsg.style.transform = "scale(1)";
      copymsg.style.opacity = "1";

      copymsg.innerText = "Copied!";
    }, 100);
    setTimeout(() => {
      copymsg.style.transform = "scale(0)";
    }, 1500);
  } catch (e) {
    copymsg.innerText = "copy failed!";
  }

  //to make copy wala span visible
  copymsg.classList.add("active");

  setTimeout(() => {
    copymsg.classList.remove("active");
  }, 2000);
}

function shufflePasword(array) {
  // Fisher-Yates shuffle method
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }

  return array.join("");
}

function handleCheckBoxChange() {
  checkCount = 0;
  allCheckbox.forEach((checkbox) => {
    if (checkbox.checked) {
      checkCount++;
    }
  });

  // special condition
  if (passwordLength < checkCount) {
    passwordLength = checkCount;
    handleSlider();
  }
}

allCheckbox.forEach((checkbox) => {
  checkbox.addEventListener("change", handleCheckBoxChange);
});

inputSlider.addEventListener("input", (e) => {
  passwordLength = e.target.value;
  handleSlider();
});

// when passwordDisplay contains something on then copy content fuction is called
copybtn.addEventListener("click", () => {
  if (passwordDisplay.value) {
    copyContent();
  }
});

generateBtn.addEventListener("click", () => {
  //none of the box is selected
  if (checkCount == 0) {
    return;
  }

  if (passwordLength < checkCount) {
    passwordLength = checkCount;
    handleSlider();
  }

  // let start the journey to find password
  password = "";
  // let's put the stuff mentioned by checkboxes
  // if(upperCaseCheck.checked){
  //     password += generateUpperCase();
  // }
  // if(lowerCaseCheckCaseCheck.checked){
  //     password += generateLowerCase();
  // }
  // if(numbersCheckCheck.checked){
  //     password += generateRndNumber();
  // }
  // if(symbolsCheckCheck.checked){
  //     password += generateSymbol();
  // }

  let functionArr = [];
  if (upperCaseCheck.checked) {
    functionArr.push(generateUpperCase);
  }
  if (lowerCaseCheck.checked) {
    functionArr.push(generateLowerCase);
  }
  if (numbersCheck.checked) {
    functionArr.push(generateRndNumber);
  }
  if (symbolsCheck.checked) {
    functionArr.push(generateSymbol);
  }
  if (functionArr.length === 0) {
    console.error("No character types selected.");
    return; // Prevent further execution
  }
  // compulsary addtion
  for (let i = 0; i < functionArr.length; i++) {
    password += functionArr[i](); //is function call
    console.log("compulsary add");
  }

  // remaininig addition
  for (let i = 0; i < passwordLength - functionArr.length; i++) {
    let rndIndex = getRndInterger(0, functionArr.length);
    console.log("random index");
    password += functionArr[rndIndex]();
  }

  // shuffle password
  password = shufflePasword(Array.from(password));

  // update in UI
  passwordDisplay.value = password;
  calcStrength();
});
