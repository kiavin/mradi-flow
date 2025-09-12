<script setup>
import DefaultSidebar from '~/themes/hopeui/components/organisms/sidebar/DefaultSidebar.vue'
import SideMenu from '~/themes/hopeui/components/organisms/menu/SideMenu.vue'
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import { useAuthStore } from '~/omnicore/stores/authStore'
import menuData from '~/omnicore/config/menu.json'

const authStore = useAuthStore()

const currentRoute = ref('')
const route = useRoute()
const menuItems = ref(menuData) || {}
const menus = ref(authStore.getMenus())

// const openMenu = ref('')

const toggle = (routeName) => {
  if (!routeName) return
  currentRoute.value = currentRoute.value === routeName ? '' : routeName
}

// const toggle = (routeName) => {
//   if (!routeName) return
//   openMenu.value = openMenu.value === routeName ? '' : routeName
// }

watch(
  () => route.name,
  (newVal) => {
    if (newVal) {
      // If the route matches a parent menu, open it
      const parentRoute = menuItems.value.find((item) =>
        item.children?.some((child) => child.to === newVal)
      )
      if (parentRoute) {
        currentRoute.value = parentRoute.to
      }
    }
  },
  { immediate: true }
)
</script>

<template>
  <default-sidebar>
    <ul class="navbar-nav iq-main-menu" id="sidebar-menu">
      <!-- <side-menu title="Home" :static-item="true"></side-menu> -->
      <!-- <side-menu title="Users" icon="circle" :icon-size="10" icon-type="solid" miniTitle="H" :route="{ to: 'iam/roles' }"></side-menu> -->

      <side-menu
        isTag="router-link"
        title="Home"
        icon="house"
        :route="{ to: 'dashboard' }"
        v-once
      ></side-menu>

      <template v-for="(menuGroup, key) in menus" :key="key">
        <template v-for="(menu, index) in menuGroup" :key="index">
          <!-- Check if menu has submenus -->
          <side-menu
            v-if="menu.submenus && menu.submenus.length"
            :title="menu.label"
            :icon="menu.icon || 'circle'"
            :toggle-id="`toggle-${key}-${index}`"
            :caret-icon="true"
            :route="{ popup: 'false', to: menu.route }"
            @onClick="() => toggle(menu.route)"
            :active="currentRoute.includes(menu.route)"
          >
            <b-collapse
              tag="ul"
              class="sub-nav"
              :id="`toggle-${key}-${index}`"
              :accordion="`accordion-group-${key}`"
              :visible="currentRoute.includes(menu.route)"
            >
              <side-menu
                v-for="(submenu, subIndex) in menu.submenus"
                :key="subIndex"
                :title="submenu.label"
                :route="{ to: submenu.route }"
                :active-submenu="route.name === submenu.route"
              ></side-menu>
            </b-collapse>
          </side-menu>

          <!-- For single (non-collapsible) menu -->
          <side-menu
            v-else
            :title="menu.label"
            :icon="menu.icon || 'circle'"
            :route="{ popup: 'false', to: menu.route }"
            :active="currentRoute.includes(menu.route)"
          ></side-menu>
        </template>
      </template>
    </ul>
  </default-sidebar>
</template>
<style></style>



