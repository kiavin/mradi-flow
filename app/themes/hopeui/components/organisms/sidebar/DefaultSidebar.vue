<script setup>
import { computed, onMounted } from 'vue'
import Scrollbar from 'smooth-scrollbar'
import Logo from '../../../../../components/molecules/Logo.vue'
import { useSetting } from '~/themes/hopeui/store/index.js'

const store = useSetting()
const sidebarType = computed(() => store.sidebar_type_value)

const sidebarShow = computed(() => [store.sidebar_show_value])

const sidebarColor = computed(() => [store.sidebar_color_value])

const sidebarMenuStyle = computed(() => [store.sidebar_menu_style_value])

// const toggleSidebar = () => {
//   document.getElementsByTagName('ASIDE')[0].classList.toggle('sidebar-mini')
// }

const SIDEBAR_STORAGE_KEY = 'sidebar-mini-enabled'

const toggleSidebar = () => {
  const aside = document.getElementsByTagName('ASIDE')[0]
  // aside.classList.toggle('sidebar-mini')
  const isMini = aside.classList.toggle('sidebar-mini')
  localStorage.setItem(SIDEBAR_STORAGE_KEY, isMini ? '1' : '0')
  
  // Toggle logo visibility based on sidebar state
  const logo = document.querySelector('.navbar-brand')
  if (aside.classList.contains('sidebar-mini')) {
    logo.style.transform = 'scale(0.8)'
  } else {
    logo.style.transform = 'scale(1)'
  }
}
onMounted(() => {
  Scrollbar.init(document.querySelector('.data-scrollbar'), { continuousScrolling: false })

   // Restore sidebar state from localStorage
  const aside = document.getElementsByTagName('ASIDE')[0]
  const isMini = localStorage.getItem(SIDEBAR_STORAGE_KEY) === '1'
  if (isMini) {
    aside.classList.add('sidebar-mini')
  } else {
    aside.classList.remove('sidebar-mini')
  }

  // Expand sidebar on hover when minimized
  // sidebarList.addEventListener('mouseenter', () => {
  //   if (aside.classList.contains('sidebar-mini')) {
  //     aside.classList.add('sidebar-hover-expanded')
  //   }
  // })
  // sidebarList.addEventListener('mouseleave', () => {
  //   aside.classList.remove('sidebar-hover-expanded')
  // })
})

// onMounted(() => {
//   Scrollbar.init(document.querySelector('.data-scrollbar'), { continuousScrolling: false })

//   // Restore sidebar state from localStorage
//   const aside = document.getElementsByTagName('ASIDE')[0]
//   const sidebarList = document.querySelector('.sidebar-list') // ✅ define it here
//   const isMini = localStorage.getItem(SIDEBAR_STORAGE_KEY) === '1'
//   if (isMini) {
//     aside.classList.add('sidebar-mini')
//   } else {
//     aside.classList.remove('sidebar-mini')
//   }

//   // Expand sidebar on hover when minimized
//   sidebarList.addEventListener('mouseenter', () => {
//     if (aside.classList.contains('sidebar-mini')) {
//       aside.classList.add('sidebar-hover-expanded')
//     }
//   })

//   sidebarList.addEventListener('mouseleave', () => {
//     aside.classList.remove('sidebar-hover-expanded')
//   })
// })

</script>
<template>
  <aside
    :class="`sidebar-base ${sidebarColor} ${sidebarMenuStyle} ${sidebarType.join(
      ' '
    )} ${sidebarShow}`"
    data-toggle="main-sidebar"
    data-sidebar="responsive"
  >
    <div class="sidebar-header d-flex align-items-center justify-content-start">
      <router-link :to="{ name: 'dashboard' }" class="navbar-brand">
        <Logo
          class="bg-white"
          :options="{
            containerWidth: 60,
            containerHeight: 60,
            borderRadius: '50%',
            border: '1px solid cyan',
            objectFit: 'contain',
            imgWidth: 40,
            imgHeight: 40,
          }"
        />
        <h4 class="logo-title" style="" data-setting="app_name">
           Mradi360
        </h4>
      </router-link>
      <div class="sidebar-toggle" @click="toggleSidebar">
        <i class="icon">
          <svg
            class="icon-20"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M4.25 12.2744L19.25 12.2744"
              stroke="currentColor"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            ></path>
            <path
              d="M10.2998 18.2988L4.2498 12.2748L10.2998 6.24976"
              stroke="currentColor"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            ></path>
          </svg>
        </i>
      </div>
    </div>
    <div class="sidebar-body pt-0 data-scrollbar">
      <div class="sidebar-list">
        <slot></slot>
      </div>
    </div>
    <div class="sidebar-footer"></div>
  </aside>
</template>
<style scoped>

/* Minimized state */
.sidebar-base.sidebar-mini {
  width: 80px; /* Increased from typical 60px to prevent overlap */
}

/* Logo adjustments */
.navbar-brand {
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto;
  gap: 10px;
  padding: 0 15px;
}

.sidebar-header {
  position: relative;
  width: 100%;
  display: flex;
  justify-content: center; /* This will help center the navbar-brand */
}

.sidebar-mini .logo-title {
  display: none;
}

/* Toggle button positioning */
.sidebar-toggle {
  position: absolute;
  right: -12px;
  top: 50%;
  transform: translateY(-50%);
  background: white;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 0 10px rgba(0,0,0,0.1);
  cursor: pointer;
  z-index: 10;
  transition: all 0.3s ease;
}

.sidebar-mini .sidebar-toggle {
  right: -15px; /* Adjust position when minimized */
}

/* Ensure scrollbar works properly */
.data-scrollbar {
  height: calc(100vh - 120px);
  overflow: hidden;
}

.sidebar-mini.sidebar-hover-expanded {
  width: 240px !important; /* or whatever your full width is */
}

</style>