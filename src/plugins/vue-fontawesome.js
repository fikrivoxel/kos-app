import Vue from "vue";
import { library, config } from "@fortawesome/fontawesome-svg-core";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { fab } from "@fortawesome/free-brands-svg-icons";
import { far } from "@fortawesome/free-regular-svg-icons";
import {
  FontAwesomeIcon,
  FontAwesomeLayers
} from "@fortawesome/vue-fontawesome";

config.autoAddCss = true;

library.add(fas, far, fab);

Vue.component("fa-icon", FontAwesomeIcon);
Vue.component("fa-layers", FontAwesomeLayers);
