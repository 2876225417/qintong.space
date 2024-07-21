<template>
  <div class="container">
    <div class="clippings">
      <div class="rings" v-for="n in 10" :key="n"></div>
    </div>
    <transition name="page-flip">
      <div class="front-page page" v-if="current === 'front-page'">
        <div class="holes">
          <div class="hole" v-for="n in 10" :key="n"></div>
        </div>
        <div class="content">
          <div class="header">
            <h2>
              <div class="btn prev-btn" title="prev" @click="goPrevMonth"></div>
              {{ frontPageMonth }}
              <div class="btn next-btn" title="next" @click="goNextMonth"></div>
            </h2>
            <h2>
              <div class="btn prev-btn" title="prev" @click="goPrevYr"></div>
              {{ frontPageYear }}
              <div class="btn next-btn" title="next" @click="goNextYr"></div>
            </h2>
          </div>
          <table class="dates">
            <tbody>
            <tr class="weeks">
              <th v-for="(day, idx) in dayNames" :key="idx" :class="{'dname': true, 'holiday': idx === 0}">
                {{ day }}
              </th>
            </tr>
            <tr v-for="(week, wIdx) in calendarDays" :key="wIdx">
              <td v-for="(day, dIdx) in week" :key="dIdx" :class="{'date': true, 'holiday': dIdx === 0, 'today': isToday(day, month, year)}">
                {{ day }}
              </td>
            </tr>
            </tbody>
          </table>
        </div>
      </div>
    </transition>
    <transition name="page-flip">
      <div class="back-page page" v-if="current === 'back-page'">
        <div class="holes">
          <div class="hole" v-for="n in 10" :key="n"></div>
        </div>
        <div class="content">
          <div class="header">
            <h2>
              <div class="btn prev-btn" title="prev" @click="goPrevMonth"></div>
              {{ backPageMonth }}
              <div class="btn next-btn" title="next" @click="goNextMonth"></div>
            </h2>
            <h2>
              <div class="btn prev-btn" title="prev" @click="goPrevYr"></div>
              {{ backPageYear }}
              <div class="btn next-btn" title="next" @click="goNextYr"></div>
            </h2>
          </div>
          <table class="dates">
            <tbody>
            <tr class="weeks">
              <th v-for="(day, idx) in dayNames" :key="idx" :class="{'dname': true, 'holiday': idx === 0}">
                {{ day }}
              </th>
            </tr>
            <tr v-for="(week, wIdx) in calendarDays" :key="wIdx">
              <td v-for="(day, dIdx) in week" :key="dIdx" :class="{'date': true, 'holiday': dIdx === 0, 'today': isToday(day, month, year)}">
                {{ day }}
              </td>
            </tr>
            </tbody>
          </table>
        </div>
      </div>
    </transition>
  </div>
</template>


<script>
export default {
  name: 'CalendarVue',
  data() {
    const todayDate = new Date();
    const today = `${todayDate.getDate()}/${todayDate.getMonth() + 1}/${todayDate.getFullYear()}`;
    return {
      current: 'front-page',
      prev: 'back-page',
      month: todayDate.getMonth() + 1,
      year: todayDate.getFullYear(),
      today,
      monthNames: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
      dayNames: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
      calendarDays: []
    };
  },
  computed: {
    frontPageMonth() {
      return this.monthNames[this.month - 1];
    },
    frontPageYear() {
      return this.year;
    },
    backPageMonth() {
      let month = this.month === 12 ? 1 : this.month + 1;
      return this.monthNames[month - 1];
    },
    backPageYear() {
      return this.month === 12 ? this.year + 1 : this.year;
    }
  },
  methods: {
    isToday(d, m, y) {
      return `${d}/${m}/${y}` === this.today;
    },
    getCalendar(m, y) {
      const lp = (y % 4 === 0 && y % 100 !== 0) || y % 400 === 0;
      const daysOfMonth = [31, lp ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
      let dayOf1st = (y + Math.floor((y - 1) / 4) - Math.floor((y - 1) / 100) + Math.floor((y - 1) / 400)) % 7;
      for (let x = 1; x < m; x++) {
        dayOf1st = (dayOf1st + daysOfMonth[x - 1]) % 7;
      }
      const numOfWeeks = Math.ceil((dayOf1st + daysOfMonth[m - 1]) / 7);
      const blacksInLastWeek = numOfWeeks * 7 - (dayOf1st + daysOfMonth[m - 1]);
      const days = [];
      for (let i = 0; i < numOfWeeks; i++) {
        days.push([]);
        if (i === 0) {
          for (let j = 0; j < dayOf1st; j++) days[i].push(' ');
          for (let j = 1; j <= (7 - dayOf1st); j++) days[i].push(j);
        } else if (i === numOfWeeks - 1) {
          for (let j = i * 7 - dayOf1st + 1; j <= daysOfMonth[m - 1]; j++) days[i].push(j);
          for (let j = 0; j < blacksInLastWeek; j++) days[i].push(' ');
        } else {
          for (let j = i * 7 - dayOf1st + 1; j <= (i + 1) * 7 - dayOf1st; j++) days[i].push(j);
        }
      }
      return days;
    },
    drawCalendar(m, y) {
      this.calendarDays = this.getCalendar(m, y);
    },
    goNextMonth() {
      if (this.month < 12) this.month++;
      else {
        this.year++;
        this.month = 1;
      }
      this.goNext();
    },
    goPrevMonth() {
      if (this.month > 1) this.month--;
      else {
        this.year--;
        this.month = 12;
      }
      this.goPrev();
    },
    goNextYr() {
      this.year++;
      this.goNext();
    },
    goPrevYr() {
      this.year--;
      this.goPrev();
    },
    goNext() {
      this.current = this.current === 'front-page' ? 'back-page' : 'front-page';
      this.drawCalendar(this.month, this.year);
    },
    goPrev() {
      this.current = this.current === 'front-page' ? 'back-page' : 'front-page';
      this.drawCalendar(this.month, this.year);
    }
  },
  mounted() {
    this.drawCalendar(this.month, this.year);
  }
};
</script>


<style scoped>

.page-flip-enter-active,
.page-flip-leave-active {
  transition: transform 1s;
}

.page-flip-enter,
.page-flip-leave-to {
  transform: rotateX(-180deg);
}


body {
  background: white;
}
.container {
  display: flex;
  align-items: center;
  background: white;
  flex-direction: column;
  margin-top: 150px;
}
.clippings,
.holes {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  width: 350px;
  height: 40px;
  position: absolute;
  z-index: 5;
}
.rings {
  width: 20px;
  height: 40px;
  border-radius: 50%;
  border: 10px solid #235;
  transform-origin: 50% 50%;
  transform: skewx(-20deg) rotatey(40deg) translatex(5px);
  border-right: none;
  border-bottom: none;
}
.page {
  width: 400px;
  height: 360px;
  background: #ffe;
  border-radius: 10px;
  position: absolute;
  z-index: 3;
  margin-top: 18px;
  border: 2px solid blue;
  box-shadow: 2px 2px 10px 1px black;
  transform-origin: 50% 0%;
  transform-style: preserve-3d;
}
.hole {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background: #222;
  transform-origin: 50% 50%;
  transform: translatex(20px);
}
@keyframes turn {
  20% {
    transform: rotatex(-72deg) skewx(10deg) translatex(5px);
  }
  40% {
    transform: rotatex(-144deg) skewx(20deg) translatex(8px);
  }
  70% {
    transform: rotatex(-359deg) skewx(2deg) translatex(-1px);
  }
  100% {
    transform: rotatex(-360deg) skewx(0deg) translatex(0px);
  }
}
.front-page {
  z-index: 4;
}
.back-page {
  z-index: 2;
}
.page .content {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 30px;
}
.content .header {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width: 340px;
}
td,
th {
  width: 1.6em;
  text-align: center;
  height: 1.6em;
  font-size: 1.1em;
  margin: 0px 5px;
}
td.today {
  background: indigo;
  color: white;
  font-weight: bold;
  border-radius: 50%;
  box-shadow: 0px 0px 10px -1px indigo;
}
.dname {
  background: #225;
  color: white;
  border-radius: 5px;
  padding: 0px 5px;
}
.holiday {
  color: maroon;
  font-weight: bold;
}
.dname.holiday {
  color: pink;
  background: #522;
}
.btn {
  border: 5px solid indigo;
  width: 8px;
  height: 8px;
  transform-origin: 50% 50%;
  transform: rotateZ(45deg);
  cursor: pointer;
  background: transparent;
  display: inline-block;
}
.next-btn {
  border-left: none;
  border-bottom: none;
}
.prev-btn {
  border-right: none;
  border-top: none;
}
@media (max-width: 400px) {
  .container {
    transform: scale(0.9);
  }
}
@media (max-width: 350px) {
  .container {
    transform: scale(0.8);
  }
}
@media (max-width: 300px) {
  .container {
    transform: scale(0.7);
  }
}
</style>
