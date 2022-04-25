export default interface DocumentRequest {
  content?: string;
  contentType: string;
  templateId: number;
  documentTypeId: number;
  patientId: number;
  //referralId?: number,
  //episodeOfCareId?: number,
  //departmentId?: number,
  //plannedContactId?: number,
  authorId: number;
  eventTime?: string;
  //eprGroupIds: number[],
  //sectionId?: number,
  //wardId?: number,
  documentFormat: number;
  //folderId: string
}
