<template>
  <!-- Sidebar Component Start Here -->
  <default-sidebar>
    <template #profile-card>
      <!-- <profile-card></profile-card> -->
    </template>
    <hr class="hr-horizontal" />
    <ul class="navbar-nav iq-main-menu" id="e-commerce">
      <template v-for="(item, index) in menuItems" :key="index">
        <side-menu
          v-if="!item.children"
          :isTag="item.isTag"
          :isChild="false"
          :title="item.title"
          :icon="item.icon"
          :miniTitle="item.miniTitle"
          :route="{ to: item.route }"
          :static-item="item.static"
        />

        <side-menu
          v-else
          :title="item.title"
          :isChild="true"
          :icon="item.icon"
          :miniTitle="item.miniTitle"
          :toggle-id="item.toggleId"
          :caret-icon="true"
          :route="{ popup: 'false', to: item.route }"
          @onClick="toggle"
          :active="currentRoute.includes(item.route)"
        >
          <b-collapse
            tag="ul"
            class="sub-nav"
            :id="item.toggleId"
            accordion="e-commerce"
            :visible="currentRoute.includes(item.route)"
          >
            <side-menu
              v-for="(subItem, subIndex) in item.children"
              :key="subIndex"
              isTag="router-link"
              :title="subItem.title"
              :icon="subItem.icon"
              :icon-size="subItem.iconSize"
              icon-type="solid"
              :miniTitle="subItem.miniTitle"
              :route="{ to: subItem.route }"
            />
          </b-collapse>
        </side-menu>
      </template>
    </ul>
  </default-sidebar>
  <!-- Sidebar Component End Here -->
</template>

<script setup>
import { onMounted, ref, computed } from 'vue'
import DefaultSidebar from '~/themes/hopeui/components/organisms/sidebar/DefaultSidebar.vue'
import SideMenu from '~/themes/hopeui/components/organisms/menu/SideMenu.vue'
// import ProfileCard from '@/components/custom/sidebar/ProfileCard.vue'
import { useRoute } from 'vue-router'
//use menu store to get menus
import { useAuthStore } from '~/omnicore/stores/authStore'
import _ from 'lodash'

const menuStore = useAuthStore()
// const rawMenus = computed(() => menuStore.getMenus())
// const rawMenus = computed(() => menuStore.user.menus)

const rawMenus = ref([
  {
    title: 'Dashboard',
    icon: 'home',
    route: 'dashboard',
  },
  // {
  //   title: 'Project Overview',
  //   icon: 'building',
  //   route: 'projectDashboard',
  // },
  {
    title: 'Projects',
    icon: 'folder',
    route: 'project/project',

  },
  {
    title: 'Expenses',
    icon: 'money-bill-trend-up',
    route: 'project/expense',
  },
  // {
  //   title: 'Expense Contributions',
  //   icon: 'hand-holding-dollar',
  //   route: 'project/expensecontribution',

  // },
  {
    title: 'Financiers',
    icon: 'users',
    route: 'project/financier',

  },
  // {
  //   title: 'Project Expenses',
  //   icon: 'file-invoice-dollar',
  //   route: 'project/projectexpense',

  // },
  // {
  //   title: 'Project Financiers',
  //   icon: 'user-tie',
  //   route: 'project/projectfinancier',

  // },
])

const currentRoute = ref('')
const route = useRoute()
const toggle = (route) => {
  if (route === currentRoute.value && route.includes('.')) {
    const menu = currentRoute.value.split('.')
    return (currentRoute.value = menu[menu.length - 2])
  }
  if (route !== currentRoute.value && currentRoute.value.includes(route)) {
    return (currentRoute.value = '')
  }
  if (route !== currentRoute.value) {
    return (currentRoute.value = route)
  }
  if (route === currentRoute.value) {
    return (currentRoute.value = '')
  }
  return (currentRoute.value = '')
}
toggle(route.name)

const menuItems = ref([])

function transformMenuItem(backendItem) {
  const transformed = {
    // Only assign 'router-link' if there's a route and it's not a parent with children
    isTag: backendItem.route && !backendItem.children ? 'router-link' : 'parent',
    title: backendItem.title,
    icon: backendItem.icon,
    miniTitle: backendItem.miniTitle || '',
    toggleId: backendItem.children
      ? backendItem.toggleId || backendItem.title.toLowerCase().replace(/\s+/g, '-')
      : undefined,
    route: backendItem.route,
    popup: backendItem.popup || 'false',
    caretIcon: backendItem.children ? true : false,
  }

  // Recursively transform children if they exist
  if (backendItem.children && Array.isArray(backendItem.children)) {
    transformed.children = backendItem.children.map((child) => transformMenuItem(child))
  }

  return transformed
}

onMounted(() => {

  if (Array.isArray(rawMenus.value)) {
    menuItems.value = rawMenus.value.map((item) => transformMenuItem(item))
  } else {
    console.warn('Expected an array for rawMenus, but got:', rawMenus.value)
    menuItems.value = []
  }
})
</script>
