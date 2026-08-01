window.MINIMBA_DATA = {
  brand: "Ateira",
  program: "MiniMBA",
  accessCode: "ATEIRA-DEMO",
  videos: [
    {
      id: "contract-35000",
      lesson: "Неделя 1 · Экономика проекта",
      title: "Контракт на 35 000 AED",
      description: "Разбор выручки, затрат, прибыли и кассового разрыва на сквозном кейсе Studio North.",
      src: "./materials/first_lessons/Контракт_35_000_AED.mp4"
    },
    {
      id: "business-system",
      lesson: "Вводный урок 1",
      title: "Бизнес как система",
      description: "Как связаны клиент, ценность, способ её доставки и экономика бизнеса.",
      src: "./materials/first_lessons/Бизнес_как_система.mp4"
    },
    {
      id: "segment-choice",
      lesson: "Вводный урок 2 · Стратегия",
      title: "Выбор одного сегмента",
      description: "Почему стратегия требует фокуса и как выбрать поле, на котором бизнес будет побеждать.",
      src: "./materials/first_lessons/Выбор_1_сегмента.mp4"
    }
  ],
  resources: [
    {
      title: "Рабочая тетрадь",
      description: "Входная диагностика, кейсы, шаблоны и план управленческого эксперимента.",
      format: "DOCX · участнику",
      href: "./materials/first_lessons/MiniMBA_Рабочая_тетрадь_уроки_1-2_FINAL.docx"
    },
    {
      title: "Руководство преподавателя",
      description: "Сценарии двух занятий, ключи к расчётам, вопросы и рубрика оценки.",
      format: "DOCX · преподавателю",
      href: "./materials/first_lessons/MiniMBA_Руководство_преподавателя_уроки_1-2_FINAL.docx"
    },
    {
      title: "Бизнес как система",
      description: "Презентация о связи клиентской ценности, операций и экономики.",
      format: "PPTX · урок 1",
      href: "./materials/first_lessons/MiniMBA_Урок_1_Бизнес_как_система.pptx"
    },
    {
      title: "Стратегия как набор выборов",
      description: "Презентация о фокусе, способе победы, отказах и экспериментах.",
      format: "PPTX · урок 2",
      href: "./materials/first_lessons/MiniMBA_Урок_2_Стратегический_выбор.pptx"
    }
  ],
  competencies: [
    { id: "finance", label: "Финансы", score: 62, color: "#ef775c" },
    { id: "accounting", label: "Учёт", score: 48, color: "#efb84f" },
    { id: "analytics", label: "Аналитика", score: 71, color: "#4a9b91" },
    { id: "english", label: "Деловой английский", score: 66, color: "#7871c8" }
  ],
  modules: [
    {
      id: "business-math",
      number: "01",
      title: "Экономика проекта",
      subtitle: "Бизнес-математика без страха",
      color: "coral",
      weeks: [
        {
          id: "revenue-profit",
          number: 1,
          title: "Выручка ≠ прибыль",
          duration: "32 мин",
          type: "Урок + практика",
          description: "Разберитесь, куда исчезают деньги проекта, и соберите первую экономическую модель.",
          terms: ["Revenue — выручка", "Cost — затраты", "Profit — прибыль", "Cash flow — денежный поток"]
        },
        { id: "growth", number: 2, title: "Рост, доли и проценты", duration: "44 мин", type: "Урок + задачи" },
        { id: "margin", number: 3, title: "Маржа и вклад в покрытие", duration: "51 мин", type: "Видео + лаборатория" },
        { id: "break-even", number: 4, title: "Точка безубыточности", duration: "58 мин", type: "Кейс + тест" }
      ]
    },
    {
      id: "accounting",
      number: "02",
      title: "Финансовый учёт",
      subtitle: "Три отчёта — одна история",
      color: "gold",
      weeks: [
        { id: "transactions", number: 5, title: "Логика операций", duration: "46 мин", type: "Симулятор" },
        { id: "pnl", number: 6, title: "Отчёт о прибыли и убытках", duration: "55 мин", type: "Урок + шаблон" },
        { id: "balance", number: 7, title: "Баланс", duration: "50 мин", type: "Практикум" },
        { id: "cashflow", number: 8, title: "Движение денег", duration: "62 мин", type: "Кейс + тест" }
      ]
    },
    {
      id: "modeling",
      number: "03",
      title: "Финансовая модель",
      subtitle: "От таблицы к решению",
      color: "teal",
      weeks: [
        { id: "formulas", number: 9, title: "Формулы и структура", duration: "48 мин", type: "Лаборатория" },
        { id: "forecast", number: 10, title: "Прогноз и загрузка", duration: "57 мин", type: "Модель" },
        { id: "scenarios", number: 11, title: "Три сценария", duration: "53 мин", type: "Симулятор" },
        { id: "sensitivity", number: 12, title: "Чувствительность модели", duration: "60 мин", type: "Проект" }
      ]
    },
    {
      id: "marketing",
      number: "04",
      title: "Маркетинг и рынок",
      subtitle: "Следующий этап программы",
      color: "violet",
      comingSoon: true,
      weeks: []
    }
  ],
  todayTasks: [
    { id: "video", label: "Интерактивный разбор", title: "Выручка ≠ прибыль", time: "8 мин", icon: "play" },
    { id: "practice", label: "Практика", title: "Экономика дизайн-проекта", time: "15 мин", icon: "calculator" },
    { id: "terms", label: "Повторение", title: "4 новых термина", time: "5 мин", icon: "cards" }
  ],
  project: {
    title: "Экономика дизайн-студии",
    subtitle: "Квартальный проект · модуль 1 из 3",
    rubric: [
      ["Исходные данные", 15],
      ["Логика выручки и затрат", 20],
      ["Маржа и безубыточность", 20],
      ["Связность отчётов", 20],
      ["Сценарии", 15],
      ["Рекомендация", 10]
    ]
  }
};
