document.addEventListener("DOMContentLoaded", function () {
  const listPanel = document.getElementById("list");
  const showPanel = document.getElementById("show-panel");
  const apiUrl = "http://localhost:3000/books";
  const currentUser = { id: 1, username: "pouros" };

  fetch(apiUrl)
    .then((response) => response.json())
    .then((books) => {
      books.forEach((book) => {
        const li = document.createElement("li");
        li.textContent = book.title;
        li.addEventListener("click", () => displayBookDetails(book));
        listPanel.appendChild(li);
      });
    });

  function displayBookDetails(book) {
    showPanel.innerHTML = `
        <img src="${book.img_url}" alt="${book.title}">
        <h2>${book.title}</h2>
        <p>${book.description}</p>
        <h3>Liked by:</h3>
        <ul id="users-list">
          ${book.users.map((user) => `<li>${user.username}</li>`).join("")}
        </ul>
        <button id="like-button">${
          book.users.some((user) => user.id === currentUser.id)
            ? "Unlike"
            : "Like"
        }</button>
      `;
    const likeButton = document.getElementById("like-button");
    likeButton.addEventListener("click", () => toggleLike(book));
  }

  function toggleLike(book) {
    const userIndex = book.users.findIndex(
      (user) => user.id === currentUser.id
    );
    if (userIndex > -1) {
      book.users.splice(userIndex, 1);
    } else {
      book.users.push(currentUser);
    }
    fetch(`${apiUrl}/${book.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ users: book.users }),
    })
      .then((response) => response.json())
      .then((updatedBook) => {
        displayBookDetails(updatedBook);
      });
  }
});
