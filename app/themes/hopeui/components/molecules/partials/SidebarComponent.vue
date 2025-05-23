<script setup>
import DefaultSidebar from '~/themes/hopeui/components/organisms/sidebar/DefaultSidebar.vue'
import SideMenu from '~/themes/hopeui/components/organisms/menu/SideMenu.vue'
import { ref } from 'vue'
import { useRoute } from 'vue-router'

import menuData from '~/omnicore/config/menu.json'

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
      <!-- <side-menu title="Home" :static-item="true"></side-menu> -->
      <side-menu
        isTag="router-link"
        title="Dashboard"
        icon="dashboard"
        :route="{ to: 'dashboard' }"
      ></side-menu>
      <side-menu title="ADMIN & IAM" icon="shield"  toggle-id="menu-style" :caret-icon="true" :route="{ popup: 'false', to: 'menu-style' }" @onClick="toggle" :active="currentRoute.includes('menu-style')">
        <b-collapse tag="ul" class="sub-nav" id="menu-style" accordion="sidebar-menu" :visible="currentRoute.includes('menu-style')">
          <side-menu title="Users" icon="circle" :icon-size="10" icon-type="solid" miniTitle="H" :route="{ to: 'iam/roles' }"></side-menu>
          <side-menu title="Roles" icon="circle" :icon-size="10" icon-type="solid" miniTitle="D" :route="{ to: 'iam/roles' }"></side-menu>
          <side-menu title="Groups" icon="circle" :icon-size="10" icon-type="solid" miniTitle="D" :route="{ to: 'iam/groups' }"></side-menu>
          <side-menu title="Permissions" icon="circle" :icon-size="10" icon-type="solid" miniTitle="B" :route="{ to: 'iam/permissions' }"></side-menu>
        </b-collapse>
      </side-menu>
    </ul>
  </default-sidebar>
</template>



