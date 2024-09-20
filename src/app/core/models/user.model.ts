import { MoviesModel } from "./movies.model";

/**
 * UserModel user model
 */
export interface UserModel {
  id?: string;
  name: string;
  email: string;
  favorites: MoviesModel[];
  watchLater: MoviesModel[];
}
