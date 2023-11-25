import * as querystring from 'query-string';
import * as request from 'request-promise';
import { DocumentServiceOptions, DocumentServiceResponse } from './interfaces';

export class DocumentService {
  private apiKey: string;
  private host: string;
  private logger: (message: any) => void;

  constructor(apiKey: string, config = {} as DocumentServiceOptions.Config) {
    this.apiKey = apiKey;

    this.host = config.host || 'https://dms.meetmaestro.com';

    if (config.logging) {
      this.logger =
        typeof config.logging === 'function' ? config.logging : console.log;
    }
  }

  setApiKey(apiKey: string) {
    this.apiKey = apiKey;
  }

  setHost(host: string) {
    this.host = host;
  }

  /**
   * This method fetches the bucket name that the connection uses
   * @return {Promise<DocumentServiceResponse.BucketResponse>}
   */
  getBucket() {
    return this.request<DocumentServiceResponse.BucketResponse>({
      path: `api/v1/bucket`,
    });
  }

  /**
   * This method fetches the pre-signed data used to upload data to S3
   * @return {Promise<T>}
   */
  getPreSignedData(payload: DocumentServiceOptions.PreSignPayload = {}) {
    const params = this.createQueryString(payload);
    return this.request<DocumentServiceResponse.PreSignResponse>({
      path: `api/v1/pre-sign${params}`,
    });
  }

  /**
   * This method fetches a signed url used to view private S3 content
   * @return {Promise<T>}
   */
  getSignedUrl(payload: DocumentServiceOptions.SigningPayload) {
    if (!payload || !payload.path) {
      throw new Error('Invalid Sign Data');
    }

    return this.request<DocumentServiceResponse.SigningResponse>({
      path: `api/v1/sign`,
      method: 'POST',
      body: payload,
    });
  }

  /**
   * This method will register the media with DMS
   * @return {Promise<T>}
   */
  register(payload: DocumentServiceOptions.RegistrationPayload) {
    if (!payload || !payload.path || !payload.fileFormat) {
      throw new Error('Invalid Registration Data');
    }

    return this.request<DocumentServiceResponse.RegistrationResponse>({
      path: 'api/v1/content',
      method: 'POST',
      body: payload,
    });
  }

  /**
   * This method will copy the media with DMS
   * @return {Promise<T>}
   */
  copy(payload: DocumentServiceOptions.ContentCopyPayload) {
    if (
      !payload ||
      !payload.sourceContentIdentity ||
      !payload.targetConnectionApiKey
    ) {
      throw new Error('Invalid Copy Data');
    }

    return this.request<DocumentServiceResponse.RegistrationResponse>({
      path: `api/v1/content/${payload.sourceContentIdentity}/copy`,
      method: 'POST',
      body: payload,
    });
  }

  generateMediaFromWordTemplate(
    payload: DocumentServiceOptions.WordTemplateRequestPayload
  ) {
    if (
      !payload ||
      (!payload.templateIdentity && !payload.contentIdentity) ||
      !payload.payload
    ) {
      return new Error('Invalid template request');
    }

    return this.request<DocumentServiceResponse.WordTemplateRequestResponse>({
      path: 'api/v1/word-template',
      method: 'POST',
      body: payload,
    });
  }

  /**
   * This method will ping DMS for the view information on registered media
   * @return {Promise<T>}
   */
  view(payload: DocumentServiceOptions.ViewPayload) {
    if (!payload.identity) {
      throw new Error('Invalid View Data');
    }

    const params = this.createQueryString({
      registrationId: payload.registrationId,
      learnerFirstName: payload.learnerFirstName,
      learnerLastName: payload.learnerLastName,
      learnerIdentity: payload.learnerIdentity,
    });

    return this.request<DocumentServiceResponse.ViewResponse>({
      path: `api/v1/content/${payload.identity}/view${params}`,
    });
  }

  /**
   * This method will ping DMS for the status on content
   * @return {Promise<T>}
   */
  status(payload: DocumentServiceOptions.ContentStatusPayload) {
    if (!payload.identity) {
      throw new Error('Invalid View Data');
    }

    return this.request<DocumentServiceResponse.ContentStatusResponse>({
      path: `api/v1/content/${payload.identity}/status`,
    });
  }

  /**
   * This method will get the learning standard for a content item
   * @return {Promise<T>}
   */
  getCourseLearningStandard(
    payload: DocumentServiceOptions.CourseLearningStandardPayload
  ) {
    if (!payload.identity) {
      throw new Error('Invalid Data');
    }

    return this.request<DocumentServiceResponse.CourseLearningStandardResponse>(
      {
        path: `api/v1/scorm/${payload.identity}`,
      }
    );
  }

  /**
   * This method will get the xapi statements for a registration
   * @return {Promise<T>}
   */
  getXApiStatementsForARegistration(
    payload: DocumentServiceOptions.XApiStatementsPayload
  ) {
    if (!payload.registrationIdentity) {
      throw new Error('Invalid Data');
    }

    return this.request<any>({
      path: `api/v1/scorm/registration/${payload.registrationIdentity}/xapi-statements`,
    });
  }
  
  /**
   * This method will get the interactions for a registration
   * @return {Promise<T>}
   */
  getInteractionsForARegistration(
    payload: DocumentServiceOptions.XApiStatementsPayload
  ) {
    if (!payload.registrationIdentity) {
      throw new Error('Invalid Data');
    }

    return this.request<any>({
      path: `api/v1/scorm/registration/${payload.registrationIdentity}/interactions`,
    });
  }

  /**
   * The default request options used with request
   * @return {Object}
   */
  private get defaultRequestOptions(): DocumentServiceOptions.RequestOptions {
    return {
      uri: `${this.host}`,
      method: 'GET',
      json: true,
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
      },
      resolveWithFullResponse: true,
    };
  }

  /**
   * This method with go through an create the query string used for
   * several methods
   * @return {String}
   */
  private createQueryString(queryObj: any) {
    return Object.keys(queryObj).length
      ? `?${querystring.stringify(queryObj)}`
      : '';
  }

  /**
   * This method builds the request and returns the promise chain
   * @return {Promise<T>}
   */
  private request<T>(
    options: DocumentServiceOptions.RequestOptions = {}
  ): Promise<T> {
    const startTime = Date.now();
    const requestOptions = this.defaultRequestOptions;
    requestOptions.method = options.method || requestOptions.method;
    requestOptions.uri += `/${options.path}`;
    requestOptions.body = options.body;
    requestOptions.formData = options.formData;

    if (options.headers && options.headers.length > 0) {
      requestOptions.headers = Object.assign(
        {},
        requestOptions.headers,
        options.headers
      );
    }
    return new Promise((resolve, reject) => {
      request(requestOptions as any)
        .then((response) => {
          if (this.logger) {
            this.logger({
              statusCode: response.statusCode,
              body: response.body,
              duration: Date.now() - startTime,
            });
          }
          resolve(response.body);
        })
        .catch((error) => {
          reject({
            error,
            status: error.statusCode || 500,
            message: error.message,
            duration: Date.now() - startTime,
          });
        });
    });
  }
}
