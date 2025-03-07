import { library } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

import { faEdit, faTrash, faEye, faTrashCan, faRotateLeft } from "@fortawesome/free-solid-svg-icons"; // Solid
import { faAddressBook } from "@fortawesome/free-regular-svg-icons"; // Regular
import { faGithub, faTwitter } from "@fortawesome/free-brands-svg-icons"; // Brands

library.add(
  faEdit, faTrash, faEye, faTrashCan, faRotateLeft, // Solid
  faAddressBook,                                    // Regular
  faGithub, faTwitter                               // Brands
);

export default {
  install(app) {
    app.component("FontAwesomeIcon", FontAwesomeIcon);
  },
};
