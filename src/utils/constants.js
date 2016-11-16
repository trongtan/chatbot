import constantMirror from 'constant-mirror';

export const FACEBOOK_GET_STARTED_PAYLOAD = 'USER_DEFINED_PAYLOAD';
export const DEFAULT_TYPE_KEYWORD = 'thong tin';
export const DEFAULT_MAXIMUM_PAYLOAD_ELEMENT = 10;

const payloadConstants = constantMirror(
  'GET_STARTED_PAYLOAD',
  'GREETING_PAYLOAD',
  'DISEASE_PAYLOAD'
);

export {
  payloadConstants
};
