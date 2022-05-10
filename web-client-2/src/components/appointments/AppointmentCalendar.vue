<template>
    <loading-icon v-if="isLoading" size="3x"/>
    <div style="position: relative">
        <div style="position: absolute; width: 100%" :class="(!!errorText) ?  'blur' : ''">
            <Calendar :attributes="attributes" :first-day-of-week="2" :theme-styles="themeStyles" class="max-w-full bg-light" :masks="masks" is-expanded>
                <template #day-popover="{ dayTitle, attributes }">
                    <div>
                        <div class="text-xs text-gray-300 font-semibold text-center">
                            {{ dayTitle }}
                        </div>
                        <popover-row
                            v-for="attr in attributes"
                            :key="attr.key"
                            :attribute="attr">
                            <b>{{attr.customData.name}}:</b> {{ attr.customData.description }} <button class="btn btn-info px-1 py-0 mx-2" style="font-size: 1em;" v-b-modal.appmntInfoModal @click="selectedAppmnt=attr.customData">Open</button>
                        </popover-row>
                    </div>
                </template>
            </Calendar>
        </div>
        <error-text v-if="!!errorText" v-bind:msg="errorText" style="position: absolute; top: 20px; right: 50%; transform: translate(50%, 0%);"/>
    </div>
    <appmnt-info @onChange="loadAppointments" :appointment="selectedAppmnt" />
</template>

<script>
    import { sha512 } from "js-sha512"
    import {Calendar, PopoverRow} from "v-calendar"
    import ErrorText from "../helpers/ErrorText.vue"
    import LoadingIcon from "../helpers/LoadingIcon.vue"
    import AppmntInfo from "./AppmntInfo.vue"
    export default {
        name: "AppointmentCalendar",
        emits: ["update"],
        components: {
            Calendar,
            ErrorText,
            LoadingIcon,
            PopoverRow,
            AppmntInfo
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
                },
                attributes: [],
                colors: ['gray', 'red', 'orange', 'yellow', 'green', 'teal', 'blue', 'indigo', 'purple', 'pink'],
                appointmentList: [],
                isLoading: false,
                errorText: "",
                selectedAppmnt: {}
            }
        },
        methods: {
            loadAppointments () {
                this.isLoading = true
                this.errorText = ""
                this.$store.dispatch("getAppointmentList").then(res => {
                    this.isLoading = false
                    this.appointmentList = res.data
                    this.generateAttributes()
                }).catch(err => {
                    this.isLoading = false
                    console.log(err)
                    this.errorText = err
                })
            },
            generateAttributes () {
                this.appointmentList.sort((a, b) => {return new Date(a.date) - new Date(b.date)})
                this.attributes = []
                for (var a of this.appointmentList) {
                    var attr = {
                        key: a.id,
                        dates: {
                            start: new Date(a.date),
                            end: new Date(a.end_date)
                        },
                        popover: true,
                        customData: a,
                        order: this.areSameDate(new Date(a.date), new Date(a.end_date)) ? 1 : 0
                    }
                    
                    if (this.useDot(a.date, a.end_date)) {
                        attr.dot = this.colors[this.idToColorIndex(sha512(a.id))]
                    } else {
                        attr.highlight = this.colors[this.idToColorIndex(sha512(a.id))]
                    }

                    this.attributes.push(attr)
                }
            },
            useDot (date, end_date) { // check if appointment needs to be represented by dot because there is already an appointment on that date
                for (var i of this.attributes) {
                    if (this.areSameDate(new Date(date), i.dates.start) || this.areSameDate(new Date(end_date), i.dates.end))
                        return true
                    if (i.dates.start < date && i.dates.end > end_date)
                        return true
                }
                return false
            },
            areSameDate (dateA, dateB) {
                return dateA.toDateString() == dateB.toDateString()
            },
            idToColorIndex (id) {
                var i = 0;
                for (var j = 1; j < 9; j++)
                    i += id.charCodeAt(j)
                return i % this.colors.length
            },
        },
    }
</script>

<style lang="postcss" scoped>
    .blur {
        filter: blur(5px)
    }

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