import { Book } from './book.types';

export const bookMock: Book = {
  id: '1',
  volumeInfo: {
    title: 'title',
    subtitle: 'subtitle',
    authors: ['author'],
    publisher: 'publisher',
    publishedDate: '',
    description: 'description',
    averageRating: 3,
    ratingsCount: 5,
    imageLinks: {
      thumbnail: 'string',
      smallThumbnail: 'string',
    },
    readingModes: {
      pageCount: 1,
    },
    language: 'en',
  },
};
