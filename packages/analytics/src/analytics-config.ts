/**
 * Config for each type of fields
 */

import type { QuestionTypeT } from "@lit-app/app-survey/src/types.js";

type CharTypeT = 'pie' | 'bar' | 'line' | 'table' | 'text' | 'timeserie' | 'map' | 'histogram' | 'table';
type DataTypeT = 'categories' | 'nominal' | 'ordinal' | 'number' | 'date' | 'text' | 'boolean'
type ConfigAnalytics = {
  hasLookup?: boolean
  type: false | DataTypeT
}
const analyticsConfig = {
  'textfield': {
    hasLookup: true,
    type: 'text',
  },
  'number': {
    hasLookup: true,
    type: 'number',
  },
  'tel': {
    hasLookup: true,
    type: 'text',
  },
  'date': {
    hasLookup: true,
    type: 'date',
  },
  'email': {
    hasLookup: true,
    type: 'text',
  },
  'textarea': {
    hasLookup: true,
    type: 'text',
  },
  'radio': {
    hasLookup: false,
    type: 'nominal',
  },
  'dropdown': {
    hasLookup: false,
    type: 'nominal',
  },
  'checkbox': {
    hasLookup: false,
    type: 'categories',
  },
  'switch': {
    hasLookup: false,
    type: 'boolean',
  },
  'check': {
    hasLookup: false,
    type: 'boolean',
  },
  'rating': {
    hasLookup: false,
    type: 'ordinal',
  },
  'ranking': {
    hasLookup: false,
    type: 'ordinal',
  },
  'file': {
    hasLookup: false,
    type: 'text',
  },
  'image': {
    hasLookup: false,
    type: 'text',
  },
  'video': {
    hasLookup: false,
    type: 'text',
  },
  'audio': {
    hasLookup: false,
    type: 'text',
  },
  'url': {
    hasLookup: true,
    type: 'text',
  },
} as const satisfies Record<QuestionTypeT, ConfigAnalytics>;

const defaultChartConfig = {
  boolean: 'pie',
  categories: 'bar',
  nominal: 'line',
  ordinal: 'bar',
  number: 'histogram',
  date: 'timeserie',
  text: 'table',
} as const satisfies Record<DataTypeT, CharTypeT>;

type QuestTypeT = {
  items: any[]
  data: {
    props?: {
      isOrdinalScale?: boolean

    }
    subType: QuestionTypeT
    chartType?: CharTypeT
  }
}
const getDataType = (question: QuestTypeT): DataTypeT => {
  let type = analyticsConfig[question.data.subType]?.type || 'none';
  if (type === 'nominal' && question.data.props?.isOrdinalScale) {
    type = 'ordinal';
  }
  return type;
};

const getChartType = (question: QuestTypeT): CharTypeT => {
  const dataType = getDataType(question);
  let chartType = defaultChartConfig[dataType] || 'table';
  const hasLookup = analyticsConfig[question.data.subType]?.hasLookup || false;
  // Note(cg): make is a pie chart if only few keys.
  if (chartType === 'bar' && hasLookup &&
    !question.data.chartType &&
    Object.keys(question.items || {}).length < 4) {
    chartType = 'pie';
  }
  return chartType;
};

const hasSpecify = (question: QuestTypeT) => {
  if (question.items) {
    return (question.items || []).some(item => item.data?.specify);
  }
  return false;
};

export {
  analyticsConfig,
  defaultChartConfig,
  getChartType,
  getDataType,
  hasSpecify
};

