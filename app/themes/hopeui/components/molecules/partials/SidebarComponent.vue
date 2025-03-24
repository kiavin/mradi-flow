<script setup>
import DefaultSidebar from '~/themes/hopeui/components/organisms/sidebar/DefaultSidebar.vue'
import SideMenu from '~/themes/hopeui/components/organisms/menu/SideMenu.vue'
import { ref } from 'vue'
import { useRoute } from 'vue-router'

import menuData from "~/omnicore/helpers/menu.json";

console.log(JSON.stringify(menuData))

const currentRoute = ref('')
const route = useRoute()
const menuItems = ref(menuData) || {}

// const toggle = (route) => {
//   if (route === currentRoute.value && route.includes('.')) {
//     const menu = currentRoute.value.split('.')
//     return (currentRoute.value = menu[menu.length - 2])
//   }
//   if (route !== currentRoute.value && currentRoute.value.includes(route)) {
//     return (currentRoute.value = '')
//   }
//   if (route !== currentRoute.value) {
//     return (currentRoute.value = route)
//   }
//   if (route === currentRoute.value) {
//     return (currentRoute.value = '')
//   }
//   return (currentRoute.value = '')
// }
// toggle(route.name)

const toggle = (routeName) => {
  if (!routeName) return
  if (routeName === currentRoute.value && routeName.includes('.')) {
    const menu = currentRoute.value.split('.')
    currentRoute.value = menu[menu.length - 2]
  } else if (routeName !== currentRoute.value && currentRoute.value.includes(routeName)) {
    currentRoute.value = ''
  } else {
    currentRoute.value = routeName
  }
}
toggle(route.name)
</script>

<template>
  <default-sidebar>
    <ul class="navbar-nav iq-main-menu" id="sidebar-menu">
      <template v-for="(sections, category) in menuItems" :key="category">
        <li class="nav-item">
          <span class="menu-title">{{ category }}</span>
          <ul class="sub-menu">
            <template v-for="(items, section) in sections" :key="section">
              <!-- Treat each section as a parent menu item -->
               <b-collapse></b-collapse>
              <side-menu
                :title="section"
                :caret-icon="true"
                :route="{ popup: 'false', to: section }"
                @onClick="toggle"
                :active="currentRoute.includes(section)"
              >
                <b-collapse
                  tag="ul"
                  class="sub-nav"
                  :id="`collapse-${section}`"
                  accordion="sidebar-menu"
                  :visible="currentRoute.includes(section)"
                >
                  <!-- Render child items -->
                  <side-menu
                    v-for="(item, index) in items"
                    :key="index"
                    isTag="router-link"
                    :title="item.title"
                    :route="{ to: item.name }"
                  />
                </b-collapse>
              </side-menu>
            </template>
          </ul>
        </li>
      </template>
    </ul>
  </default-sidebar>
</template>



