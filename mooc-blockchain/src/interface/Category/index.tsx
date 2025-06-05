export interface Category {
  id: number;
  categoryName: string;
  description: string;
}

export interface CategoryCreationPayload {
  categoryName: string;
  description: string;
}

export interface CategoryUpdatePayload {
  id: number;
  categoryName: string;
  description: string;
}
