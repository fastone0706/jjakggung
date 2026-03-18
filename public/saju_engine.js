/**
 * 짝궁 (Jjak-gung) 정밀 만세력 엔진
 * Based on yhj1024/manseryeok logic
 */

const HEAVENLY_STEMS = ['갑', '을', '병', '정', '무', '기', '경', '신', '임', '계'];
const EARTHLY_BRANCHES = ['자', '축', '인', '묘', '진', '사', '오', '미', '신', '유', '술', '해'];
const ELEMENTS_MAP = {
    '갑': '목', '을': '목', '병': '화', '정': '화', '무': '토', 
    '기': '토', '경': '금', '신': '금', '임': '수', '계': '수',
    '인': '목', '묘': '목', '사': '화', '오': '화', '진': '토',
    '술': '토', '축': '토', '미': '토', '신': '금', '유': '금',
    '해': '수', '자': '수'
};

const LUNAR_DATA = [
  0x04bd8, 0x04ae0, 0x0a570, 0x054d5, 0x0d260, 0x0d950, 0x16554, 0x056a0, 0x09ad0, 0x055d2, 0x04ae0,
  0x0a5b6, 0x0a4d0, 0x0d250, 0x1d255, 0x0b540, 0x0d6a0, 0x0ada2, 0x095b0, 0x14977, 0x04970, 0x0a4b0,
  0x0b4b5, 0x06a50, 0x06d40, 0x1ab54, 0x02b60, 0x09570, 0x052f2, 0x04970, 0x06566, 0x0d4a0, 0x0ea50,
  0x06e95, 0x05ad0, 0x02b60, 0x186e3, 0x092e0, 0x1c8d7, 0x0c950, 0x0d4a0, 0x1d8a6, 0x0b550, 0x056a0,
  0x1a5b4, 0x025d0, 0x092d0, 0x0d2b2, 0x0a950, 0x0b557, 0x06ca0, 0x0b550, 0x15355, 0x04da0, 0x0a5b0,
  0x14573, 0x052b0, 0x0a9a8, 0x0e950, 0x06aa0, 0x0aea6, 0x0ab50, 0x04b60, 0x0aae4, 0x0a570, 0x05260,
  0x0f263, 0x0d950, 0x05b57, 0x056a0, 0x096d0, 0x04dd5, 0x04ad0, 0x0a4d0, 0x0d4d4, 0x0d250, 0x0d558,
  0x0b540, 0x0b6a0, 0x195a6, 0x095b0, 0x049b0, 0x0a974, 0x0a4b0, 0x0b27a, 0x06a50, 0x06d40, 0x0af46,
  0x0ab60, 0x09570, 0x04af5, 0x04970, 0x064b0, 0x074a3, 0x0ea50, 0x06b58, 0x055c0, 0x0ab60, 0x096d5,
  0x092e0, 0x0c960, 0x0d954, 0x0d4a0, 0x0da50, 0x07552, 0x056a0, 0x0abb7, 0x025d0, 0x092d0, 0x0cab5,
  0x0a950, 0x0b4a0, 0x0baa4, 0x0ad50, 0x055d9, 0x04ba0, 0x0a5b0, 0x15176, 0x052b0, 0x0a930, 0x07954,
  0x06aa0, 0x0ad50, 0x05b52, 0x04b60, 0x0a6e6, 0x0a4e0, 0x0d260, 0x0ea65, 0x0d530, 0x05aa0, 0x076a3,
  0x096d0, 0x04afb, 0x04ad0, 0x0a4d0, 0x1d0b6, 0x0d250, 0x0d520, 0x0dd45, 0x0b5a0, 0x056d0, 0x055b2,
  0x049b0, 0x0a577, 0x0a4b0, 0x0aa50, 0x1b255, 0x06d20, 0x0ada0, 0x14b63, 0x09370, 0x049f8, 0x04970,
  0x064b0, 0x168a6, 0x0ea50, 0x06b20, 0x1a6c4, 0x0aae0, 0x0a2e0, 0x0d2e3, 0x0c960, 0x0d557, 0x0d4a0,
  0x0da50, 0x05d55, 0x056a0, 0x0a6d0, 0x055d4, 0x052d0, 0x0a9b8, 0x0a950, 0x0b4a0, 0x0b6a6, 0x0ad50,
  0x055a0, 0x0aba4, 0x0a5b0, 0x052b0, 0x0b273, 0x06930, 0x07337, 0x06aa0, 0x0ad50, 0x14b55, 0x04b60,
  0x0a570, 0x054e4, 0x0d160, 0x0e968, 0x0d520, 0x0daa0, 0x16aa6, 0x056d0, 0x04ae0, 0x0a9d4, 0x0a2d0,
  0x0d150, 0x0f252, 0x0d520,
];

const SOLAR_TERM_BASE = [
  5.4055, 20.12, 3.87, 18.73, 5.63, 20.646, 4.81, 20.1, 5.52, 21.04, 5.678, 21.37, 7.108, 22.83,
  7.5, 23.13, 7.646, 23.042, 8.318, 23.438, 7.438, 22.36, 7.18, 21.94,
];

class SajuEngine {
    static getSolarTermDate(year, termIndex) {
        const century = Math.floor(year / 100);
        const yearInCentury = year % 100;
        const termCoeff = 0.2422;
        const leapYearAdjust = Math.floor(yearInCentury / 4) - Math.floor(century / 4);
        const day = Math.floor(SOLAR_TERM_BASE[termIndex] + termCoeff * yearInCentury + leapYearAdjust);
        const month = Math.floor(termIndex / 2);
        return new Date(year, month, day);
    }

    static calculatePillars(year, month, day, hour, minute = 0) {
        const date = new Date(year, month - 1, day);
        
        // Year Pillar
        const lichunDate = this.getSolarTermDate(year, 2); // 3rd term (index 2) is Lichun (February)
        let adjustedYear = year;
        if (date < lichunDate) adjustedYear = year - 1;
        const yearPillar = {
            stem: HEAVENLY_STEMS[(adjustedYear - 4) % 10],
            branch: EARTHLY_BRANCHES[(adjustedYear - 4) % 12]
        };

        // Month Pillar (based on terms)
        let solarTermMonth = 0;
        for (let i = 0; i < 24; i += 2) {
            const termDate = this.getSolarTermDate(adjustedYear, i);
            if (date >= termDate) solarTermMonth = Math.floor(i / 2) + 1;
            else break;
        }
        const yearStemIndex = (adjustedYear - 4) % 10;
        const monthStemIndex = (yearStemIndex % 5 * 2 + solarTermMonth + 1) % 10;
        const monthBranches = ['자', '축', '인', '묘', '진', '사', '오', '미', '신', '유', '술', '해'];
        // Monthly branches usually start from Yin (인) for the 1st month of year (Lichun)
        const monthBranchIndex = (solarTermMonth + 1) % 12; // Adjusted for index alignment

        const monthPillar = {
            stem: HEAVENLY_STEMS[monthStemIndex],
            branch: EARTHLY_BRANCHES[monthBranchIndex]
        };

        // Day Pillar
        const BASE_DATE = new Date(1992, 9, 24); // Gye-Yu day
        const BASE_GANJI_NUM = 9;
        const daysDiff = Math.floor((date.getTime() - BASE_DATE.getTime()) / 86400000);
        const dayGanjiNum = (((BASE_GANJI_NUM + daysDiff) % 60) + 60) % 60;
        const dayPillar = {
            stem: HEAVENLY_STEMS[dayGanjiNum % 10],
            branch: EARTHLY_BRANCHES[dayGanjiNum % 12]
        };

        // Hour Pillar
        const totalMinutes = hour * 60 + minute;
        // Shift by 60 mins because Zi hour (자시) starts from 23:00 previous day
        const shichenIndex = Math.floor((totalMinutes + 60) / 120) % 12;
        const dayStemIdx = HEAVENLY_STEMS.indexOf(dayPillar.stem);
        const hourStemIndex = ((dayStemIdx % 5) * 2 + shichenIndex) % 10;
        const hourPillar = {
            stem: HEAVENLY_STEMS[hourStemIndex],
            branch: EARTHLY_BRANCHES[shichenIndex]
        };

        return { year: yearPillar, month: monthPillar, day: dayPillar, hour: hourPillar };
    }

    static getElementDistribution(pillars) {
        const stats = { '목': 0, '화': 0, '토': 0, '금': 0, '수': 0 };
        Object.values(pillars).forEach(p => {
            stats[ELEMENTS_MAP[p.stem]]++;
            stats[ELEMENTS_MAP[p.branch]]++;
        });
        return stats;
    }
}

window.SajuEngine = SajuEngine;
