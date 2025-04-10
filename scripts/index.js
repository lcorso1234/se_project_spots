// Pass settings object to the validation functions that are called in this file
const initialCards = [
  {
    name: "Val Thorens",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/1-photo-by-moritz-feldmann-from-pexels.jpg",
  },
  {
    name: "Restaurant terrace",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/2-photo-by-ceiline-from-pexels.jpg",
  },
  {
    name: "An outdoor cafe",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/3-photo-by-tubanur-dogan-from-pexels.jpg",
  },
  {
    name: "A very long bridge, over the forest and through the trees",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/4-photo-by-maurice-laschet-from-pexels.jpg",
  },
  {
    name: "Tunnel with morning light",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/5-photo-by-van-anh-nguyen-from-pexels.jpg",
  },
  {
    name: "Mountain house",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/6-photo-by-moritz-feldmann-from-pexels.jpg",
  },
];

// Profile elements
const profileEditButton = document.querySelector(".profile__edit-button");
const profileNameElement = document.querySelector(".profile__name");
const profileDescription = document.querySelector(".profile__description");

// Edit profile modal elements
const profileEditModal = document.querySelector("#edit-profile-modal");
const editModalCloseBtn = profileEditModal.querySelector(".modal__close-btn");
const editModalName = profileEditModal.querySelector("#profile-name-input");
const editModalDescription = profileEditModal.querySelector(
  "#profile-name-description"
);
const profileFormElement = profileEditModal.querySelector(".modal__form");

// Add card modal elements
const cardModalBtn = document.querySelector(".profile__add-button");
const cardModal = document.querySelector("#add-card-modal");
const cardModalCloseBtn = cardModal.querySelector(".modal__close-btn");
const cardNameInput = cardModal.querySelector("#add-card-name-input");
const cardLinkInput = cardModal.querySelector("#add-card-link-input");
const cardForm = cardModal.querySelector(".modal__form");

// Preview modal elements (moved outside the function as per feedback)
const previewModal = document.querySelector("#preview-modal");
const previewModalCloseBtn = previewModal.querySelector(
  ".modal__close-btn_type_preview"
);
const previewImageEl = previewModal.querySelector(".modal__image");
const previewModalCaptionEl = previewModal.querySelector(".modal__caption");

// Card list & template
const cardTemplate = document.querySelector("#card-temp");
const cardList = document.querySelector(".cards__list");

// Functions
function getCardElement(data) {
  const cardElement = cardTemplate.content
    .querySelector(".card")
    .cloneNode(true);
  const cardDeleteButton = cardElement.querySelector(".card__delete-button");
  const cardNameEl = cardElement.querySelector(".card__title");
  const cardImageEl = cardElement.querySelector(".card__image");
  const cardLikeBtn = cardElement.querySelector(".card__like-button");

  cardNameEl.textContent = data.name;
  cardImageEl.src = data.link;
  cardImageEl.alt = data.name;

  cardDeleteButton.addEventListener("click", () => {
    cardElement.remove();
  });

  cardLikeBtn.addEventListener("click", () => {
    cardLikeBtn.classList.toggle("card__like-button_liked");
  });

  cardImageEl.addEventListener("click", () => {
    openModal(previewModal);
    previewImageEl.src = data.link;
    previewImageEl.alt = data.name;
    previewModalCaptionEl.textContent = data.name;
  });

  return cardElement;
}

function openModal(modal) {
  modal.classList.add("modal_opened");
  document.addEventListener("keydown", handleEscapeKey);
}

function closeModal(modal) {
  modal.classList.remove("modal_opened");
  document.removeEventListener("keydown", handleEscapeKey);
}

// Event handlers
function handleProfileFormEdit(evt) {
  evt.preventDefault();
  profileNameElement.textContent = editModalName.value;
  profileDescription.textContent = editModalDescription.value;

  const inputList = formEl.querySelectorAll("input");

  closeModal(profileEditModal);
}

function handleCardSubmit(evt) {
  evt.preventDefault();

  const cardElement = getCardElement({
    name: cardNameInput.value,
    link: cardLinkInput.value,
  });
  cardList.prepend(cardElement);
  closeModal(cardModal);
  cardForm.reset();

  const inputList = formEl.querySelectorAll("input");
  disableButton(evt.submitter, settings);
}

function handleEscapeKey(evt) {
  if (evt.key === "Escape") {
    const openedModal = document.querySelector(".modal_opened");
    if (openedModal) {
      closeModal(openedModal);
    }
  }
}

// Event listeners
profileEditButton.addEventListener("click", () => {
  editModalName.value = profileNameElement.textContent;
  editModalDescription.value = profileDescription.textContent;
  resetValidation(
    profileFormElement,
    [editModalName, editModalDescription],
    settings
  );
  openModal(profileEditModal);
});
// profileEditModal.addEventListener("click", (evt) => {
//   if (evt.target.classList.contains("modal")) {
//     closeModal(profileEditModal);
//   }
// });

// previewModal.addEventListener("click", (evt) => {
//   if (evt.target.classList.contains("modal")) {
//     closeModal(previewModal);
//   }
// });

// cardModal.addEventListener("click", (evt) => {
//   if (evt.target.classList.contains("modal")) {
//     closeModal(cardModal);
//   }
// });
document.querySelectorAll(".modal").forEach((modal) => {
  modal.addEventListener("click", (evt) => {
    if (evt.target.classList.contains("modal")) {
      closeModal(modal);
    }
  });
});

editModalCloseBtn.addEventListener("click", () => closeModal(profileEditModal));
cardModalBtn.addEventListener("click", () => openModal(cardModal));
cardModalCloseBtn.addEventListener("click", () => closeModal(cardModal));
previewModalCloseBtn.addEventListener("click", () => closeModal(previewModal));

profileFormElement.addEventListener("submit", handleProfileFormEdit);
cardForm.addEventListener("submit", handleCardSubmit);

// Initial cards rendering
initialCards.forEach((item) => {
  const cardElement = getCardElement(item);
  cardList.prepend(cardElement);
});
