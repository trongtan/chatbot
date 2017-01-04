import constantMirror from 'constant-mirror';

export const FACEBOOK_GET_STARTED_PAYLOAD = 'USER_DEFINED_PAYLOAD';
export const DEFAULT_TYPE_KEYWORD = 'thong tin';
export const DEFAULT_MAXIMUM_PAYLOAD_ELEMENT = 10;
export const DEFAULT_MAXIMUM_QUICK_REPLY_ELEMENT = 11;
export const GENERAL_TYPE = 1;
export const INFORMATION_PREVENTION_TREATMENT_TYPE = 2;
export const DISEASE_TYPE = 3;
export const DEFAULT_DATE_FORMAT = 'YYYY-MM-DD HH:mm:ss';

export const CATEGORY_TYPE = 'CATEGORY_TYPE';
export const SUBCATEGORY_TYPE = 'SUBCATEGORY_TYPE';

export const SUBSCRIBE = 'SUBSCRIBE';
export const UNSUBSCRIBE = 'UNSUBSCRIBE';
export const MORE_STORY = 'MORE_STORY';

export const DEFAULT_SEPARATOR_PAYLOAD = '~';
export const DEFAULT_RSS_PAYLOAD = 'REQUEST_RSS_PAYLOAD';
export const DEFAULT_UNSUPPORTED_PAYLOAD = 'UNSUPPORTED_PAYLOAD';


const payloadPrefixConstants = constantMirror(
  'GET_INFO_DISEASE'
);

const payloadConstants = constantMirror(
  'GET_STARTED_PAYLOAD',
  'GREETING_PAYLOAD',
  'GUIDE_PAYLOAD',
  'GET_INFORMATION_PAYLOAD',
  'CHAT_PAYLOAD',
  'SEARCH_BY_DISEASE_PAYLOAD',
  'SEARCH_BY_REGION_PAYLOAD',
  'CHAT_PAYLOAD',
  'ASK_HEALTH_PAYLOAD',
  'READY_TO_CHAT_PAYLOAD',
  'NOT_READY_TO_CHAT_PAYLOAD',
  'IS_DAD_PAYLOAD',
  'IS_MOM_PAYLOAD',
  'NO_CHILDREN_PAYLOAD',
  'ASK_PARENT_PAYLOAD',
  'ASK_CHILD_NAME_PAYLOAD',
  'ASK_FAVORITE_TIME_PAYLOAD',
  'UNSUPPORTED_PAYLOAD'
);

const parentalConstants = constantMirror(
  'DAD', 'MOM', 'NA'
);

export {
  payloadConstants,
  parentalConstants,
  payloadPrefixConstants
};
