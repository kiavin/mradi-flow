import { library } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

import { 
  faEdit, faTrash, faEye, faTrashCan, faCircleChevronRight, faCircleChevronDown,
  faTrashCan, faRotateLeft, faArrowUp, 
  faArrowDown, faUser,  faThumbsUp as fasThumbsUp,  
  faArrowUpShortWide,  faArrowDownWideShort, 
  faEllipsisVertical, faEllipsisHorizontal, faFilter, faPlus, faMinus, faCircleXmark,faMagnifyingGlass, faAnglesLeft, faAnglesRight,
 } from "@fortawesome/free-solid-svg-icons"; // Solid
import { faAddressBook, faCircleXmark } from "@fortawesome/free-regular-svg-icons"; // Regular
import { faGithub, faTwitter } from "@fortawesome/free-brands-svg-icons"; // Brands

library.add(
  faEdit, faTrash, faEye, faFilter, faPlus, faMinus,faCircleXmark,faCircleChevronRight, faCircleChevronDown,faAnglesLeft,faAnglesRight,
  faTrashCan, faRotateLeft, faMagnifyingGlass,
  faArrowUp, faArrowDown, faUser,fasThumbsUp, 
  faArrowUpShortWide, faArrowDownWideShort,
  faEllipsisVertical, faEllipsisHorizontal,
  faAddressBook,  faCircleXmark,                            
  faGithub, faTwitter                              
);

export default {
  install(app) {
    app.component("FontAwesomeIcon", FontAwesomeIcon);
  },
};
