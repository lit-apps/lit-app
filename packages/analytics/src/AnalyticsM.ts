import { LocaleUI, ResourceStructFact } from '@lit-app/model/src/types';
import { Schema } from 'effect';

import { CharType, DataType } from "./analytics-config.js";

const Layout = Schema.Struct({
  column: Schema.optional(Schema.Number),
  // flex: Schema.Literal('default', 'horizontal', 'vertical', ''),
  // direction: Schema.Literal('reversed', ''),
  setPosition: Schema.optional(Schema.Boolean),
  colStart: Schema.optional(Schema.Number),
  colEnd: Schema.optional(Schema.Number),
  rowStart: Schema.optional(Schema.Number),
  rowEnd: Schema.optional(Schema.Number),
});

const analyticsField = Schema.Struct({
  label: Schema.String,
  type: Schema.String,
  _key: Schema.String,
  hidden: Schema.optional(Schema.Boolean),
  dataType: DataType,
  chartType: CharType,
  groupBy: Schema.String,
  locale: Schema.Struct({
    title: Schema.String,
    description: Schema.optional(Schema.String),
  }),
});

const metaField = Schema.Struct({
  ...analyticsField.fields,
  type: Schema.Literal('metaField'),
  layout: Schema.optional(Layout),
});
export type MetaFieldT = Schema.Schema.Type<typeof metaField>;


const Ref = Schema.Struct({
  survey: Schema.String,
});

const MetaData = Schema.Struct({
  type: Schema.Literal('analytics'),
});



const ColorRange = Schema.Array(Schema.String);

const Margin = (m: 'Margin' | 'Padding') => Schema.Struct({
  [`right${m}`]: Schema.optional(Schema.Number),
  [`left:${m}`]: Schema.optional(Schema.Number),
  [`top: ${m}`]: Schema.optional(Schema.Number),
  [`bottom${m}`]: Schema.optional(Schema.Number),
});




const Config = Schema.Struct({
  generic: Schema.Struct({
    colorRange: ColorRange,
    ...Margin('Margin').fields,
  }),
  dataType: Schema.Struct({
    nominal: Schema.Struct({
      colorRange: ColorRange,
    }),
    ordinal: Schema.Struct({
      colorRange: ColorRange,
    }),
    continuous: Schema.Struct({
      colorRange: ColorRange,
    }),
  }),
  chart: Schema.Struct({
    table: Schema.Struct({
      maxRows: Schema.optional(Schema.Number),
    }),
    pie: Schema.Struct({
      pieWidth: Schema.optional(Schema.String),
    }),
    bar: Schema.Struct({
      ...Margin('Margin').fields,
      ...Margin('Padding').fields,
      bottomTicks: Schema.optional(Schema.Number),
    }),
    map: Schema.Struct({
      colorRange: ColorRange,
    }),
  }),
});

const props = Schema.Struct({
  pinnedFields: Schema.optional(Schema.Array(Schema.String)),
  layout: Layout,
  config: Config,
  metaFields: Schema.Array(metaField),
});

const AnalyticsStruct = ResourceStructFact(
  props,
  MetaData,
  Ref
)

export class AnalyticsLocaleUI extends LocaleUI.extend<AnalyticsLocaleUI>("AnalyticsLocaleUI")({
}) { }

export class AnalyticsUI extends Schema.Class<AnalyticsUI>("AnalyticsUI")(
  AnalyticsStruct
) { }


export interface AnalyticsI extends
  AnalyticsUI,
  AnalyticsLocaleUI { }

