<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import Button from '~/themes/hopeui/components/atoms/button/BaseButton.vue'
import ClientInfo from '@/client/components/organisms/ClientInfo.vue'
import ProfileCard from '@/client/components/molecules/ProfileCard.vue'
import { useNavigationMetaStore } from '~/omnicore/stores/navigationMeta'

const metaStore = useNavigationMetaStore()

const clientExtras = metaStore.getMeta('clientExtras')


onMounted(() => {
  const currencyId = clientExtras?.currencyId
  const countryId = clientExtras?.countryId
})

const route = useRoute()
const router = useRouter()
const id = route.params.id
// const currencyId = route.query.currencyId
// const countryId = route.query.countryId

const currencyId = clientExtras?.currencyId
const countryId = clientExtras?.countryId

const apiBaseUrl = `/v1/client/profile/${id}`

const { data, request, isLoading, error } = useApi(apiBaseUrl, {
  method: 'GET',
  options: {},
  autoFetch: true,
})
const formData = ref({})

// onMounted(async () => {
// await request();
// formData.value = data.value || {};
// });

const currencyMap = ref({})
const countryMap = ref({})

const {
  batchRequest,
  data: batchData,
  error: batchError,
  isLoading: batchLoading,
} = useApi('', { useAuth: true })

const runBatchRequest = async () => {
  if (!currencyId || !countryId) return

  try {
    await batchRequest([
      {
        url: `/v1/admin/currency/name?id=${currencyId}`,
        method: 'GET',
        requestName: 'currency',
      },
      {
        url: `/v1/admin/country/name?id=${countryId}`,
        method: 'GET',
        requestName: 'country',
      },
    ])
    console.log('Batch Data:', batchData.value)
    const currency = batchData.value?.currency?.dataPayload?.data
    const country = batchData.value?.country?.dataPayload?.data

    if (currency) {
      currencyMap.value = { [currency.id]: currency.name }
    }

    if (country) {
      countryMap.value = { [country.id]: country.name }
    }
  } catch (err) {
    console.error('Batch Error:', batchError.value || err)
  }
}

watch(data, () => {
  if (data.value) {
    formData.value = data.value.dataPayload.data || {}
  }
  runBatchRequest()
})
</script>

<template>
  <div class="card p-3">
    <div class="row d-flex justify-content-between align-items-center">
      <div class="col-auto">
        <h1 class="h1 mt-2">Client Profile</h1>
      </div>
      <div class="col-auto">
        <Button
          type="submit"
          customClass="btn btn-primary"
          @click="
            () => {
              router.push({ name: 'iam/clientprofile/update', params: { id } })
            }
          "
        >
          Edit
        </Button>
      </div>
      <!-- <div class="card">
        <h2 class="h2">Name</h2>
      </div> -->
      <ClientInfo
        :clientInfo="data?.dataPayload?.data"
        :isLoading="isLoading"
        :isBatchLoading="batchLoading"
        :billingInfo="batchData"
      />
    </div>
  </div>
</template>

<style scoped>
</style>