/* These TypeScript interfaces are defining the structure of objects related to book volumes and book
responses in a hypothetical book-related application. Here's a breakdown of what each interface
represents: */

interface AccessInfo {
  country: string;
  viewability: string;
  embeddable: boolean;
  publicDomain: boolean;
  textToSpeechPermission: string;
  epub: {
    isAvailable: boolean;
    downloadLink: string;
  };
  pdf: {
    isAvailable: boolean;
    downloadLink?: string;
  };
  webReaderLink: string;
  accessViewStatus: string;
  quoteSharingAllowed: boolean;
}

interface ImageLinks {
  smallThumbnail: string;
  thumbnail: string;
}

interface VolumeInfo {
  title: string;
  subtitle?: string;
  authors?: string[];
  publishedDate: string;
  industryIdentifiers: {
    type: string;
    identifier: string;
  }[];
  readingModes: {
    text: boolean;
    image: boolean;
  };
  pageCount: number;
  printType: string;
  categories?: string[];
  averageRating?: number;
  ratingsCount?: number;
  maturityRating: string;
  allowAnonLogging: boolean;
  contentVersion: string;
  panelizationSummary: {
    containsEpubBubbles: boolean;
    containsImageBubbles: boolean;
  };
  imageLinks: ImageLinks;
  language: string;
  previewLink: string;
  infoLink: string;
  canonicalVolumeLink: string;
}

interface SaleInfo {
  country: string;
  saleability: string;
  isEbook: boolean;
  buyLink: string;
}

interface SearchInfo {
  textSnippet: string;
}

export interface Volume {
  kind: string;
  id: string;
  etag: string;
  selfLink: string;
  volumeInfo: VolumeInfo;
  saleInfo: SaleInfo;
  accessInfo: AccessInfo;
  searchInfo?: SearchInfo;
}

export interface BookResponse {
  kind: string;
  totalItems: number;
  items: Volume[];
}
