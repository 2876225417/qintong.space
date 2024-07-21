<template>
  <div class="wrapper">
    <div class="block">
      <div class="cal">
        <div class="cal__item month">{{ month }}</div>
        <div class="cal__item day">{{ day }}</div>
        <div class="cal__item year">{{ year }}</div>
      </div>
      <div class="timer">
        <div class="timer__item sec"></div>
        <div class="timer__item min"></div>
        <div class="timer__item hour"></div>
      </div>
    </div>
    <div class="message">
      <span class="label day">{{ day }}</span> of
      <span class="label month">{{ month }}</span> at
      <span id="time" class="label">{{ hour }}:{{ min }}</span>
    </div>
  </div>
</template>

<script>
import { TweenMax, Elastic } from 'gsap';

export default {
  data() {
    const monthNames = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    const today = new Date();
    const getMonth = monthNames[today.getMonth()];
    const getHours = today.getHours();
    const getMinutes = today.getMinutes();

    return {
      type: 'meeting',
      day: today.getDate(),
      month: getMonth.substr(0, 3),
      year: today.getFullYear(),
      hour: (getHours >= 0 && getHours < 10) ? "0" + getHours : getHours + "",
      min: (getMinutes >= 0 && getMinutes < 10) ? "0" + getMinutes : getMinutes + ""
    };
  },
  mounted() {
    this.updateTime();
    setInterval(this.updateTime, 1000);
  },
  methods: {
    updateTime() {
      const hourHand = this.$el.querySelector('.timer .hour');
      const minuteHand = this.$el.querySelector('.timer .min');
      const secondHand = this.$el.querySelector('.timer .sec');

      const timeNow = new Date();
      const seconds = timeNow.getSeconds();
      const minutes = timeNow.getMinutes();
      const hours = timeNow.getHours();

      const secondHandFullCircles = Math.floor(seconds / 60);
      const secondsWithCircles = seconds + (secondHandFullCircles * 60);

      if (hours === 0 && minutes === 0) this.updateDate();

      TweenMax.to(hourHand, 0.8, { rotation: 30 * hours, ease: Elastic.easeOut });
      TweenMax.to(minuteHand, 0.8, { rotation: 6 * minutes, ease: Elastic.easeOut });
      TweenMax.to(secondHand, 0.8, { rotation: 6 * secondsWithCircles, ease: Elastic.easeOut });

      this.hour = this.addZero(hours);
      this.min = this.addZero(minutes);
    },
    updateDate() {
      const timeNow = new Date();
      const day = this.addZero(timeNow.getDate());
      const month = timeNow.toLocaleString('en-US', { month: 'short' });
      const year = timeNow.getFullYear();

      this.day = day;
      this.month = month;
      this.year = year;
    },
    addZero(num) {
      return (num >= 0 && num < 10) ? "0" + num : num + "";
    }
  }
};
</script>

<style lang="scss">
@import url('https://fonts.googleapis.com/css?family=Montserrat:400,700');

$color__gray--light: #E5E6E7;
$color__gray: #7C8BA4;
$color__gray--dark: #323a44;
$color__red: #E74C3C;
$color__green: #65AB09;
$color__blue: #0099ff;

$calendar__width: 150px;  // 调整宽度
$calendar__border-width: 8px;  // 调整边框宽度

$timer__width: $calendar__width / 3;
$timer__pointer-width: 6px;

$global__border-radius: 35px;  // 调整边框半径

*,
*:before,
*:after {
  box-sizing: border-box;
}

body,
html {
  font-family: 'Montserrat', sans-serif;
  font-size: 100%;
  color: $color__gray--dark;
  width: 100%;
  height: 100%;
  padding: 0;
}

.wrapper {
  width: $calendar__width;
  height: 200px;  // 调整高度
  display: inline-block;  // 使用 inline-block 以便在 header 中正确定位
  vertical-align: middle;

  .block {
    width: $calendar__width;
    height: $calendar__width;
    position: relative;

    .cal {
      width: $calendar__width;
      height: $calendar__width;
      border: $calendar__border-width solid $color__gray--light;
      border-radius: $global__border-radius;
      text-align: center;

      .cal__item {
        width: 100%;
        position: absolute;
        left: 50%;
        transform: translateX(-50%);

        &.month {
          top: 10px;
          color: $color__gray--light;
          font-size: 20px;  // 调整字体大小
          text-transform: uppercase;
        }

        &.day {
          font-size: 90px;  // 调整字体大小
          top: 50%;
          transform: translate(-50%, -50%);
        }

        &.year {
          bottom: 15px;
          color: $color__gray;
          font-size: 10px;  // 调整字体大小
        }
      }
    }

    .timer {
      width: $timer__width;
      height: $timer__width;
      position: absolute;
      bottom: -$timer__width / 3;
      right: -$timer__width / 3;
      border: $timer__pointer-width solid $color__gray--dark;
      background: white;
      border-radius: 50%;
      box-shadow: 0 0 0 12px white;
      transform: rotate(-90deg);

      .timer__item {
        position: absolute;
        top: 50%;
        left: 50%;
        background: $color__gray--dark;
        border-radius: $global__border-radius;

        &.sec {
          width: 40%;
          height: $timer__pointer-width / 3;
          margin-top: -$timer__pointer-width / 3 / 2;
          margin-left: -$timer__pointer-width / 3 / 2;
          transform-origin: $timer__pointer-width / 3 / 2 $timer__pointer-width / 3 / 2;
          background: $color__red;
        }

        &.min {
          width: 40%;
          height: $timer__pointer-width;
          margin-top: -$timer__pointer-width / 2;
          margin-left: -$timer__pointer-width / 2;
          transform-origin: $timer__pointer-width / 2 $timer__pointer-width / 2;
        }

        &.hour {
          width: 25%;
          height: $timer__pointer-width;
          margin-top: -$timer__pointer-width / 2;
          margin-left: -$timer__pointer-width / 2;
          transform-origin: $timer__pointer-width / 2 $timer__pointer-width / 2;
        }
      }
    }
  }

  .message {
    margin-top: $timer__width / 2.5;
    font-size: 10px;  // 调整字体大小
    text-align: center;
    line-height: 1.5em;  // 调整行高

    .label {
      background: $color__blue;
      color: #fff;
      font-weight: bold;
      padding: 2px 4px;  // 调整内边距
      border-radius: $global__border-radius;

      &.type {
        background: $color__green;
      }

      &.month {
        text-transform: uppercase;
      }
    }
  }
}
</style>
