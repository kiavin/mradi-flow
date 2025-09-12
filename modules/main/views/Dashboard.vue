<script setup>
import { onMounted, computed, onUpdated, nextTick } from 'vue'
import { showIziToast } from '../../../app/omnicore/utils/iziToastUtil'

const { data, status, error, isLoading, request } = useApi('/v1/admin/countries', {
  transform: (response) => {
    const payload = response?.dataPayload?.data || []
    return payload.map((country) => ({
      id: country.id,
      code: country.code,
      name: country.name,
      citizenship: country.citizenship,
      status: country.status?.label || 'Unknown',
    }))
  },
  onLoading: () => console.log('Fetching started...'), // onloading custom handler
  onSuccess: (response) => console.log('Success!', response), // onsucess cutom hanlder
  onComplete: ({ status }) => console.log(`Completed with status: ${status}`),
  // retry: 2,
  // loadingDelay: 300
})

// POST composable to create a country
const countryPayload = ref({
  code: 'ET',
  name: 'ETHOPIA',
  citizenship: 'Ethiopian',
})

const {
  request: createCountry,
  isLoading: isPosting,
  progress,
  error: postError,
  status: postStatus,
} = useApi('/v1/admin/country', {
  method: 'POST',
  useAuth: true,
  autoFetch: false,
  autoAlert: true, // Optional: will show alert from server response
  // onError: (err) => {
  //   if (err.response?.status === 422) {
  //     console.warn('Validation Error:', err.response.data?.errorPayload?.errors)
  //     return alert('Validation failed. Please check your inputs.')
  //   }
  //   return null
  // },
  //  onLoading: () => console.log('Fetching started...'),
})

// Trigger the POST
const handleSubmit = () => {
  createCountry(countryPayload.value)
}

// testing batchrequest
const {
  batchRequest,
  data: batchData,
  error: batchError,
} = useApi('', {
  useAuth: true,
})

const runBatchRequest = async () => {
  try {
    await batchRequest([
      { url: '/v1/admin/countries', method: 'GET', requestName: 'countries' },
      { url: '/v1/admin/currencies', method: 'GET', requestName: 'currencies' },
    ])
    console.log('Batch Data:', batchData.value)
  } catch (err) {
    console.error('Batch Error:', batchError.value || err)
  }
}
onMounted(() => {
  request()
  runBatchRequest()
})
const isBatchReady = computed(() => Array.isArray(batchData.value) && batchData.value.length > 0)

// batch request uses
//     All examples assume:

// const {
//   batchRequest,
//   data: batchData,
//   error: batchError,
// } = useApi('', { useAuth: true }) // Leave baseUrl empty for full URLs in batch

// 1. GET Requests

// await batchRequest([
//   { url: '/v1/admin/countries', method: 'GET' },
//   { url: '/v1/admin/currencies', method: 'GET' }
// ])

//  POST Requests
// await batchRequest([
//   {
//     url: '/v1/scheduler/space',
//     method: 'POST',
//     payload: {
//       name: 'Main Hall',
//       opening_time: '08:00',
//       closing_time: '17:00',
//       capacity: 100,
//       created_at: new Date().toISOString(),
//       updated_at: new Date().toISOString()
//     }
//   },
//   {
//     url: '/v1/scheduler/space',
//     method: 'POST',
//     payload: {
//       name: 'Conference Room A',
//       opening_time: '09:00',
//       closing_time: '18:00',
//       capacity: 50,
//       created_at: new Date().toISOString(),
//       updated_at: new Date().toISOString()
//     }
//   }
// ])

// 3. PUT Requests

// await batchRequest([
//   {
//     url: '/v1/scheduler/space/123',
//     method: 'PUT',
//     payload: {
//       name: 'Updated Room Name',
//       capacity: 120,
//       updated_at: new Date().toISOString()
//     }
//   }
// ])

// DELETE

// await batchRequest([
//   {
//     url: '/v1/scheduler/space/123',
//     method: 'DELETE'
//   },
//   {
//     url: '/v1/scheduler/space/456',
//     method: 'DELETE'
//   }
// ])

// MOCK API TESTS
// Mock API: POST /api/spaces
const {
  request: postMockSpace,
  data: mockSpaceData,
  isLoading: isMockSpaceLoading,
} = useApi('/api/spaces', {
  method: 'POST',
  mock: (payload, queryParams, method) => ({
    id: 999,
    name: payload.name,
    methodUsed: method,
    receivedAt: new Date().toISOString(),
  }),
  autoFetch: false,
})

// Mock API: GET /api/fail-check (simulate error)
const {
  request: getMockError,
  error: mockError,
  isLoading: isMockErrorLoading,
} = useApi('/api/fail-check', {
  method: 'GET',
  mock: {
    simulateError: true,
    delay: 1000,
    error: ['Oops! Something went wrong'],
  },
  autoFetch: false,
})

// Mock API: POST /api/upload (simulate progress)
const {
  request: uploadMock,
  isLoading: isUploadingMock,
  progress: uploadProgress,
  data: uploadData,
} = useApi('/api/upload', {
  method: 'POST',
  mock: {
    simulateProgress: true,
    delay: 2000,
    data: { success: true },
  },
  autoFetch: false,
})

// Mock API: GET /api/space (once only)
const {
  request: getOnceOnlyMock,
  data: onceMockData,
  isLoading: isOnceMockLoading,
} = useApi('/api/space', {
  method: 'GET',
  mock: {
    once: true,
    delay: 500,
    data: { mockData: 'Shown once only' },
  },
  autoFetch: false,
})

// Trigger functions
const callPostMockSpace = () => postMockSpace({ name: 'Mock Room' })
const callUploadMock = () => uploadMock()
const callErrorMock = () => getMockError()
const callOnceOnlyMock = () => getOnceOnlyMock()

// PAGINATION TEST: /v1/iam/rbac/permission
// const {
//   data: paginatedPermissions,
//   request: fetchPermissions,
//   nextPage,
//   prevPage,
//   goToPage,
//   currentPage,
//   totalPages,
//   pages,
//   isLoading: isPaginating,
//   error: paginationError,
// } = useApi('/v1/iam/rbac/permission', {
//   method: 'GET',
//   useAuth: true,
//   pagination: true,
//   perPage: 10,
//   autoFetch: true,

// })
const {
  data: paginatedPermissions,
  request: fetchPermissions,
  nextPage,
  prevPage,
  goToPage,
  currentPage,
  totalPages,
  pages,
  isLoading: isPaginating,
  error: paginationError,
} = useApi('/v1/iam/rbac/permission', {
  method: 'GET',
  pagination: true,
  perPage: 5,
  autoFetch: true,

  // Extract pagination meta from custom structure
  transformPagination: (res) => {
    const meta = res?.dataPayload || {}
    return {
      totalItems: meta.totalCount,
      currentPage: meta.currentPage,
      perPage: meta.perPage,
      totalPages: meta.totalPages,
    }
  },

  // Extract data array
  transform: (res) => res?.dataPayload?.data ?? [],
})

const goToPageInput = ref(currentPage.value)
watch(currentPage, (val) => (goToPageInput.value = val))

console.log('PAGINATIN DATA', paginatedPermissions)

// tranformed pagination

// testing real time websockest

const messageLog = ref([])
const logContainer = ref(null)

const { realtime } = useApi('', {
  method: 'GET',
  autoFetch: true,
  realtimeOptions: {
    enabled: true,
    protocol: 'ws',
    realtimeUrl: 'ws://localhost:8080/', // make sure this matches your PHP WebSocket route
    realtimeParams: { topic: 'space_updates' }, // if you're subscribing to topics
    onNotification: (notif) => {
      console.log('[NOTIFICATION]', notif)
    },
    onRealtimeMessage: (msg) => {
      console.log('[REALTIME MESSAGE]', msg)
      messageLog.value.push({
        timestamp: new Date().toISOString(),
        ...msg,
      })
      // showIziToast({
      //   message: msg?.data,
      // })
    },
  },
})

onUpdated(() => {
  nextTick(() => {
    if (logContainer.value) {
      logContainer.value.scrollTop = logContainer.value.scrollHeight
    }
  })
})

function getMessageClass(msg) {
  if (msg.toLowerCase().includes('error')) return 'log-error'
  if (msg.toLowerCase().includes('warning')) return 'log-warning'
  return 'log-info'
}
</script>
<template>
  <div>
    <h3>Status: {{ realtime?.status }}</h3>

    <h4>Live Incoming Messages</h4>
    <div ref="logContainer" class="log-container">
      <div v-for="(msg, index) in messageLog" :key="index" class="log-entry">
        <pre>{{ msg }}</pre>
      </div>
    </div>
  </div>
  <div>
    <h2>Country List</h2>

    <div v-if="isLoading">Loading...</div>
    <div v-else-if="error">Error: {{ error }}</div>

    <ul v-else>
      <li v-for="country in data" :key="country.id">
        {{ country.name }} ({{ country.code }}) - {{ country.citizenship }} | Status:
        {{ country.status }}
      </li>
    </ul>
  </div>
  <div>
    <h2>Create Country</h2>

    <button @click="handleSubmit" :disabled="isPosting">
      {{ isPosting ? 'Posting...' : 'Create Country' }}
    </button>

    <div v-if="isPosting">
      Uploading: {{ progress }}%
      <progress :value="progress" max="100" style="width: 100%"></progress>
    </div>

    <div v-if="postStatus === 'success'" class="text-success">Country created successfully!</div>
    <div v-if="postStatus === 'error'" class="text-danger">Error: {{ postError }}</div>
  </div>
  <div>
    <h2>Batch Result</h2>
    <div v-if="batchError">Error: {{ batchError }}</div>
    <div v-else-if="!isBatchReady">Loading...</div>
    <div v-else>
      <h3>Countries</h3>
      <ul>
        {{
          batchData[0]
        }}
      </ul>
      <h3>Currencies</h3>
      <ul>
        {{
          batchData[1]
        }}
      </ul>
    </div>
  </div>

  <div>
    <h2>🔧 Mock API Test Section</h2>

    <div>
      <h3>Mock POST /api/spaces</h3>
      <button class="btn btn-success" @click="callPostMockSpace" :disabled="isMockSpaceLoading">
        {{ isMockSpaceLoading ? 'Posting...' : 'Test Post Mock' }}
      </button>
      <pre v-if="mockSpaceData">{{ mockSpaceData }}</pre>
    </div>

    <div>
      <h3>Mock GET /api/fail-check (Error Simulation)</h3>
      <button class="btn btn-success" @click="callErrorMock" :disabled="isMockErrorLoading">
        {{ isMockErrorLoading ? 'Simulating...' : 'Trigger Error' }}
      </button>
      <pre v-if="mockError" class="text-danger">{{ mockError }}</pre>
    </div>

    <div>
      <h3>Mock POST /api/upload (With Progress)</h3>
      <button class="btn btn-success" @click="callUploadMock" :disabled="isUploadingMock">
        {{ isUploadingMock ? 'Uploading...' : 'Test Upload Mock' }}
      </button>
      <div v-if="isUploadingMock">
        Upload Progress: {{ uploadProgress }}%
        <progress :value="uploadProgress" max="100" style="width: 100%"></progress>
      </div>
      <pre v-if="uploadData">{{ uploadData }}</pre>
    </div>

    <div>
      <h3>Mock GET /api/space (Once Only)</h3>
      <button class="btn btn-success" @click="callOnceOnlyMock" :disabled="isOnceMockLoading">
        {{ isOnceMockLoading ? 'Fetching...' : 'Fetch Once Only Mock' }}
      </button>
      <pre v-if="onceMockData">{{ onceMockData }}</pre>
    </div>
  </div>

  <!-- <div>
    <h2>📄 Paginated Permissions</h2>

    <div v-if="isPaginating">Loading permissions...</div>
    <div v-else-if="paginationError">Error: {{ paginationError }}</div>
    <div v-else>
      <ul>
        <li v-for="(perm, index) in paginatedPermissions" :key="perm.id || index">
          {{ paginatedPermissions }}
        </li>
      </ul>

      <div class="pagination-controls">
        <button @click="prevPage" :disabled="currentPage <= 1">⏮ Prev</button>
        <span>Page {{ currentPage }} of {{ totalPages }}</span>
        <button @click="nextPage" :disabled="currentPage >= totalPages">Next ⏭</button>
      </div>

      <div class="page-links">
        <button class="btn btn-primary"
          v-for="page in pages"
          :key="page"
          :class="{ active: currentPage === page }"
          @click="goToPage(page)"
        >
          {{ page }}
        </button>
      </div>
{{ pages }}
      <div>
        <label for="goToPage">Go to page:</label>
        <input
          id="goToPage"
          type="number"
          :min="1"
          :max="totalPages"
          v-model.number="goToPageInput"
          @keyup.enter="goToPage(goToPageInput)"
        />
        <button @click="goToPage(goToPageInput)">Go</button>
      </div>
    </div>
  </div> -->

  <div>
    <h2>📄 Paginated Permissions</h2>

    <div v-if="isPaginating">Loading permissions...</div>
    <div v-else-if="paginationError">Error: {{ paginationError }}</div>
    <div v-else>
      <ul>
        <li v-for="(perm, index) in paginatedPermissions" :key="perm.id || index">
          {{ perm.name || perm }}
        </li>
      </ul>

      <!-- Pagination Controls -->
      <div class="pagination-controls">
        <button class="btn btn-success" @click="prevPage" :disabled="currentPage <= 1">
          ⏮ Prev
        </button>
        <span>Page {{ currentPage }} of {{ totalPages }}</span>
        <button class="btn btn-success" @click="nextPage" :disabled="currentPage >= totalPages">
          Next ⏭
        </button>
      </div>

      <!-- Page Links -->
      <div class="page-links">
        <button
          v-for="page in pages"
          :key="page"
          :class="{ active: currentPage === page }"
          @click="goToPage(page)"
        >
          {{ page }}
        </button>
      </div>

      <!-- Jump to Page -->
      <div>
        <label for="goToPage">Go to page:</label>
        <input
          id="goToPage"
          type="number"
          :min="1"
          :max="totalPages"
          v-model.number="goToPageInput"
          @keyup.enter="goToPage(goToPageInput)"
        />
        <button @click="goToPage(goToPageInput)">Go</button>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
ul {
  margin: 0;
  padding-left: 1.5rem;
}
li {
  margin-bottom: 0.5rem;
}
h2,
h3 {
  margin-top: 1.5rem;
}
pre {
  background-color: #111;
  padding: 1rem;
  color: lime;
  overflow-x: auto;
  border-radius: 0.25rem;
}
.text-danger {
  color: #ff4d4f;
}

.pagination-controls {
  margin: 1rem 0;
  display: flex;
  align-items: center;
  gap: 1rem;

  button {
    padding: 0.4rem 0.75rem;
    font-size: 0.95rem;
  }
}

.log-container {
  max-height: 400px;
  overflow-y: auto;
  border: 1px solid #ccc;
  padding: 1rem;
  background: #f9f9f9;
}

.log-entry {
  margin-bottom: 8px;
  border-bottom: 1px dashed #555;
  padding-bottom: 4px;
}
</style>