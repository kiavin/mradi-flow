<script setup>
import { ref, onMounted } from 'vue'
import Vue3autocounter from 'vue3-autocounter'
import { Swiper, SwiperSlide } from 'swiper/vue'
import { useRoute } from 'vue-router'

import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'

// Get project ID from route
const route = useRoute()
const projectId = route.params.id

// Format number
const formatNumber = (val) => Number(val).toLocaleString()

// Swiper cards - will update later with API values
const swiperItems = ref([])
const totalFunding = ref(0)
const totalExpenses = ref(0)

// Contributors, Contributions, Expenses
const contributors = ref([])
const contributions = ref([])
const expenses = ref([])
const projectDetails = ref({
  id: '',
  name: '',
  bid_amount: 0,
  balance: 0,
  total_contributors: 0,
})

// Funding Chart
const fundingChart = ref({
  series: [0, 0], // Funding %, Spending %
  options: {
    chart: {
      height: 230,
      type: 'radialBar',
    },
    plotOptions: {
      radialBar: {
        offsetY: 0,
        startAngle: 0,
        endAngle: 270,
        hollow: {
          margin: 5,
          size: '30%',
        },
        dataLabels: {
          name: { show: false },
          value: {
            fontSize: '18px',
            formatter: (val) => `${val}%`,
          },
        },
      },
    },
    colors: ['#0d6efd', '#dc3545'], // Funding = blue, Spending = red
    labels: ['Funding', 'Spending'],
    legend: { show: false },
  },
})

// Fetch project report
const fetchProjectReport = async () => {
  const endpoint = `/v1/project/report/project/1`

  const {
    data: reportData,
    request: fetchReport,
    error: reportError,
  } = useApi(endpoint, {
    method: 'GET',
    autoFetch: true,
    autoAlert: false,
  })

  await fetchReport()

  if (reportData.value?.dataPayload?.data) {
    const d = reportData.value.dataPayload.data

    totalFunding.value = Number(d.total_contributions)
    totalExpenses.value = Number(d.allocated_expenses)

    projectDetails.value = {
      id: d.project_id,
      name: d.project_name,
      bid_amount: Number(d.bid_amount),
      balance: Number(d.balance),
      total_contributors: Number(d.total_contributors),
    }
    // Prepare swiper cards
    swiperItems.value = [
      {
        subTitle: 'Project Bid Amount',
        amount: Number(d.bid_amount),
        icon: 'file-invoice-dollar',
        color: 'info',
      },
      {
        subTitle: 'Total Expenses',
        amount: Number(d.allocated_expenses),
        icon: 'receipt',
        color: 'danger',
      },
      {
        subTitle: 'Total Contributions',
        amount: Number(d.total_contributions),
        icon: 'donate',
        color: 'success',
      },
      {
        subTitle: 'Total Contributors',
        amount: Number(d.total_contributors),
        icon: 'users',
        color: 'primary',
      },
    ]

    // Funding chart values (convert to percentages safely)
    const bidAmount = Number(d.bid_amount) || 1
    const fundingPercent = Math.round((Number(d.total_contributions) / bidAmount) * 100)
    const spendingPercent = Math.round((Number(d.allocated_expenses) / bidAmount) * 100)
    fundingChart.value.series = [fundingPercent, spendingPercent]

    // Set contributors list
    contributors.value = (d.contributors || []).map((f) => ({
      name: f.financier_name,
      totalAmount: Number(f.total_contribution).toLocaleString(),
    }))

    // Contributions list
    contributions.value = (d.contributions || []).map((c) => {
      const contributor = c.financier_name || 'N/A'
      const initials = contributor
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()

      return {
        contributor,
        expense: c.expense_name,
        amount: Number(c.amount),
        date: new Date(c.created_at * 1000), // Convert from seconds to ms
        initials,
      }
    })

    // Expenses summary (optional: fake until backend supports it)
    expenses.value = (d.expenses || []).map((e) => ({
      title: e.expense_name,
      total: Number(e.allocated_amount),
      contributed: Number(e.contributed_amount),
      color: 'info',
    }))
  } else {
    console.warn('Failed to load project report:', reportError.value)
  }
}

onMounted(fetchProjectReport)
</script>
<template>
  <div class="row">
    <div class="col-md-12 col-lg-12">
      <b-card
        class="p-4 mb-4 border-0 text-white"
        style="
          background:
            linear-gradient(rgba(0, 123, 255, 0.9), rgba(0, 123, 255, 0.9)),
            url('/storage/backgrounds/project-banner.jpg') center/cover no-repeat;
          border-radius: 0.75rem;
        "
      >
        <div class="d-flex align-items-center justify-content-between flex-wrap">
          <!-- Icon + Name -->
          <div class="d-flex align-items-center">
            <!-- Building Icon -->
            <div
              class="rounded-circle bg-white bg-opacity-25 d-flex justify-content-center align-items-center me-3"
              style="width: 60px; height: 60px"
            >
              <font-awesome-icon icon="building" class="text-white fs-3" />
            </div>

            <!-- Project Info -->
            <div>
              <h3 class="mb-1 fw-bold text-white">{{ projectDetails.name }}</h3>
              <p class="mb-0 text-white-50 small">Project ID: #{{ projectDetails.id }}</p>
            </div>
          </div>

          <!-- Status Badge -->
          <b-badge variant="light" class="text-primary px-3 py-2 rounded-pill"> Active </b-badge>
        </div>
      </b-card>

      <Swiper
        :slides-per-view="4"
        :space-between="32"
        navigation
        pagination
        loop
        class="d-slider1"
        style="padding-bottom: 20px"
        :breakpoints="{
          320: { slidesPerView: 1 },
          550: { slidesPerView: 2 },
          991: { slidesPerView: 3 },
          1400: { slidesPerView: 3 },
          1500: { slidesPerView: 4 },
          1920: { slidesPerView: 4 },
          2040: { slidesPerView: 4 },
          2440: { slidesPerView: 4 },
        }"
        :navigation="{
          nextEl: '#blog-tranding-next',
          prevEl: '#blog-tranding-prev',
        }"
      >
        <SwiperSlide v-for="(item, index) in swiperItems" :key="index">
          <b-card :class="`card bg-${item.color}-subtle`">
            <div class="d-flex justify-content-between align-items-center">
              <!-- Icon Section -->
              <div :class="`bg-${item.color}-subtle rounded p-3`">
                <font-awesome-icon :icon="['fas', item.icon]" class="icon-20 text-dark" />
              </div>

              <!-- Counter and Title -->
              <div class="text-end">
                <h4 class="counter">
                  <Vue3autocounter
                    :ref="`counter-${index}`"
                    prefix="KES "
                    separator=""
                    :duration="3"
                    :startAmount="0"
                    :endAmount="parseFloat(item.amount)"
                  />
                </h4>
                <p class="mb-0 text-muted">{{ item.subTitle }}</p>
              </div>
            </div>
          </b-card>
        </SwiperSlide>
      </Swiper>
      <div class="swiper-button swiper-button-next" id="blog-tranding-next"></div>
      <div class="swiper-button swiper-button-prev" id="blog-tranding-prev"></div>
      <span class="swiper-notification" aria-live="assertive" aria-atomic="true"></span>
    </div>

    <div class="col-md-12 col-xl-6">
      <div class="card" data-aos="fade-up" data-aos-delay="1000">
        <div class="card-header d-flex justify-content-between flex-wrap">
          <div class="header-title">
            <h4 class="card-title">Funding vs Spending</h4>
          </div>
          <b-dropdown variant="none px-0 py-0" id="dropdown-1" text="This Month">
            <b-dropdown-item variant="none">This Week</b-dropdown-item>
            <b-dropdown-item variant="none">This Month</b-dropdown-item>
            <b-dropdown-item variant="none">This Year</b-dropdown-item>
          </b-dropdown>
        </div>

        <div class="card-body">
          <div class="d-flex flex-wrap align-items-center justify-content-between">
            <!-- Chart -->
            <apexchart
              :height="230"
              type="radialBar"
              class="col-md-8 col-lg-8 myChart"
              id="myChart1"
              :options="fundingChart.options"
              :series="fundingChart.series"
            />

            <!-- Legend -->
            <div class="d-grid gap col-md-4 col-lg-4">
              <!-- Total Funding -->
              <div class="d-flex align-items-start">
                <svg class="mt-2" xmlns="http://www.w3.org/2000/svg" width="14" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="8" fill="#0d6efd" />
                </svg>
                <div class="ms-3">
                  <span class="text-gray">Total Funding</span>
                  <h6>KES {{ formatNumber(totalFunding) }}</h6>
                </div>
              </div>

              <!-- Total Spending -->
              <div class="d-flex align-items-start">
                <svg class="mt-2" xmlns="http://www.w3.org/2000/svg" width="14" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="8" fill="#dc3545" />
                </svg>
                <div class="ms-3">
                  <span class="text-gray">Total Spending</span>
                  <h6>KES {{ formatNumber(totalExpenses) }}</h6>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <b-col lg="6">
      <b-card no-body>
        <b-card-header class="d-flex justify-content-between">
          <div class="header-title">
            <h4 class="card-title">Project Contributors</h4>
          </div>
        </b-card-header>

        <b-card-body>
          <div
            class="d-flex justify-content-between align-items-center flex-wrap mb-2"
            v-for="(contributor, index) in contributors"
            :key="index"
          >
            <div>
              <h5>{{ contributor.name }}</h5>
              <p>{{ contributor.description }}</p>
            </div>
            <div class="text-end">
              <p>{{ contributor.totalAmount }}</p>
            </div>
          </div>
        </b-card-body>
      </b-card>
    </b-col>

    <div class="col-md-12 col-lg-6">
      <div class="row">
        <div class="col-md-12 col-lg-12">
          <div
            class="overflow-hidden card aos-init aos-animate"
            data-aos="fade-up"
            data-aos-delay="600"
          >
            <!-- Card Header -->
            <div class="flex-wrap card-header d-flex justify-content-between">
              <div class="header-title">
                <h4 class="mb-2 card-title">Project Contributions</h4>
              </div>
            </div>

            <!-- Table -->
            <div class="p-0 card-body">
              <div class="mt-4 table-responsive mb-0" style="max-height: 580px; overflow-y: auto">
                <table id="contributions-table" class="table mb-0 table-striped" role="grid">
                  <thead>
                    <tr>
                      <th>Contributor</th>
                      <th>Expense</th>
                      <th>Amount</th>
                      <th>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(item, index) in contributions" :key="index">
                      <!-- Contributor -->
                      <td>
                        <div class="d-flex align-items-center">
                          <div
                            class="rounded bg-primary-subtle avatar-40 me-3 d-flex justify-content-center align-items-center"
                            style="width: 40px; height: 40px; font-weight: bold"
                          >
                            {{ item.initials }}
                          </div>
                          <h6 class="mb-0">{{ item.contributor }}</h6>
                        </div>
                      </td>

                      <!-- Expense Title -->
                      <td>
                        <div class="text-truncate" style="max-width: 160px">
                          {{ item.expense }}
                        </div>
                      </td>

                      <!-- Amount -->
                      <td>KES {{ item.amount.toLocaleString() }}</td>

                      <!-- Date -->
                      <td>
                        {{
                          new Date(item.date).toLocaleDateString('en-GB', {
                            day: '2-digit',
                            month: 'short',
                            year: 'numeric',
                          })
                        }}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="col-md-12 col-lg-6">
      <div class="row">
        <div class="col-md-12 col-lg-12">
          <div
            class="overflow-hidden card aos-init aos-animate"
            data-aos="fade-up"
            data-aos-delay="600"
          >
            <!-- Card Header -->
            <div class="flex-wrap card-header d-flex justify-content-between">
              <div class="header-title">
                <h4 class="mb-2 card-title">Project Expenses</h4>
              </div>
            </div>

            <!-- Table -->
            <div class="p-0 card-body">
              <div class="mt-4 table-responsive mb-0" style="max-height: 580px; overflow-y: auto">
                <table id="expenses-table" class="table mb-0 table-striped" role="grid">
                  <thead>
                    <tr>
                      <th>Expense</th>
                      <th>Contributed</th>
                      <th>Remaining</th>
                      <th>Progress</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(item, index) in expenses" :key="index">
                      <!-- Expense Title -->
                      <td>
                        <div class="d-flex align-items-center">
                          <div
                            class="rounded bg-primary-subtle img-fluid avatar-40 me-3 d-flex justify-content-center align-items-center text-uppercase fw-bold"
                            style="width: 40px; height: 40px"
                          >
                            {{ item.title.slice(0, 2) }}
                          </div>
                          <h6 class="mb-0">{{ item.title }}</h6>
                        </div>
                      </td>

                      <!-- Amount Contributed -->
                      <td>KES {{ item.contributed.toLocaleString() }}</td>

                      <!-- Remaining Amount -->
                      <td>KES {{ (item.total - item.contributed).toLocaleString() }}</td>

                      <!-- Progress Bar -->
                      <td>
                        <div class="mb-1 d-flex align-items-center">
                          <h6 class="mb-0 me-2">
                            {{
                              item.total > 0
                                ? ((item.contributed / item.total) * 100).toFixed(0)
                                : '0'
                            }}%
                          </h6>
                        </div>
                        <div class="shadow-none progress bg-light" style="height: 4px">
                          <div
                            class="progress-bar"
                            :class="`bg-${item.color}`"
                            role="progressbar"
                            :aria-valuenow="(item.contributed / item.total) * 100"
                            aria-valuemin="0"
                            aria-valuemax="100"
                            :style="`width: ${(item.contributed / item.total) * 100}%; transition: width 2s ease`"
                          />
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
