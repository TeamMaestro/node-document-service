export namespace DocumentServiceOptions {
  export interface Config {
    host?: string;
    logging?: boolean | ((message: any) => void);
  }

  export interface RequestOptions {
    path?: string;
    uri?: string;
    postData?: any;
    resolveWithFullResponse?: boolean;
    json?: boolean;
    statusCodes?: { [key: number]: string };
    headers?: { [key: string]: any };
    body?: any;
    formData?: any;
    method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'COPY' | 'HEAD';
  }

  export interface FileConfig {
    directory: string;
    filename: string;
    fileExtension?: string;
  }

  export interface PreSignPayload {
    filename?: string;
    acl?: 'private' | 'public';
    expiration?: number;
  }

  export interface SigningPayload {
    path: string;
    filename?: string;
    expiration?: number;
  }

  export interface RegistrationPayload {
    // if provided, content will be created with this uuid as the identity
    identity?: string;
    // The title of the content
    title: string;
    // The location of the content in S3
    path: string;
    // The format of the file
    fileFormat: string;
    // The format to convert the file to
    convertFormat?: string;
    // If a thumbnail should be generated
    shouldGenerateThumbnail?: boolean;
    /**
     * An open metadata field that will be returned on all callback
     * requests.
     */
    metadata?: any;
  }

  export interface CopyPayload {
    //Identity of the source content to copy
    sourceContentIdentity: string;

    // If an identity is provided, the target content will be made with the given identity as its content identity in dms
    targetContentIdentity?: string;

    //API Key for the target connection
    targetConnectionApiKey: string;

    // The format to convert the file to
    convertFormat?: string;

    // If a thumbnail should be generated
    shouldGenerateThumbnail?: boolean;

    /**
     * An open metadata field that will be returned on all callback
     * requests.
     */
    metadata?: any;
  }

  export interface WordTemplateRequestPayload {
    /**
     * Identity of the template for the request. This is the identity of a template
     * set up specifically for word template registrations.
     */
    templateIdentity?: string;

    /**
     * Identity of a word doc content in dms that will be used to register the template
     * request.
     */
    contentIdentity?: string;

    /**
     * The title of the output
     */
    title: string;

    /**
     * The payload to use for the template
     */
    payload: WordTemplatePayload;

    /**
     * Metadata used to identify the request upon callback
     */
    metadata: any;
  }

  export interface WordTemplatePayload {
    replacements?: {
      [key: string]: string;
    };
    images?: {
      [key: string]: ImagePayload;
    };
  }

  export interface ImagePayload {
    url?: string;
    svgString?: string;
    height?: number;
    width?: number;
  }

  export interface ViewPayload {
    // The identity of the content
    identity: string;
    // The registrationId of the course in scorm engine
    registrationId?: string;

    // the first name of the learner as will be reported to scorm engine
    learnerFirstName?: string;
    // the last name of the learner as will be reported to scorm engine
    learnerLastName?: string;
    // the identity of the learner as will be reported to scorm engine
    learnerIdentity?: string;
  }

  export interface ContentStatusPayload {
    // The identity of the content
    identity: string;
  }

  export interface CourseLearningStandardPayload {
    // The identity of the content
    identity: string;
  }

  export interface XApiStatementsPayload {
    // The identity of the registration to get xapi statements for
    registrationIdentity: string;
  }
}
