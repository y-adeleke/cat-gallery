const categorySelect = document.getElementById("category");
const getButton = document.getElementById("get-button");
const gallery = document.querySelector(".gallery");
const getFavorites = document.getElementById("get-favourites");
const API_URL = "https://api.thecatapi.com";
const API_KEY = "live_geIskxl6SnL5xvErapMnTgF7maNUdWsP7cBHgMcykhdnWbwcH2RjZlNZg1YwGs0z"; // your API key goes here;

////////Helper////////

async function fetchHelper(url, body = "", errorMessage) {
  try {
    let res;
    if (body != "") {
      res = await fetch(url, body);
    } else res = await fetch(url);
    if (!res.ok) throw new Error(errorMessage);
    let result = await res.json();
    return result;
  } catch (error) {}
}
// Add your code here
async function loadCategories() {
  const url = `https://api.thecatapi.com/v1/categories`;
  const categories = await fetchHelper(url, "", "No catgories found!");
  categories.forEach((category) => {
    let option = document.createElement("option");
    option.value = category.id;
    option.innerHTML = category.name;
    categorySelect.appendChild(option);
  });
}
window.addEventListener("load", loadCategories);

/////////////////////////////////////////////////////////////////
async function loadCat() {
  const url = `https://api.thecatapi.com/v1/images/search?limit=9&category_ids=${categorySelect.value}&api_key=${API_KEY}`;
  const data = await fetchHelper(url, "", "something Happened!");
  return data;
}

const handleCatData = async () => {
  const loadCatData = await loadCat();
  gallery.innerHTML = "";
  loadCatData.forEach((cat) => {
    const catDiv = document.createElement("div");
    catDiv.className = "gallery-item";
    catDiv.id = cat.id;
    gallery.appendChild(catDiv);
    const img = document.createElement("img");
    img.id = "f2";
    img.src = cat.url;
    img.alt = cat.url;
    catDiv.appendChild(img);
    /////////Add favorite
    const heart = document.createElement("span");
    heart.classList.add("heart");
    heart.innerHTML = "&#x2764;";
    catDiv.appendChild(heart);
    catDiv.addEventListener("click", addToFavourite);
  });
};
getButton.addEventListener("click", handleCatData);

async function addToFavourite(e) {
  e.currentTarget.classList.toggle("showheart");
  // Add your code here
  const imgId = e.currentTarget.id;
  const url = "https://api.thecatapi.com/v1/favourites";
  const obj = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": API_KEY,
    },
    body: JSON.stringify({
      image_id: imgId,
      sub_id: "my-user-1234",
    }),
  };
  const data = await fetchHelper(url, obj, "something went wrong with saving your favorite!");
  console.log(data);
}

getFavorites.addEventListener("click", async () => {
  const url = "https://api.thecatapi.com/v1/favourites";
  const obj = {
    headers: {
      "Content-Type": "application/json",
      "x-api-key": API_KEY,
    },
  };
  const data = await fetchHelper(url, obj, "something went wrong");
  displayFavHelper(data);
});

const displayFavHelper = (data) => {
  gallery.innerHTML = "";
  data.forEach(async (cat, index) => {
    if (index > 8) return;
    const singleCatUrl = `https://api.thecatapi.com/v1/images/${cat.image_id}`;
    const singleCatObj = {
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        "x-api-key": API_KEY,
      },
    };
    const singleImageDate = await fetchHelper(singleCatUrl, singleCatObj, "something went wrong");
    const catDiv = document.createElement("div");
    catDiv.className = "gallery-item";
    catDiv.id = singleImageDate.id;
    gallery.appendChild(catDiv);
    const img = document.createElement("img");
    img.id = "f2";
    img.src = singleImageDate.url;
    img.alt = singleImageDate.url;
    catDiv.appendChild(img);
  });
};
