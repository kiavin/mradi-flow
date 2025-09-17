// File: @/utils/selectOptionsFetcher.js

// import { useApi } from '@/composables/useApi'

// 👇 Shared base function
async function fetchSelectOptions(endpoint, valueKey = 'id', labelKey = 'name') {
  const { data, request, error } = useApi(endpoint, {
    method: 'GET',
    autoFetch: false,
    autoAlert: false,
  })

  await request()

  if (error.value) {
    console.warn(`❌ Failed to fetch from ${endpoint}:`, error.value)
    return []
  }

  const items = data.value?.dataPayload?.data

  if (Array.isArray(items)) {
    return items.map((item) => ({
      value: item[valueKey],
      label: item[labelKey],
    }))
  } else {
    console.warn(`❌ No valid data from ${endpoint}`, data.value)
    return []
  }
}

// ✅ Export each named function
export async function fetchFinancierOptions() {
  return await fetchSelectOptions('/v1/project/financiers')
}

export async function fetchExpenseOptions() {
  return await fetchSelectOptions('/v1/project/expenses')
}

export async function fetchProjectOptions() {
  return await fetchSelectOptions('/v1/project/projects')
}

export async function fetchAvailableFinancierOptions(id) {
  return await fetchSelectOptions(`/v1/project/${id}/financiers-available`)
}

export async function fetchNewExpenseOptions(id) {
  return await fetchSelectOptions(`/v1/project/${id}/expenses-available`)
}

export async function fetchProjectExpenseOptions(id) {
  return await fetchSelectOptions(`/v1/project/${id}/expenses`)
}

export async function fetchProjectFinancierOptions(id) {
  return await fetchSelectOptions(`/v1/project/${id}/financiers`)
}




