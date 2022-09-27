export interface Assignment {
    id: number,
    name: string,
    submitted: boolean,
    grade: number,
    deadline: Date | null,
    mandatory: boolean,
}