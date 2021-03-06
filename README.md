# node-document-service
A TypeScript NodeJS client that interfaces with the Maestro Document Service

# Getting Started

Run this to install the latest stable version.

```
npm i @teammaestro/node-document-service
```

Import `@teammaestro/node-document-service` and the client will be exported into your script from the latest build.

`import { DocumentService } from 'node-document-service';`

# Documentation
## Overview
### new DocumentService(apiKey: string, options?: { host?: string, logging?: boolean | Function })
**Parameters:**

* apiKey (string) - This is the API Key from your document managment service account
* options.host (string | _optional_ | _default: https://dms.meetmaestro.com_) - The domain that DMS is located at
* options.logging (boolean or Function | _optional_ ) - Use this to turn on logging or pass in your custom logger.

**Request Example:**
```javascript
new DocumentService(apiKey: '123', {
    host: 'https://dev-dms.meetmaestro.com',
    logging: console.log
})
```

### .catch()
Whenever the API makes a call and runs into a catch block, you will get an error block that looks consistently like this:

|Name|Type|Description|
|---|---|---|
|error|Error|The exception that was thrown|
|status|number|The HTTP Status Code|
|message|string|The HTTP error message (some are custom mapped)|
|duration|number|How long the response took in miliseconds|

**Response Example:**
```
{
    error: Error
    status: 500,
    message: 'Internal Server Error',
    duration: 300
}
```

### getPreSignedData({ filename: string, acl: string,  expiration: number }) [GET /api/v1/pre-sign](https://dev-dms.meetmaestro.com/docs/development/index.html#api-Signing-Pre_Sign_Url)

This endpoint is used for creating policies in order to upload content to your S3 bucket Note: You must send the payload to S3 in the order that we send them back.

You can append anything you want to the `key` property (including the file extension).

You can also update the `Content-Type` to the real mime-type.

**Parameters**

|Name|Type|Required|Description|
|---|---|---|---|
|filename|string | False (_default: UUID_)| Set this if you want to name the file.|
|acl|string | False (_default: private_)| This is the permissions for the file. Options are `private|public`|
|expiration|number | False (_default: 1800_) | This is expiration time for the signature in seconds|

**Request Example:**
```javascript
dms.getPreSignedConfig({
    acl: 'public',
    filename: 'test.pdf',
    expiration: 120
})
```

**Response Example:**
```
{
    "url": "https://new-media-test-bucket.s3.amazonaws.com",
    "key": "a8231d87-c327-4cfc-a225-d1567de732ce",
    "Content-Type": "binary/octet-stream",
    "AWSAccessKeyId": "AKIAIF4CQIVFLH2VGVNA",
    "acl": "public-read",
    "policy": "eyJleHBpcmF0aW9uIjoiMjAxNy0wMi0xM1QwN...",
    "signature": "mmgVVFG6swkWvm3AmWZ9FB71R8s=",
    "expiration": "2017-04-06T14:49:16.267Z"
}
```

### getSignedUrl(url: string, expiration: number) [GET /api/v1/sign](https://dev-dms.meetmaestro.com/docs/development/index.html#api-Signing-Sign_Url)
This endpoint is used for signing your S3 private content

**Parameters**

|Name|Type|Required|Description|
|---|---|---|---|
|url|string|True| The url of the private S3 content you want to view|
|expiration|number| False (_default: 1800_)| This is expiration time for the signature in seconds|

**Request Example:**
```javascript
dms.getSignedUrl('https://new-media-test-bucket.s3.amazonaws.com/test.pdf', 2000)
```
**Response Example:**
```
{
  "url": "https://bucket.s3.amazonaws.com/73aff5ee-a986-4af...",
  "expiration": "2017-04-06T14:49:16.267Z"
}
```

### register(options: DocumentServiceOptions.RegistrationData) [POST /api/v1/content] (https://dev-dms.meetmaestro.com/docs/development/index.html#api-Content-Registration)
This endpoint is used to register your content with the document service.

**Parameters**

|Name|Type|Required|Description|
|---|---|---|---|
|options.title|string|True| The title of the content|
|options.path|string|True| The location of the content in S3|
|options.fileFormat|MediaType|True| The format of the file
|options.convertFormat|boolean|False| The format to convert the file to|
|options.shouldGenerateThumbnail|boolean|False| If a thumbnail should be generated|

**Request Example:**
```javascript
dms.register({
    title: 'Training Intro',
    path: 'https://new-media-test-bucket.s3.amazonaws.com/test.pdf',
    fileFormat: 'PDF',
    shouldGenerateThumbnail: true
})
```
**Response Example:**
```
{
  "identity": "ad9991a8-ab82-4521-befe-a8f2f956ce12"
}
```

### view(options: DocumentServiceOptions.ViewOptions) [GET /api/v1/content/:identity/view] (https://dev-dms.meetmaestro.com/docs/development/index.html#api-Content-View)
This endpoint is used for generating the information you need to view the content

The payload will be a little dynamic based on the content type

**Parameters**

|Name|Type|Required|Description|
|---|---|---|---|
|options.identity|string|True| The identity that DMS will use for callbacks|
|options.registrationId|string|False| The registrationId of the course in scorm engine|

**Request Example:**
```javascript
dms.view({
    identity: 'ad9991a8-ab82-4521-befe-a8f2f956ce12'
})
```

**Response Example:**
```
{
  "url": "https://bucket.s3.amazonaws.com/73aff5ee-a986-4af...",
  "expiration": "2017-04-06T14:49:16.267Z",
  "downloadUrl": "https://bucket.s3.amazonaws.com/73aff5ee-a986-4af...",
  "fileFormat": "docx",
  "convertedContent": {
    "url": "https://bucket.s3.amazonaws.com/73aff5ee-a986-4af...",
    "expiration": "2017-04-06T14:49:16.267Z",
    "downloadUrl": "https://bucket.s3.amazonaws.com/73aff5ee-a986-4af...",
    "fileFormat": "pdf",
  }
}
```

# Contributors

[<img alt="John Pinkster" src="https://avatars1.githubusercontent.com/u/5350861?v=3&s=460" width="117">](https://github.com/jpinkster)|
:---: |
[John Pinkster](https://github.com/jpinkster)|
