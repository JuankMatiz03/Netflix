import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'search',
  standalone: true,
})
export class SearchPipe implements PipeTransform {

  /**
   * transform
   * @param movies movies
   * @param searchTerm searchTerm
   * @returns movies filter
   */
  transform(movies: any[], searchTerm: string): any[] {
    if (!movies || !searchTerm) {
      return movies;
    }

    const lowerSearchTerm = searchTerm.toLowerCase();

    return movies.filter(movie =>
      movie.title.toLowerCase().includes(lowerSearchTerm)
    );
  }
}
