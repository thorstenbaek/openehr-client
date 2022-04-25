export default interface DocumentRequest {
    content?: string;
    contentType: string;
    templateId: number;
    documentTypeId: number;
    patientId: number;
    authorId: number;
    eventTime?: string;
    documentFormat: number;
}
