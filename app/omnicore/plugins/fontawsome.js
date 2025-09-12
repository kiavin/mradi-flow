import { library } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

import {
  faEdit, faTrash, faEye, faTrashCan, faCircleChevronRight, faCircleChevronDown, faCircleCheck,
  faTrashCan, faRotateLeft, faArrowUp, faUpRightFromSquare, faFileInvoiceDollar,
  faArrowDown, faUser, faThumbsUp as fasThumbsUp,
  faArrowUpShortWide, faArrowDownWideShort, faCircle, faAddressBook,
  faEllipsisVertical, faEllipsisHorizontal, faFilter, faUsersRectangle, faPlus, faUserTag, faShield, faShieldHalved, faMinus, faCircleXmark, faMagnifyingGlass, faAnglesLeft, faAnglesRight, faExpand, faCompress
} from "@fortawesome/free-solid-svg-icons"; // Solid
import { faAddressBook, faCircleXmark } from "@fortawesome/free-regular-svg-icons"; // Regular
import { faGithub, faTwitter } from "@fortawesome/free-brands-svg-icons"; // Brands

library.add(
  faEdit, faTrash, faEye, faFilter, faPlus, faMinus, faCircleXmark, faCircleChevronRight, faCircleChevronDown, faAnglesLeft, faAnglesRight, faExpand, faCompress,
  faTrashCan, faRotateLeft, faMagnifyingGlass, faUpRightFromSquare, faCircleCheck, faUserTag, faUsersRectangle, faShield, faShieldHalved,
  faArrowUp, faArrowDown, faUser, fasThumbsUp,
  faArrowUpShortWide, faArrowDownWideShort,
  faEllipsisVertical, faEllipsisHorizontal,
  faAddressBook, faCircleXmark,
  faGithub, faTwitter, faCircle, faFileInvoiceDollar
);

export default {
  install(app) {
    app.component("FontAwesomeIcon", FontAwesomeIcon);
  },
};
