import * as yup from 'yup';
import { createHmac } from 'crypto';

export const isValidLTIRequest = (body: LTIBody, ltiConsumerSecret: string, url: string) => {
  switch (body.lti_version) {
    case 'LTI-1p0':
      return isValid_LTI_1p0(body, ltiConsumerSecret, url);
    default:
      throw new Error(`LTI version not implemented: ${body.lti_version}`);
  }
};

const isValid_LTI_1p0 = (body: LTIBody, ltiConsumerSecret: string, url: string): boolean => {
  const { oauth_signature, ...data } = body;
  const { oauth_timestamp } = data;

  let baseString = '';
  let entries = Object.entries(data).sort((a, b) => a[0].localeCompare(b[0]));
  baseString = entries.map(([key, value]) => `${key}=${fixedEncodeURIComponent(value)}`).join('&');
  baseString = `POST&${fixedEncodeURIComponent(url)}&${fixedEncodeURIComponent(baseString)}`;

  const secret = `${fixedEncodeURIComponent(ltiConsumerSecret)}&`;
  const newSignature = createHmac('sha256', secret).update(baseString).digest('base64');
  return oauth_signature === newSignature && parseInt(oauth_timestamp) + 1800 > Date.now() / 1000;
};

function fixedEncodeURIComponent(str) {
  return encodeURIComponent(str).replace(/[!'()*]/g, function (c) {
    return '%' + c.charCodeAt(0).toString(16).toUpperCase();
  });
}
export const schemaLTI = yup.object().shape({
  lti_version: yup.string().required(),
  lti_message_type: yup.string(),
  oauth_consumer_key: yup.string(),
  oauth_version: yup.string(),
  oauth_nonce: yup.string(),
  oauth_timestamp: yup.string().required(),
  oauth_signature_method: yup.string().required(),
  tool_consumer_info_product_family_code: yup.string().required(),
  tool_consumer_info_version: yup.string().required(),
  tool_consumer_instance_guid: yup.string(),
  tool_consumer_instance_name: yup.string(),
  tool_consumer_instance_description: yup.string(),
  tool_consumer_instance_url: yup.string().url(),
  tool_consumer_instance_contact_email: yup.string().email(),
  resource_link_id: yup.string(),
  resource_link_title: yup.string(),
  resource_link_description: yup.string(),
  user_id: yup.string().required(),
  roles: yup.string().required(),
  lis_person_name_full: yup.string().required(),
  lis_person_name_family: yup.string().required(),
  lis_person_name_given: yup.string().required(),
  lis_person_contact_email_primary: yup.string().email().required(),
  lis_person_sourcedid: yup.string().required(),
  context_id: yup.string().required(),
  context_type: yup.string().required(),
  context_title: yup.string().required(),
  launch_presentation_locale: yup.string().required(),
  launch_presentation_document_target: yup.string().required(),
  lis_outcome_service_url: yup.string().url().required(),
  lis_result_sourcedid: yup.string().required(),
  oauth_signature: yup.string().required()
});

export type LTIBody = yup.InferType<typeof schemaLTI>;
