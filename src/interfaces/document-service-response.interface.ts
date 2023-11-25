import {
    MediaProcessingCallbackStatus,
    MediaProcessingCallbackType,
} from '../types';
import { ContentStatus } from '../types/content-status.type';

// tslint:disable-next-line:no-namespace
export namespace DocumentServiceResponse {
    export interface MediaProcessingCallback {
        type: MediaProcessingCallbackType;
        status: MediaProcessingCallbackStatus;
        identity: string;
        locationUrl?: string;
        processUrl?: string;
        errorMessage?: string;
    }

    export interface PreSignResponse {
        // Everything in this top section is returned by the Document Service Sign Upload
        key: string;
        AWSAccessKeyId: string;
        acl: string;
        policy: string;
        signature: string;
        url: string;
        expiration: string;
        // The optional properties in this bottom section are configured in this client and returned to calling functions
        originalFilename?: string;
        fileExtension?: string;
    }
    export interface SigningResponse {
        url: string;
        expiration: number;
    }

    export interface RegistrationResponse {
        identity: string;
    }

    export interface WordTemplateRequestResponse {
        identity: string;
        resourceUrl: string;
    }

    export interface ViewResponse {
        // The status code
        statusCode: number;
        // The status message
        message?: string;
        // The aws signed url for pulling directly from s3
        url: string;
        // The expiration of the signed url
        expiration: string;
        // The file format
        fileFormat: string;
        // The aws signed url for downloading
        downloadUrl?: string;
        // The converted content's view response
        convertedContent?: ViewResponse;
    }

    export interface ContentStatusResponse {
        // The status
        status: ContentStatus;
    }

    export interface BucketResponse {
        // The Bucket
        bucket: string;
    }

    export interface CourseLearningStandardResponse {
        courseIdentity: string;
        courseTitle: string;
        courseLearningStandard: string;
    }

    export interface CourseInteractionsApiResponse {
        interactions: {
            id: string;
            type: string;
            objectives: string[];
            timestamp: string;
            timestampUtc: string;
            correctResponses: string[];
            weighting: string;
            learnerResponse: string;
            result: string;
            latency: string;
            description: string;
        }[];
    }
}
