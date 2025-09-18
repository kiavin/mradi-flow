<script setup>
import { ref } from 'vue'

import Vue3autocounter from 'vue3-autocounter'
import AnalyticsWidget from '../../components/organisms/AnalyticsWidget.vue'
import { sum } from 'lodash'
const summaryData = ref({
  totalProjects: 0,
  totalFinanciers: 0,
  totalExpenses: 0,
  totalContributions: 0,
  totalProjectsBid: 0,
  totalContributed: 0,
  lastUpdated: getRelativeTime(new Date()), // ⬅️ relative to now
})

const projects = ref([])

const lastContribution = ref('')
function getRelativeTime(date) {
  const now = new Date()
  const then = new Date(date)
  const diff = Math.floor((now - then) / 1000) // in seconds

  const units = [
    { name: 'year', seconds: 31536000 },
    { name: 'month', seconds: 2592000 },
    { name: 'week', seconds: 604800 },
    { name: 'day', seconds: 86400 },
    { name: 'hour', seconds: 3600 },
    { name: 'minute', seconds: 60 },
    { name: 'second', seconds: 1 },
  ]

  for (const unit of units) {
    if (diff >= unit.seconds) {
      const value = Math.floor(diff / unit.seconds)
      return new Intl.RelativeTimeFormat('en', { numeric: 'auto' }).format(-value, unit.name)
    }
  }

  return 'just now'
}

const fetchReport = async () => {
  const {
    data: reportData,
    request: fetchReport,
    error: reportError,
  } = useApi('v1/project/report/summary', {
    method: 'GET',
    autoFetch: true,
    autoAlert: false,
  })
  await fetchReport()
  summaryData.value.lastUpdated = new Date().toLocaleString()

  const raw = reportData.value?.dataPayload?.data

  if (!raw) {
    console.warn('Missing dashboard data')
    return
  }

  // 🌟 Set dashboard summary metrics
  summaryData.value = {
    totalProjects: Number(raw.total_projects),
    totalExpenses: Number(raw.total_expenses),
    totalFinanciers: Number(raw.total_financiers),
    totalContributions: Number(raw.total_contributions),
    totalProjectsBid: Number(raw.total_bid_amount),
  }


  // 🌟 Format last contribution
  lastContribution.value = {
    contributor: raw.last_contribution?.financier_name || 'N/A',
    avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(
      raw.last_contribution?.financier_name || 'N/A',
    )}&background=0D8ABC&color=fff`,
    project: raw.last_contribution?.project_name || 'N/A',
    expense: raw.last_contribution?.expense_name || 'N/A',
    amount: Number(raw.last_contribution?.amount || 0),
    date: new Date(raw.last_contribution?.created_at * 1000).toISOString(),
  }

  // 🟦 Update funding chart (example logic)
  const funding = Number(raw.total_contributions || 0)
  const spending = Number(raw.total_expenses || 0)
  const total = funding + spending || 1

  fundingChart.value.series = [
    Math.round((funding / total) * 100),
    Math.round((spending / total) * 100),
  ]
  // 🔁 Map `projects`
  if (Array.isArray(raw.projects)) {
    projects.value = raw.projects.map((proj, index) => {
      const bid = Number(proj.bid_amount || 0)
      const expense = Number(proj.sum_expenses || 0)

const percent = (bid === 0 || expense === 0)
  ? 0
  : Math.round((proj.total_contributions / expense) * 100)


      return {
        id: proj.project_id,
        name: proj.project_name,
        avatar: `https://ui-avatars.com/api/` +
        `?name=${encodeURIComponent(proj?.project_name || 'Project')}` +
        `&background=1AA053&color=fff&bold=true&size=128`,
        contributions: proj.total_contributions,
        expense: expense,
        contribution: bid,
        contributionPercent: percent,
      }
    })
  } else {
    console.warn('Expected `projects` to be an array in summary response')
    projects.value = []
  }
}

// const lastContribution = ref({
//   contributor: 'Equity Bank',
//   avatar: 'https://via.placeholder.com/100x100.png?text=EQ', // Replace with real image
//   project: 'Nairobi Affordable Housing',
//   expense: 'Building Materials',
//   date: '2025-09-10',
//   amount: 5855600,
// })

// Sample mock data (will come from API later)

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
              :endAmount="summaryData.totalContributions"
            />
          </h2>
          <small>Updated {{ summaryData.lastUpdated }}</small>
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
            title="Total Project Bids"
            :amount="summaryData.totalProjectsBid"
            description="Registered under this project"
            icon="box"
            button-text="View"
          />
        </b-col>

        <!-- Total Budget -->
        <b-col cols="12">
          <analytics-widget
            prefix="KES "
            title="Total Expenses"
            :amount="summaryData.totalExpenses"
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
                    <th>TOTAL EXPENSE</th>
                    <th>CONTRIBUTIONS</th>
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



                    <!-- EXPENSE -->
                    <td>KES {{ formatAmount(project.expense) }}</td>

                          <!-- CONTRIBUTORS -->
                    <td>
                       <td>KES {{ formatAmount(project.contributions) }}</td>
                    </td>

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
