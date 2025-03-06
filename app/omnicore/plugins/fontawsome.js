import { library } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

// Import icons from different styles
import { faEdit, faTrash, faEye, faTrashCan } from "@fortawesome/free-solid-svg-icons"; // Solid
import { faAddressBook } from "@fortawesome/free-regular-svg-icons"; // Regular
import { faGithub, faTwitter } from "@fortawesome/free-brands-svg-icons"; // Brands

// Add all icons to the library
library.add(
  faEdit, faTrash, faEye, faTrashCan, // Solid
  faAddressBook,                      // Regular
  faGithub, faTwitter                  // Brands
);

export default {
  install(app) {
    app.component("FontAwesomeIcon", FontAwesomeIcon);
  },
};
