<script setup>
import { ref } from 'vue'

import Vue3autocounter from 'vue3-autocounter'
import AnalyticsWidget from '../../components/organisms/AnalyticsWidget.vue'

const fetchReport = async () => {
  const endpoint = `v1/project/report/summary`

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

  console.log('Report Data:', reportData.value)
}

const lastContribution = ref({
  contributor: 'Equity Bank',
  avatar: 'https://via.placeholder.com/100x100.png?text=EQ', // Replace with real image
  project: 'Nairobi Affordable Housing',
  expense: 'Building Materials',
  date: '2025-09-10',
  amount: 5855600,
})

// Sample mock data (will come from API later)
const dashboardMetrics = {
  totalContributed: 7850000,
  plannedBudget: 10000000,
  totalExpenses: 8,
  lastUpdated: '2 hours ago',
}
// Bar chart for contributions
const dashboardCharts = {
  contributions: {
    series: [
      {
        name: 'Contributions',
        data: [500000, 1200000, 1100000, 2000000, 1500000],
      },
    ],
    options: {
      chart: {
        type: 'bar',
        height: 120,
        toolbar: { show: false },
      },
      plotOptions: {
        bar: {
          columnWidth: '45%',
          borderRadius: 4,
        },
      },
      colors: ['#2dce89', '#5e72e4'],
      xaxis: {
        categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
      },
      dataLabels: { enabled: false },
      legend: { show: false },
    },
  },
}

const totalFunding = 2500000
const totalSpending = 1500000
const total = totalFunding + totalSpending

const fundingChart = ref({
  series: [Math.round((totalFunding / total) * 100), Math.round((totalSpending / total) * 100)],
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
          name: {
            show: false,
          },
          value: {
            fontSize: '18px',
            formatter: (val) => `${val}%`,
          },
        },
      },
    },
    colors: ['#0d6efd', '#dc3545'], // Funding = blue, Spending = red
    labels: ['Funding', 'Spending'],
    legend: {
      show: false,
    },
  },
})

const formatNumber = (val) => Number(val).toLocaleString()

const activityLogs = ref([
  {
    amount: 2400000,
    expense: 'Land Purchase',
    contributor: 'Equity Bank',
    project: 'Kibera Housing',
    date: '2025-09-10T20:10:00Z',
  },
  {
    amount: 150000,
    expense: 'Licensing',
    contributor: 'NCBA',
    project: 'Machakos Expansion',
    date: '2025-09-09T23:00:00Z',
  },
])

const contributionGrowth = ref(16)

function formatAmount(amount) {
  return new Intl.NumberFormat('en-KE').format(amount)
}

function formatDate(dateStr) {
  const date = new Date(dateStr)
  return `${date.toLocaleDateString()} at ${date.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  })}`
}

const projects = [
  {
    id: 1,
    name: 'Affordable Housing Phase 1',
    avatar: '/assets/images/shapes/01.png',
    contributors: [
      { name: 'Equity Bank', initials: 'EB' },
      { name: 'HF Group', initials: 'HF' },
    ],
    expense: 10000000,
    contribution: 8000000,
  },
  {
    id: 2,
    name: 'Smart Water Grid',
    avatar: '/assets/images/shapes/02.png',
    contributors: [{ name: 'County Govt', initials: 'CG' }],
    expense: 4000000,
    contribution: 4000000,
  },
]

// Compute contribution % per project
projects.forEach((project) => {
  const percent = (project.contribution / project.expense) * 100
  project.contributionPercent = Math.round(percent)
})
onMounted(fetchReport)
</script>
<template>
  <div class="d-flex justify-content-between align-items-center flex-wrap mb-4 gap-3">
    <div class="d-flex flex-column">
      <h3>Quick Insights</h3>
      <p class="text-primary mb-0">Financial Dashboard</p>
    </div>
  </div>
  <b-row>
    <b-col lg="3" md="6">
      <b-card class="card-block card-stretch card-height">
        <div class="d-flex align-items-start justify-content-between mb-2">
          <p class="mb-0 text-dark">Total Contributions</p>
          <b-badge
            tag="a"
            variant="bg-primary-subtle"
            class="badge rounded-pill"
            href="javascript:void(0);"
          >
            View
          </b-badge>
        </div>
        <div class="mb-3">
          <h2 class="counter text-success">
            <Vue3autocounter
              ref="contributionCounter"
              separator=","
              prefix="KES "
              :duration="3"
              :startAmount="0"
              :endAmount="dashboardMetrics.totalContributed"
            />
          </h2>
          <small>Updated {{ dashboardMetrics.lastUpdated }}</small>
        </div>
        <div>
          <apexchart
            height="100%"
            type="bar"
            :options="dashboardCharts.contributions.options"
            :series="dashboardCharts.contributions.series"
          />
        </div>
      </b-card>
    </b-col>

    <b-col lg="3" md="6">
      <b-row class="row">
        <!-- Total Expenses -->
        <b-col cols="12">
          <analytics-widget
            title="Total Expenses"
            :amount="dashboardMetrics.totalExpenses"
            description="Registered under this project"
            icon="box"
            button-text="View"
          />
        </b-col>

        <!-- Total Budget -->
        <b-col cols="12">
          <analytics-widget
            prefix="KES "
            title="Planned Budget"
            :amount="dashboardMetrics.plannedBudget"
            description="Project Bid Amount"
            icon="file-invoice-dollar"
            button-text="View"
          />
        </b-col>
      </b-row>
    </b-col>

    <b-col lg="6" md="12">
      <b-card class="shadow-sm border-0">
        <b-badge
          tag="a"
          variant=" bg-primary-subtle"
          class="badge rounded-pill"
          href="javascript:void(0);"
        >
          Last Transaction
        </b-badge>
        <b-row>
          <!-- LEFT: Contributor Profile + Title -->
          <b-col
            md="4"
            class="d-flex flex-column align-items-center justify-content-center text-center p-4 border-end"
          >
            <!-- Avatar -->
            <img
              :src="lastContribution.avatar"
              alt="contributor"
              class="rounded-circle shadow avatar-100 mb-3 bg-light"
              style="object-fit: cover"
            />

            <!-- Name -->
            <h5 class="mb-1 text-dark">{{ lastContribution.contributor }}</h5>

            <!-- Label -->
            <p class="text-muted mb-2">Financier</p>

            <!-- Date -->
            <b-badge variant="primary-subtle" pill>{{ lastContribution.date }}</b-badge>
          </b-col>

          <!-- RIGHT: Contribution Details -->
          <b-col md="8" class="p-4">
            <!-- Amount -->
            <div class="mb-4">
              <h6 class="text-muted mb-1">Amount Contributed</h6>
              <h2 class="text-dark">
                <Vue3autocounter
                  ref="counter"
                  separator=","
                  prefix="KES "
                  :duration="3"
                  :startAmount="0"
                  :endAmount="lastContribution.amount"
                />
              </h2>
            </div>

            <!-- Project & Expense Info -->
            <div class="row">
              <!-- Project -->
              <div class="col-sm-6 mb-3">
                <div class="d-flex align-items-start gap-3">
                  <div
                    class="bg-info-subtle avatar-50 rounded d-flex align-items-center justify-content-center"
                  >
                    <font-awesome-icon icon="building" size="lg" class="text-info" />
                  </div>
                  <div>
                    <p class="mb-1 text-muted">Project</p>
                    <h6 class="mb-0 text-body">{{ lastContribution.project }}</h6>
                  </div>
                </div>
              </div>

              <!-- Expense -->
              <div class="col-sm-6 mb-3">
                <div class="d-flex align-items-start gap-3">
                  <div
                    class="bg-success-subtle avatar-50 rounded d-flex align-items-center justify-content-center"
                  >
                    <font-awesome-icon icon="box" size="lg" class="text-success" />
                  </div>
                  <div>
                    <p class="mb-1 text-muted">Expense</p>
                    <h6 class="mb-0 text-body">{{ lastContribution.expense }}</h6>
                  </div>
                </div>
              </div>
            </div>

            <!-- Optional Footer -->
            <div class="mt-3 d-flex justify-content-end">
              <b-button variant="soft-primary" size="sm"> View Full Report </b-button>
            </div>
          </b-col>
        </b-row>
      </b-card>
    </b-col>
    <b-col lg="8" md="12">
      <div class="col-md-12 col-lg-12">
        <div class="overflow-hidden card" data-aos="fade-up" data-aos-delay="600">
          <div class="flex-wrap card-header d-flex justify-content-between">
            <div class="header-title">
              <h4 class="mb-2 card-title">Projects Financial Overview</h4>
              <p class="mb-0">
                <svg class="me-2 text-primary" width="24" height="24" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M21,7L9,19L3.5,13.5L4.91,12.09L9,16.17L19.59,5.59L21,7Z"
                  ></path>
                </svg>
                Insights from latest project contributions
              </p>
            </div>
          </div>

          <div class="p-0 card-body">
            <div class="mt-4 table-responsive mb-0" style="max-height: 580px; overflow-y: auto">
              <table id="projects-table" class="table mb-0 table-striped" role="grid">
                <thead>
                  <tr>
                    <th>PROJECT</th>
                    <th>CONTRIBUTORS</th>
                    <th>TOTAL EXPENSE</th>
                    <th>CONTRIBUTION %</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="project in projects" :key="project.id">
                    <!-- PROJECT NAME + AVATAR -->
                    <td>
                      <div class="d-flex align-items-center">
                        <img
                          class="rounded bg-primary-subtle img-fluid avatar-40 me-3"
                          :src="project.avatar"
                          alt="project"
                        />
                        <h6>{{ project.name }}</h6>
                      </div>
                    </td>

                    <!-- CONTRIBUTORS -->
                    <td>
                      <div class="iq-media-group iq-media-group-1">
                        <a
                          v-for="(contributor, idx) in project.contributors"
                          :key="idx"
                          href="#"
                          class="iq-media-1"
                        >
                          <div class="icon iq-icon-box-3 rounded-pill me-1">
                            {{ contributor.initials }}
                          </div>
                        </a>
                      </div>
                    </td>

                    <!-- EXPENSE -->
                    <td>KES {{ formatAmount(project.expense) }}</td>

                    <!-- CONTRIBUTION PERCENTAGE -->
                    <td>
                      <div class="mb-2 d-flex align-items-center">
                        <h6>{{ project.contributionPercent }}%</h6>
                      </div>
                      <div class="shadow-none progress bg-primary-subtle w-100" style="height: 4px">
                        <div
                          class="progress-bar"
                          :class="project.contributionPercent >= 100 ? 'bg-success' : 'bg-primary'"
                          role="progressbar"
                          :style="{ width: project.contributionPercent + '%' }"
                          :aria-valuenow="project.contributionPercent"
                          aria-valuemin="0"
                          aria-valuemax="100"
                        ></div>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </b-col>
    <b-col lg="4" md="12">
      <div class="col-md-12 col-lg-12">
        <b-card no-body class="aos-init aos-animate" data-aos="fade-up" data-aos-delay="600">
          <!-- Header -->
          <b-card-header class="d-flex justify-content-between flex-wrap">
            <div class="header-title">
              <h4 class="mb-2 card-title">Activity Overview</h4>
              <p class="mb-0 d-flex align-items-center">
                <svg class="me-2" width="24" height="24" viewBox="0 0 24 24">
                  <path
                    fill="#17904b"
                    d="M13,20H11V8L5.5,13.5L4.08,12.08L12,4.16L19.92,12.08L18.5,13.5L13,8V20Z"
                  ></path>
                </svg>
                {{ contributionGrowth }}% this month
              </p>
            </div>
          </b-card-header>

          <!-- Body -->
          <b-card-body style="max-height: 600px; overflow-y: auto">
            <div
              v-for="(activity, index) in activityLogs"
              :key="index"
              class="mb-3 d-flex profile-media align-items-top"
            >
              <div class="mt-1 profile-dots-pills border-primary"></div>
              <div class="ms-4">
                <h6 class="mb-1">
                  <span class="fw-bold">KES {{ formatAmount(activity.amount) }}</span
                  >,
                  <span class="text-muted">{{ activity.expense }}</span>
                </h6>
                <small class="text-muted">
                  {{ formatDate(activity.date) }} – by {{ activity.contributor }} for
                  <strong>{{ activity.project }}</strong>
                </small>
              </div>
            </div>
          </b-card-body>
        </b-card>
      </div>
    </b-col>
  </b-row>
</template>
