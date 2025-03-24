import { library } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

import { faEdit, faTrash, faEye, faTrashCan, faRotateLeft, faArrowUp, faArrowDown, faUser } from "@fortawesome/free-solid-svg-icons"; // Solid
import { faAddressBook } from "@fortawesome/free-regular-svg-icons"; // Regular
import { faGithub, faTwitter } from "@fortawesome/free-brands-svg-icons"; // Brands

library.add(
  faEdit, faTrash, faEye, faTrashCan, faRotateLeft, faArrowUp, faArrowDown, faUser,
  faAddressBook,                                    
  faGithub, faTwitter                              
);

export default {
  install(app) {
    app.component("FontAwesomeIcon", FontAwesomeIcon);
  },
};
