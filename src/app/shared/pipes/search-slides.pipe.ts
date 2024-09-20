import { Pipe, PipeTransform } from '@angular/core';
import { MoviesModel } from '@models/movies.model';

@Pipe({
  name: 'search',
  standalone: true
})
export class SearchSlidesPipe implements PipeTransform {
  /**
   * transform
   * @param movies movies
   * @param searchTerm searchTerm
   * @returns filter movies
   */
  transform(movies: MoviesModel[], searchTerm: string): MoviesModel[] {
    if (!movies || !searchTerm) {
      return movies;
    }

    const lowerCaseTerm = searchTerm.toLowerCase();
    const filteredMovies = movies.filter(movie => {
      const matchesTitle = movie.title.toLowerCase().includes(lowerCaseTerm);
      const matchesCast = movie.cast.some(castMember => castMember.name.toLowerCase().includes(lowerCaseTerm));
      const matchesCategory = movie.categories.some(category => category.name.toLowerCase().includes(lowerCaseTerm));

      return matchesTitle || matchesCast || matchesCategory;
    });

    return filteredMovies;
  }
}
