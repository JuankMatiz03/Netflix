import { CastModel } from "./cast.model";
import { CategoriesModel } from "./categories.model";

/**
 * MoviesModel movies model
 */
export interface MoviesModel {
  id?: string;
  title: string;
  synopsis: string;
  image: string;
  rating: number;
  cast: CastModel[];
  categories: CategoriesModel[];
  releaseDate: Date;
}
