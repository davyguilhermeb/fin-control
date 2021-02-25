<template>
  <div>
    <div class="months-navigation">
      <div
        :key="i"
        class="month-link"
        @click="setActiveMonth(month)"
        v-for="(month, i) in groupedMonths"
        :class="{active: month.month === activeMonth.month}"
      >
        <div class="month-label">{{ month.month }}</div>
        <div class="value-label" v-money-format="month.total"/>
      </div>
    </div>

    <div class="container-group">
      <div class="container">
        <div v-if="activeMonth.data && !activeMonth.data.length">
          Você não cadastrou nenhum neste mês
        </div>
        <template v-else>
          <expense-list-item
            :key="index"
            :data="item"
            v-for="(item, index) in activeMonth.data"
          />
        </template>
      </div>
    </div>
  </div>
</template>

<script>
import moment from 'moment'
import groupBy from 'lodash.groupby'
import ExpenseListItem from './ExpenseListItem'

export default {
  components: { ExpenseListItem },
  name: 'ListarGastos',
  data: () => ({
    expenses: [],
    activeMonth: {},

  }),
  created () {
    this.getData()
  },
  mounted() {
    this.setActiveMonth()
  },
  computed: {
    //AGRUPAMENTO AGRUPAMENTO AGRUPAMENTO AGRUPAMENTO AGRUPAMENTO POR DAATAAA
    groupedMonths () {
      let groupedMonths = []

      const addCurrentMonth = () => {
        groupedMonths.push({
          data: [],
          total: 0,
          month: moment().format('MM/YYYY')
        })
      }
      if (this.expenses.length) {
        const months = groupBy(this.expenses, i => (
          moment(i.createdAt).format('MM/YYYY')
        ))

        const sortedMonths = Object.keys(months).sort((a, b) => {
          if (moment(`${a} 01`, 'MM/YYYY HH').isBefore(moment(`${b} 01`, 'MM/YYYY HH'))) {
            return -1
          } else {
            return +1
          }
        })

        groupedMonths =  sortedMonths.map(month => ({
          month,
          data: months[month],
          total: months[month].map(i => +i.value).reduce((a, c) => a + c, 0)
        }))

        const lastMonth = moment(groupedMonths[groupedMonths.length - 1].month, 'MM/YYYY')

        if (!lastMonth.isSame(moment(), 'month')) {
          addCurrentMonth()
        }

      } else {
        addCurrentMonth()
      }

      return groupedMonths
    }
  },
  methods: {
   getData () {
     const ref = this.$firebase.database().ref(`/${window.uid}`)

     ref.on('value', snapshot => {
       const values = snapshot.val()
       this.expenses = Object.keys(values).map(i => values[i])
     })
   },
   setActiveMonth (month = null) {
     //ERA: //this.activeMonth = this.groupedMonths[this.groupedMonths.length - 1]
     //virou ternario:
     //this activeMonth vai ser igual a
     //se recebeu month (month nao for nulo), o valor recebido
     //se nao, o mes atual/ultimo mes
     this.activeMonth = month ? month : this.groupedMonths[this.groupedMonths.length - 1]
     //podia ser
     //this.activeMonth = month || this.groupedMonths[this.groupedMonths.length - 1]
    console.log(this.activeMonth.data)

   }

 }
}
</script>

<style scoped lang="scss">
.months-navigation {
  display: flex;
  width: calc(100% + 30px);
  margin-left: -15px;
  background-color: var(--featured-dark);
  .month-link {
    padding: 15px;
    cursor: pointer;
    transition: 0.4s;
    text-align: center;
    &:hover {
      background-color: var(--featured);
    }
    &.active {
      background-color: var(--featured);
    }
    .value-label {
      color: var(--darker);
      font-size: 8pt;
    }
  }
}

.container {
  font-size: 15pt;
  padding-top: 15px;
  padding-bottom: 15px;
}
</style>
