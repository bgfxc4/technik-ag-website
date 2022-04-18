<template>
    <Calendar :first-day-of-week="2" :theme-styles="themeStyles" class="max-w-full" :masks="masks" is-expanded>
    </Calendar>
</template>

<script>
    import {Calendar} from "v-calendar"
    export default {
        name: "AppointmentCalendar",
        components: {
            Calendar
        },
        data() {
            const hSpacing = "0"
            return {
                masks: {
                    weekdays: 'WWW',
                },
                themeStyles: {
        wrapper: {
          background: 'linear-gradient(to bottom right, #ff5050, #ff66b3)',
          color: '#fafafa',
          border: '0',
          boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.14), 0 6px 20px 0 rgba(0, 0, 0, 0.13)',
          borderRadius: '5px',
        },
        header: {
          padding: `0 ${hSpacing}`,
        },
        headerHorizontalDivider: {
          borderTop: 'solid rgba(255, 255, 255, 0.2) 1px',
          width: '80%',
        },
        weekdays: {
          padding: `0 ${hSpacing} 0 ${hSpacing}`,
        },
        weeks: {
          padding: `0 ${hSpacing} ${hSpacing} ${hSpacing}`,
        },
      }
            }
        },
    }
</script>

<style lang="postcss" scoped>
    ::-webkit-scrollbar {
        width: 0px;
    }
    ::-webkit-scrollbar-track {
        display: none;
    }
    /deep/ .custom-calendar.vc-container {
        --day-border: 1px solid #a16f23;
        --day-border-highlight: 1px solid #674f83;
        --day-width: 90px;
        --day-height: 90px;
        --weekday-bg: #396591;
        --weekday-border: 1px solid #ad3838;
        border-radius: 0;
        width: 100%;
        & .vc-header {
            background-color: #f1f5f8;
            padding: 10px 0;
        }
        & .vc-weeks {
            padding: 0;
        }
        & .vc-weekday {
            background-color: var(--weekday-bg);
            border-bottom: var(--weekday-border);
            border-top: var(--weekday-border);
            padding: 5px 0;
        }
        & .vc-day {
            padding: 0 5px 3px 5px;
            text-align: left;
            height: var(--day-height);
            min-width: var(--day-width);
            background-color: rgb(163, 52, 52);
            &.weekday-1,
            &.weekday-7 {
                background-color: #eff8ff;
            }
            &:not(.on-bottom) {
                border-bottom: var(--day-border);
                &.weekday-1 {
                    border-bottom: var(--day-border-highlight);
                }
            }
            &:not(.on-right) {
            border-right: var(--day-border);
            }
        }
        & .vc-day-dots {
            margin-bottom: 5px;
        }
    }
</style>