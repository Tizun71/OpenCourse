export interface EventCreationRequest {
    title: string;
    startedAt: string;
    endedAt: string;
    userId: number;
}

export interface EventUpdateRequest {
    id: number;
    title: string;
    startedAt: string;
    endedAt: string;
    userId: number;
}

export interface EventResponse {
    id:number,
    title: string,
    startedAt: Date,
    endedAt: Date
}
  