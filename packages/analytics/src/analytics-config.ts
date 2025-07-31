/**
 * Config for each type of fields
 */

import type { QuestionT } from "@lit-app/app-survey/src/entity/types.recursive.js";
import type { QuestionTypeT } from "@lit-app/app-survey/src/types.js";
import { Schema } from 'effect';


export type QuestionFieldT = QuestionT & {
  $parentId: string
  groupBy: string
  chartType?: CharTypeT // metaData field
  dataType?: DataTypeT // metaData field

  ;
}

const charTypes = ['pie', 'bar', 'line', 'table', 'text', 'timeseries', 'map', 'histogram'] as const;
export const CharType = Schema.Literal(...charTypes);
export type CharTypeT = Schema.Schema.Type<typeof CharType>;

const dataTypes = ['categories', 'nominal', 'ordinal', 'number', 'date', 'text', 'boolean', 'geo'] as const;
export const DataType = Schema.Literal(...dataTypes);
export type DataTypeT = Schema.Schema.Type<typeof DataType>;

const ConfigAnalytics = Schema.Struct({
  hasLookup: Schema.optional(Schema.Boolean),
  type: Schema.Union(Schema.Literal(false), DataType)
});
type ConfigAnalytics = Schema.Schema.Type<typeof ConfigAnalytics>;

const questTypeToDataType = {
  'textfield': 'text',
  'number': 'number',
  'tel': 'text',
  'date': 'date',
  'email': 'text',
  'textarea': 'text',
  'radio': 'nominal',
  'dropdown': 'nominal',
  'checkbox': 'categories',
  'switch': 'boolean',
  'check': 'boolean',
  'rating': 'ordinal',
  'ranking': 'ordinal',
  'file': 'text',
  'image': 'text',
  'video': 'text',
  'audio': 'text',
  'url': 'text',
  'map': 'geo',
} as const satisfies Record<QuestionTypeT | 'map', DataTypeT>;

type ConfigAnalyticsT = {
  hasLookup: boolean
}
const dataTypeAnalyticsConfig = {
  'categories': {
    hasLookup: true,
  },
  'nominal': {
    hasLookup: true,
  },
  'ordinal': {
    hasLookup: true,
  },
  'number': {
    hasLookup: false,
  },
  'date': {
    hasLookup: false
  },
  'text': {
    hasLookup: false,
  },
  'boolean': {
    hasLookup: false,
  },
  'geo': {
    hasLookup: false,
  },
  'none': {
    hasLookup: false,
  }
} as const satisfies Record<DataTypeT | 'none', ConfigAnalyticsT>;


const dataTypeToChart = {
  boolean: 'pie',
  categories: 'bar',
  nominal: 'pie',
  ordinal: 'bar',
  number: 'histogram',
  date: 'timeseries',
  text: 'table',
  geo: 'map',
  none: 'table',
} as const satisfies Record<DataTypeT | 'none', CharTypeT>;

const getAnalyticsConfig = (question: QuestionFieldT): ConfigAnalyticsT => {

  const dataType = getDataType(question);
  const config = dataTypeAnalyticsConfig[dataType];
  if (!config) {
    throw new Error(`No analytics config for question type ${dataType}`);
  }
  return config;
};
const getDataType = (question: QuestionFieldT): DataTypeT | 'none' => {
  if (question.dataType) {
    return question.dataType;
  }
  const subType = question.data.subType as QuestionTypeT;
  let type = questTypeToDataType[subType];
  if (type === 'nominal' && question.data.props?.isOrdinalScale) {
    type = 'ordinal';
  }
  const q = -question
  return type as DataTypeT | 'none';
};

const getChartType = (question: QuestionFieldT): CharTypeT => {
  if (question.chartType) {
    return question.chartType;
  }
  const dataType = getDataType(question);

  return dataTypeToChart[dataType];

};

const hasSpecify = (question: QuestionT) => {
  if (question.data.items) {
    return (question.data.items || []).some(item => item.data?.props.specify);
  }
  return false;
};

const hasLookup = (question: QuestionFieldT): boolean => {
  const config = getAnalyticsConfig(question);
  return config.hasLookup;
};

export {
  dataTypeToChart, getAnalyticsConfig, getChartType, getDataType, hasLookup, hasSpecify
};

