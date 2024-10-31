export interface Todo {
    _id?: string; 
    userId: number,
    title: string,
    taskDesc: string,
    checked: boolean,
    isEditing?: boolean; 
    isDeleted?:boolean;
 }