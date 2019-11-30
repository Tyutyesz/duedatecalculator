const $form = document.querySelector('form');
const $textInput = document.querySelector('input[type="text"]');
const $span = document.querySelector('span');
const $hourInput = document.querySelector('input[type="number"]');

const Core = {
    resolvedDate: new Date(),
    minutes: undefined,
    workStart: 9,
    workEnd: 17,
    init() {
        Core.addEvents();
        Core.setBaseDates();
    },
    formatDate(date) {
        let minute;
        if (date.getMinutes() < 10) {
            minute = `0${date.getMinutes()}`;
        } else {
            minute = date.getMinutes();
        }
        return `${date.getFullYear()}.${date.getMonth() + 1}.${date.getDate()}.  ${date.getHours()}:${minute}`;
    },
    setBaseDates() {
        this.resolvedDate = new Date();
        $textInput.value = this.formatDate(this.resolvedDate);
    },
    addEvents() {
        $form.addEventListener('submit', Core.calculateDueTime);
    },
    calculateDueTime(e) {
        e.preventDefault();
        Core.setBaseDates();
        Core.minutes = $hourInput.value * 60;
        const setNextWorkDay = (day) => {
            Core.resolvedDate.setDate(Core.resolvedDate.getDate() + day);
            Core.resolvedDate.setHours(Core.workStart);
            Core.resolvedDate.setMinutes(0);
            return Core.resolvedDate;
        };

        const checkHoliday = () => {
            if (Core.resolvedDate.getDay() === 6) {
                setNextWorkDay(2);
            } else if (Core.resolvedDate.getDay() === 0) {
                setNextWorkDay(1);
            }
        };
        const checkFridayEnd = () => {
            if (Core.resolvedDate.getDay() === 5 && Core.resolvedDate.getHours() === Core.workEnd) {
                Core.resolvedDate = setNextWorkDay(3);
            }
        };
        const checkEndDay = () => {
            if (Core.resolvedDate.getHours() === Core.workEnd) {
                Core.resolvedDate = setNextWorkDay(1);
            }
        };
        const addMinute = () => {
            Core.resolvedDate.setMinutes(Core.resolvedDate.getMinutes() + 1);
        };
        checkHoliday();
        const incrementTime = () => {
            for (let i = 0; i < Core.minutes; i += 1) {
                checkFridayEnd();
                checkEndDay();
                addMinute();
            }
            $span.textContent = Core.formatDate(Core.resolvedDate);
        };
        incrementTime();
    },
};

window.addEventListener('load', Core.init);
