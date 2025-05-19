import {
  settings,
  enableValidation,
  resetValidation,
} from "../scripts/validation.js";

import "./index.css";
import Api from "../utils/Api.js";
import { setButtonText } from "../utils/helpers.js";

// Profile elements
const profileEditButton = document.querySelector(".profile__edit-button");
const profileNameElement = document.querySelector(".profile__name");
const profileDescriptionElement = document.querySelector(
  ".profile__description"
);
const profileAvatarElement = document.querySelector(".profile__avatar");

// Delete Modal
const deleteModal = document.querySelector("#delete-modal");
const deleteForm = deleteModal.querySelector(".modal__form");
const cancelSubmit = deleteModal.querySelector(".modal__submit-btn-sec");
const cancelDeleteModal = deleteModal.querySelector(".modal__close-btn-delete");

// Edit Profile Modal
const profileEditModal = document.querySelector("#edit-profile-modal");
const editModalCloseBtn = profileEditModal.querySelector(
  ".modal__close-btn-profile"
);
const editModalName = profileEditModal.querySelector("#profile-name-input");
const editModalDescription = profileEditModal.querySelector(
  "#profile-name-description"
);
const profileFormElement = profileEditModal.querySelector(".modal__form");

// Avatar Modal
const avatarModal = document.querySelector("#avatar-modal");
const avatarModalBtn = document.querySelector(".profile__avatar-btn");
const avatarModalCloseBtn = avatarModal.querySelector(
  ".modal__close-btn-avatar"
);
const avatarInput = avatarModal.querySelector("#profile-avatar-input");
const avatarForm = avatarModal.querySelector(".modal__form");

// Add Card Modal
const cardModalBtn = document.querySelector(".profile__add-button");
const cardModal = document.querySelector("#add-card-modal");
const cardModalCloseBtn = cardModal.querySelector(".modal__close-btn-card");
const cardNameInput = cardModal.querySelector("#add-card-name-input");
const cardLinkInput = cardModal.querySelector("#add-card-link-input");
const cardForm = cardModal.querySelector(".modal__form");

// Preview Modal
const previewModal = document.querySelector("#preview-modal");
const previewModalCloseBtn = previewModal.querySelector(
  ".modal__close-btn_type_preview"
);
const previewImageEl = previewModal.querySelector(".modal__image");
const previewModalCaptionEl = previewModal.querySelector(".modal__caption");

// Cards
const cardTemplate = document.querySelector("#card-temp");
const cardList = document.querySelector(".cards__list");

// Variables for deletion
let selectedCard, selectedCardId;

// API Instance
const api = new Api({
  baseUrl: "https://around-api.en.tripleten-services.com/v1",
  headers: {
    authorization: "0f5fae76-5620-48ab-a31f-1d4301de3a4f",
    "Content-Type": "application/json",
  },
});

// Create Card Element
function getCardElement(data) {
  const cardElement = cardTemplate.content
    .querySelector(".card")
    .cloneNode(true);
  const cardDeleteButton = cardElement.querySelector(".card__delete-button");
  const cardNameEl = cardElement.querySelector(".card__title");
  const cardImageEl = cardElement.querySelector(".card__image");
  const cardLikeBtn = cardElement.querySelector(".card__like-button");

  if (data.isLiked) {
    cardLikeBtn.classList.add("card__like-button_liked");
  }

  cardNameEl.textContent = data.name;
  cardImageEl.src = data.link;
  cardImageEl.alt = data.name;

  cardDeleteButton.addEventListener("click", () =>
    handleDeleteCard(cardElement, data._id)
  );
  cardLikeBtn.addEventListener("click", (evt) =>
    handleLikeButton(evt, data._id)
  );
  cardImageEl.addEventListener("click", () => {
    openModal(previewModal);
    previewImageEl.src = data.link;
    previewImageEl.alt = data.name;
    previewModalCaptionEl.textContent = data.name;
  });

  return cardElement;
}

// Open & Close Modal Functions
function handleLikeButton(evt, _id) {
  const likeButton = evt.target;
  const isLiked = likeButton.classList.contains("card__like-button_liked");

  api
    .handleLike(_id, isLiked)
    .then(() => {
      likeButton.classList.toggle("card__like-button_liked");
    })
    .catch(console.error);
}

function openModal(modal) {
  modal.classList.add("modal_opened");
  document.addEventListener("keydown", handleEscapeKey);
}

function closeModal(modal) {
  modal.classList.remove("modal_opened");
  document.removeEventListener("keydown", handleEscapeKey);
}

function handleEscapeKey(evt) {
  if (evt.key === "Escape") {
    const openedModal = document.querySelector(".modal_opened");
    if (openedModal) closeModal(openedModal);
  }
}

// DELETE card
function handleDeleteCard(cardElement, cardId) {
  selectedCard = cardElement;
  selectedCardId = cardId;
  openModal(deleteModal);
}

function handleDeleteSubmit(evt) {
  evt.preventDefault();
  const submitBtn = evt.submitter;

  setButtonText(submitBtn, true, "Yes", "Deleting...");

  api
    .deleteCard(selectedCardId)
    .then(() => {
      selectedCard.remove();
      closeModal(deleteModal);
    })
    .catch(console.error)
    .finally(() => {
      setButtonText(submitBtn, false, "Delete", "Deleting...");
    });
}

// PROFILE edit
function handleProfileFormEdit(evt) {
  evt.preventDefault();
  const submitBtn = evt.submitter;

  setButtonText(submitBtn, true, "Save", "Saving...");

  api
    .editUserInfo({
      name: editModalName.value,
      about: editModalDescription.value,
    })
    .then((data) => {
      profileNameElement.textContent = data.name;
      profileDescriptionElement.textContent = data.about;
      closeModal(profileEditModal);
    })
    .catch(console.error)
    .finally(() => {
      setButtonText(submitBtn, false, "Save", "Saving...");
    });
}

// AVATAR update
function handleAvatarSubmit(evt) {
  evt.preventDefault();
  const submitBtn = evt.submitter;

  setButtonText(submitBtn, true, "Save", "Saving...");

  api
    .editAvatarInfo(avatarInput.value)
    .then((data) => {
      profileAvatarElement.src = data.avatar;
      closeModal(avatarModal);
      avatarForm.reset();
    })
    .catch(console.error)
    .finally(() => {
      setButtonText(submitBtn, false, "Save", "Saving...");
    });
}

// ADD Card to server
function handleCardSubmit(evt) {
  evt.preventDefault();
  const submitBtn = evt.submitter;

  setButtonText(submitBtn, true, "Create", "Saving...");

  api
    .addCard({
      name: cardNameInput.value,
      link: cardLinkInput.value,
    })
    .then((createdCard) => {
      const cardElement = getCardElement(createdCard);
      cardList.prepend(cardElement);
      closeModal(cardModal);
      cardForm.reset();
    })
    .catch(console.error)
    .finally(() => {
      setButtonText(submitBtn, false, "Save", "Saving...");
    });
}

// Event Listeners
profileEditButton.addEventListener("click", () => {
  editModalName.value = profileNameElement.textContent;
  editModalDescription.value = profileDescriptionElement.textContent;
  resetValidation(
    profileFormElement,
    [editModalName, editModalDescription],
    settings
  );
  openModal(profileEditModal);
});

avatarModalBtn.addEventListener("click", () => openModal(avatarModal));
cardModalBtn.addEventListener("click", () => openModal(cardModal));
cancelDeleteModal.addEventListener("click", () => closeModal(deleteModal));
cancelSubmit.addEventListener("click", () => closeModal(deleteModal));
editModalCloseBtn.addEventListener("click", () => closeModal(profileEditModal));
avatarModalCloseBtn.addEventListener("click", () => closeModal(avatarModal));
cardModalCloseBtn.addEventListener("click", () => closeModal(cardModal));
previewModalCloseBtn.addEventListener("click", () => closeModal(previewModal));

document.querySelectorAll(".modal").forEach((modal) => {
  modal.addEventListener("click", (evt) => {
    if (evt.target.classList.contains("modal")) closeModal(modal);
  });
});

profileFormElement.addEventListener("submit", handleProfileFormEdit);
avatarForm.addEventListener("submit", handleAvatarSubmit);
cardForm.addEventListener("submit", handleCardSubmit);
deleteForm.addEventListener("submit", handleDeleteSubmit);

// Load initial data (User Info + Cards)
api
  .getAppInfo()
  .then(([userInfo, cards]) => {
    profileNameElement.textContent = userInfo.name;
    profileDescriptionElement.textContent = userInfo.about;
    profileAvatarElement.src = userInfo.avatar;

    cards.forEach((card) => {
      const cardElement = getCardElement(card);
      cardList.append(cardElement);
    });
  })
  .catch(console.error);

// Enable Validation
enableValidation(settings);
