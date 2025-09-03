export interface IModule {
  _id?: string;
  title: string;
  moduleNumber: number;
  courseId: string;
  description?: string;
  isPublished?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CreateModuleData {
  title: string;
  moduleNumber: number;
  courseId: string;
  description?: string;
  isPublished?: boolean;
}

export interface UpdateModuleData {
  title?: string;
  moduleNumber?: number;
  description?: string;
  isPublished?: boolean;
}

export interface ModuleFormData {
  title: string;
  description: string;
  moduleNumber: number;
}
