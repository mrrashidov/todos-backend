import { Issue } from "../entities/issue.entity";

export interface SelectIssue{
     parentIssue: Issue,
     childIssue: Issue[]
}